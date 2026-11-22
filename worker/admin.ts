interface AdminEnvironment {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_LOGIN_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
}

const COOKIE = '__Host-shivansh-admin';
const SESSION_SECONDS = 3600;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const encoder = new TextEncoder();
const extensions = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function reply(status: number, body: Record<string, unknown>, cookie?: string) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...(cookie ? { 'Set-Cookie': cookie } : {}) },
  });
}

function sessionCookie(value: string, age: number) {
  return `${COOKIE}=${value}; Max-Age=${age}; Path=/; Secure; HttpOnly; SameSite=Strict`;
}

async function signingKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function hex(data: ArrayBuffer) {
  return Array.from(new Uint8Array(data), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function verifyAdminSession(request: Request, key: CryptoKey) {
  const cookie = request.headers.get('Cookie')?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  const match = cookie?.match(/^(\d{1,12}\.[0-9a-f-]{36})\.([0-9a-f]{64})$/);
  if (!match || Number(match[1].split('.')[0]) <= Math.floor(Date.now() / 1000)) return false;
  const signature = Uint8Array.from(match[2].match(/../g)!, (byte) => parseInt(byte, 16));
  return crypto.subtle.verify('HMAC', key, signature, encoder.encode(match[1]));
}

async function readBody(request: Request, maxBytes: number): Promise<ArrayBuffer> {
  if (Number(request.headers.get('Content-Length')) > maxBytes) throw new RangeError('Size limit exceeded');
  const reader = request.body?.getReader();
  const data = new Uint8Array(maxBytes);
  let offset = 0;
  while (reader) {
    const { value, done } = await reader.read();
    if (done) break;
    if (offset + value.byteLength > maxBytes) {
      void reader.cancel().catch(() => undefined);
      throw new RangeError('Size limit exceeded');
    }
    data.set(value, offset);
    offset += value.byteLength;
  }
  return data.buffer.slice(0, offset);
}

async function login(request: Request, env: AdminEnvironment, key: CryptoKey) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { success } = await env.ADMIN_LOGIN_RATE_LIMITER!.limit({ key: ip });
  if (!success) return reply(429, { ok: false, error: 'Too many attempts. Try again in a minute.' });

  let credentials: { username?: unknown; password?: unknown };
  try {
    credentials = JSON.parse(new TextDecoder().decode(await readBody(request, 1024)));
  } catch {
    return reply(400, { ok: false, error: 'Invalid login request.' });
  }
  if (typeof credentials?.password !== 'string' || typeof credentials.username !== 'string') {
    return reply(400, { ok: false, error: 'Invalid login request.' });
  }
  const digest = hex(await crypto.subtle.digest('SHA-256', encoder.encode(credentials.password)));
  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(env.ADMIN_PASSWORD_HASH));
  const matches = await crypto.subtle.verify('HMAC', key, expectedSignature, encoder.encode(digest));
  if (!matches || credentials.username !== env.ADMIN_USERNAME) {
    return reply(401, { ok: false, error: 'Incorrect username or password.' });
  }
  const payload = `${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${crypto.randomUUID()}`;
  const signature = hex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
  return reply(200, { ok: true }, sessionCookie(`${payload}.${signature}`, SESSION_SECONDS));
}

function matchesImage(bytes: Uint8Array, type: string) {
  if (type === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte);
  return new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF'
    && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
}

async function publishMedia(request: Request, env: AdminEnvironment) {
  const origin = env.SUPABASE_URL?.trim().replace(/\/$/, '');
  const secret = env.SUPABASE_SECRET_KEY?.trim();
  if (!origin || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(origin) || !secret?.startsWith('sb_secret_')) {
    return reply(503, { ok: false, error: 'Media publishing is not configured.' });
  }
  if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data;')) {
    return reply(415, { ok: false, error: 'Select an image file.' });
  }

  let form: FormData;
  try {
    const body = await readBody(request, MAX_IMAGE_BYTES + 16 * 1024);
    form = await new Response(body, { headers: { 'Content-Type': request.headers.get('Content-Type')! } }).formData();
  } catch (error) {
    return reply(error instanceof RangeError ? 413 : 400, { ok: false, error: 'Choose a valid image of up to 5 MB.' });
  }
  const field = (name: string) => String(form.get(name) ?? '').trim();
  const section = field('section');
  const slot = field('slot');
  const title = field('title');
  const altText = field('altText');
  const category = field('category');
  const location = field('location');
  const speed = field('speed');
  const isProduct = section === 'processing_line' || section === 'equipment';
  if (!['gallery', 'homepage_hero', 'processing_line', 'equipment'].includes(section)
    || !title || title.length > 160 || altText.length > 240
    || (isProduct && (!slot || slot.length > 160 || !/^[a-z0-9-]+$/.test(slot)))
    || location.length > 160 || speed.length > 160
    || (section === 'gallery' && !['processing-line', 'equipment', 'installation'].includes(category))) {
    return reply(400, { ok: false, error: 'Check the image title and destination.' });
  }
  const file = form.get('image');
  if (!(file instanceof File) || file.size <= 0 || file.size > MAX_IMAGE_BYTES || !extensions.has(file.type)
    || !matchesImage(new Uint8Array(await file.slice(0, 12).arrayBuffer()), file.type)) {
    return reply(400, { ok: false, error: 'Choose a JPEG, PNG, or WebP image up to 5 MB.' });
  }

  const id = crypto.randomUUID();
  const path = `${section}/${id}.${extensions.get(file.type)}`;
  try {
    const upload = await fetch(`${origin}/storage/v1/object/website-media/${path}`, {
      method: 'POST',
      headers: { apikey: secret, 'Content-Type': file.type },
      body: file,
    });
    if (!upload.ok) return reply(502, { ok: false, error: 'Image storage rejected the upload.' });

    const record = await fetch(`${origin}/rest/v1/website_media`, {
      method: 'POST',
      headers: { apikey: secret, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        id, section, slot: isProduct ? slot : null, storage_path: path, title,
        alt_text: altText || title, is_published: true,
        metadata: section === 'gallery' ? { category, location, speed } : {},
        display_order: isProduct || section === 'homepage_hero' ? -2147483648 : 0,
      }),
    });
    if (!record.ok) return reply(502, { ok: false, error: 'The image uploaded, but publication could not be confirmed.' });
    return reply(201, { ok: true, id });
  } catch {
    return reply(502, { ok: false, error: 'Publication could not be confirmed. Check the public page before retrying.' });
  }
}

export async function handleAdminRequest(request: Request, url: URL, env: AdminEnvironment) {
  const action = url.pathname.slice('/api/admin/'.length);
  if (!['login', 'logout', 'session', 'media'].includes(action)) return reply(404, { ok: false });
  const method = action === 'session' ? 'GET' : 'POST';
  if (request.method !== method) return reply(405, { ok: false });
  if (method === 'POST' && request.headers.get('Origin') !== url.origin) return reply(403, { ok: false });

  if (action === 'logout') return reply(200, { ok: true }, sessionCookie('', 0));
  if (!env.ADMIN_USERNAME || !/^[0-9a-f]{64}$/.test(env.ADMIN_PASSWORD_HASH || '')
    || !/^[A-Za-z0-9_-]{43}$/.test(env.ADMIN_SESSION_SECRET || '') || !env.ADMIN_LOGIN_RATE_LIMITER) {
    return reply(503, { ok: false, error: 'Admin access is not configured.' });
  }
  try {
    const key = await signingKey(env.ADMIN_SESSION_SECRET!);
    if (action === 'login') return await login(request, env, key);
    if (!await verifyAdminSession(request, key)) return reply(401, { ok: false, error: 'Sign in again to continue.' });
    if (action === 'session') return reply(200, { ok: true });
    return await publishMedia(request, env);
  } catch {
    return reply(503, { ok: false, error: 'Admin service is temporarily unavailable.' });
  }
}

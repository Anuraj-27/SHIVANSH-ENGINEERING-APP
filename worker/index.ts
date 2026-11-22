import { handleAdminRequest } from './admin';

interface AssetsFetcher {
  fetch(request: Request | string): Promise<Response>;
}

export interface Env {
  ASSETS: AssetsFetcher;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_LOGIN_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
  SUPABASE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  ENQUIRY_FROM?: string;
  ENQUIRY_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
}

interface EnquiryPayload {
  name?: unknown;
  mobile?: unknown;
  email?: unknown;
  designation?: unknown;
  description?: unknown;
  website?: unknown;
  turnstileToken?: unknown;
}

interface TurnstileVerifyResponse {
  success?: boolean;
  'error-codes'?: string[];
}

interface ResendSuccessResponse {
  id?: string;
}

type MediaSection =
  | 'homepage_showcase'
  | 'homepage_hero'
  | 'gallery'
  | 'processing_line'
  | 'equipment';

interface SupabaseMediaRow {
  id?: unknown;
  section?: unknown;
  slot?: unknown;
  storage_path?: unknown;
  title?: unknown;
  alt_text?: unknown;
  metadata?: unknown;
  display_order?: unknown;
  created_at?: unknown;
}

interface PublicMediaItem {
  id: string;
  section: MediaSection;
  slot: string | null;
  title: string;
  altText: string;
  imageUrl: string;
  displayOrder: number;
  category?: 'processing-line' | 'equipment' | 'installation';
  location?: string;
  speed?: string;
  uploadedAt?: string;
}

const VALID_MEDIA_SECTIONS = new Set<MediaSection>([
  'homepage_showcase',
  'homepage_hero',
  'gallery',
  'processing_line',
  'equipment',
]);

const VALID_GALLERY_CATEGORIES = new Set(['processing-line', 'equipment', 'installation']);
const MEDIA_BUCKET = 'website-media';

const MAX_BODY_BYTES = 16 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_PATTERN = /^[+\d\s().-]+$/;

const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function jsonResponse(body: Record<string, unknown>, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...extraHeaders,
    },
  });
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\0]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseRecipients(raw: string): string[] {
  return raw
    .split(',')
    .map((entry) => sanitizeHeaderValue(entry))
    .filter((entry) => entry.length > 0);
}

function buildPublicStorageUrl(supabaseOrigin: string, storagePath: string): string | null {
  const trimmed = storagePath.trim();
  if (!trimmed || trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed) || trimmed.includes('..')) {
    return null;
  }

  const segments = trimmed.split('/').filter((segment) => segment.length > 0);
  if (segments.length === 0) {
    return null;
  }

  const encodedPath = segments.map((segment) => encodeURIComponent(segment)).join('/');
  return `${supabaseOrigin}/storage/v1/object/public/${MEDIA_BUCKET}/${encodedPath}`;
}

function isLegacyJwtKey(key: string): boolean {
  return key.startsWith('eyJ') && key.split('.').length === 3;
}

async function handleMediaGet(request: Request, env: Env): Promise<Response> {
  const rawSupabaseUrl = env.SUPABASE_URL?.trim() || '';
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY?.trim() || '';

  if (!rawSupabaseUrl || !publishableKey) {
    return jsonResponse(
      {
        ok: false,
        configured: false,
        items: [],
        error: 'Published media service is not configured yet.',
      },
      503
    );
  }

  let supabaseOrigin: string;
  try {
    const parsedUrl = new URL(rawSupabaseUrl);
    if (parsedUrl.protocol !== 'https:') {
      return jsonResponse({ ok: false, items: [], error: 'Invalid media service URL.' }, 500);
    }
    supabaseOrigin = parsedUrl.origin;
  } catch {
    return jsonResponse({ ok: false, items: [], error: 'Invalid media service URL.' }, 500);
  }

  const requestUrl = new URL(request.url);
  const requestedSection = requestUrl.searchParams.get('section')?.trim() || '';
  if (requestedSection && !VALID_MEDIA_SECTIONS.has(requestedSection as MediaSection)) {
    return jsonResponse({ ok: false, items: [], error: 'Invalid media section filter.' }, 400);
  }

  const queryParams = new URLSearchParams({
    select: 'id,section,slot,storage_path,title,alt_text,metadata,display_order,created_at',
    is_published: 'eq.true',
    order: 'display_order.asc,created_at.desc',
  });

  if (requestedSection) {
    queryParams.set('section', `eq.${requestedSection}`);
  }

  const headers: Record<string, string> = {
    apikey: publishableKey,
    Accept: 'application/json',
  };

  // Support both modern Supabase `sb_publishable_*` keys (apikey header only)
  // and legacy JWT `anon` keys (apikey + Authorization Bearer).
  if (isLegacyJwtKey(publishableKey)) {
    headers.Authorization = `Bearer ${publishableKey}`;
  }

  try {
    const supabaseRes = await fetch(`${supabaseOrigin}/rest/v1/website_media?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!supabaseRes.ok) {
      console.error(`Supabase media query failed with status ${supabaseRes.status}`);
      return jsonResponse(
        { ok: false, items: [], error: 'Unable to load published media right now.' },
        502
      );
    }

    const rawRows = (await supabaseRes.json().catch(() => null)) as unknown;
    if (!Array.isArray(rawRows)) {
      return jsonResponse({ ok: true, items: [] }, 200, {
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      });
    }

    const items: PublicMediaItem[] = [];

    for (const rawRow of rawRows) {
      if (!rawRow || typeof rawRow !== 'object') continue;
      const row = rawRow as SupabaseMediaRow;

      if (typeof row.id !== 'string' || typeof row.section !== 'string' || typeof row.storage_path !== 'string') {
        continue;
      }

      if (!VALID_MEDIA_SECTIONS.has(row.section as MediaSection)) {
        continue;
      }

      const imageUrl = buildPublicStorageUrl(supabaseOrigin, row.storage_path);
      if (!imageUrl) {
        continue;
      }

      const title = typeof row.title === 'string' && row.title.trim().length > 0 ? row.title.trim() : '';
      if (!title) {
        continue;
      }

      const altText =
        typeof row.alt_text === 'string' && row.alt_text.trim().length > 0 ? row.alt_text.trim() : title;
      const slot = typeof row.slot === 'string' && row.slot.trim().length > 0 ? row.slot.trim() : null;
      const displayOrder = typeof row.display_order === 'number' && Number.isFinite(row.display_order) ? row.display_order : 0;

      const meta =
        row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
          ? (row.metadata as Record<string, unknown>)
          : {};

      const item: PublicMediaItem = {
        id: row.id,
        section: row.section as MediaSection,
        slot,
        title,
        altText,
        imageUrl,
        displayOrder,
      };

      const rawCategory =
        typeof meta.category === 'string' && VALID_GALLERY_CATEGORIES.has(meta.category)
          ? (meta.category as 'processing-line' | 'equipment' | 'installation')
          : slot && VALID_GALLERY_CATEGORIES.has(slot)
            ? (slot as 'processing-line' | 'equipment' | 'installation')
            : undefined;
      if (rawCategory) {
        item.category = rawCategory;
      }

      if (typeof meta.location === 'string' && meta.location.trim()) {
        item.location = meta.location.trim();
      }

      if (typeof meta.speed === 'string' && meta.speed.trim()) {
        item.speed = meta.speed.trim();
      }

      if (typeof row.created_at === 'string' && row.created_at.length >= 10) {
        item.uploadedAt = row.created_at.slice(0, 10);
      }

      items.push(item);
    }

    return jsonResponse(
      { ok: true, items },
      200,
      { 'Cache-Control': 'public, max-age=60, s-maxage=60' }
    );
  } catch {
    console.error('Supabase media network request failed');
    return jsonResponse(
      { ok: false, items: [], error: 'Unable to reach the published media service.' },
      502
    );
  }
}

function validateEnquiry(payload: EnquiryPayload): {
  valid: boolean;
  error?: string;
  data?: {
    name: string;
    mobile: string;
    email: string;
    designation: string;
    description: string;
    turnstileToken: string;
  };
} {
  if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
    return { valid: false, error: 'Invalid enquiry submission.' };
  }

  const name = typeof payload.name === 'string' ? sanitizeHeaderValue(payload.name) : '';
  const mobile = typeof payload.mobile === 'string' ? sanitizeHeaderValue(payload.mobile) : '';
  const email = typeof payload.email === 'string' ? sanitizeHeaderValue(payload.email).toLowerCase() : '';
  const designation = typeof payload.designation === 'string' ? sanitizeHeaderValue(payload.designation) : '';
  const description = typeof payload.description === 'string' ? payload.description.replace(/\0/g, '').trim() : '';
  const turnstileToken = typeof payload.turnstileToken === 'string' ? payload.turnstileToken.trim() : '';

  if (name.length < 2 || name.length > 120) {
    return { valid: false, error: 'Please enter a valid full name (2 to 120 characters).' };
  }

  const digitCount = mobile.replace(/\D/g, '').length;
  if (mobile.length < 7 || mobile.length > 30 || !PHONE_ALLOWED_PATTERN.test(mobile) || digitCount < 7) {
    return { valid: false, error: 'Please enter a valid mobile or phone number.' };
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  if (designation.length > 120) {
    return { valid: false, error: 'Designation must be 120 characters or fewer.' };
  }

  if (description.length < 10 || description.length > 5000) {
    return { valid: false, error: 'Please describe your enquiry in detail (at least 10 characters).' };
  }

  return {
    valid: true,
    data: {
      name,
      mobile,
      email,
      designation,
      description,
      turnstileToken,
    },
  };
}

async function verifyTurnstile(secretKey: string, token: string, remoteIp: string | null): Promise<boolean> {
  const formBody = new URLSearchParams();
  formBody.set('secret', secretKey);
  formBody.set('response', token);
  if (remoteIp) {
    formBody.set('remoteip', remoteIp);
  }

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody.toString(),
  });

  if (!verifyRes.ok) {
    return false;
  }

  const data = (await verifyRes.json()) as TurnstileVerifyResponse;
  return data.success === true;
}

async function handleEnquiryPost(request: Request, env: Env): Promise<Response> {
  const resendApiKey = env.RESEND_API_KEY?.trim() || '';
  const enquiryFrom = env.ENQUIRY_FROM ? sanitizeHeaderValue(env.ENQUIRY_FROM) : '';
  const enquiryToRaw = env.ENQUIRY_TO?.trim() || '';
  const recipients = parseRecipients(enquiryToRaw);

  if (!resendApiKey || !enquiryFrom || recipients.length === 0) {
    return jsonResponse(
      {
        ok: false,
        error: 'Enquiry email service is not configured yet. Please contact us directly by phone or email.',
      },
      503
    );
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, error: 'Request body must be JSON.' }, 415);
  }

  let rawBody = '';
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ ok: false, error: 'Unable to read request body.' }, 400);
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: 'Enquiry payload is too large.' }, 413);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON request body.' }, 400);
  }

  if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
    return jsonResponse({ ok: false, error: 'Invalid enquiry payload.' }, 400);
  }

  const validation = validateEnquiry(parsedBody as EnquiryPayload);
  if (!validation.valid || !validation.data) {
    return jsonResponse({ ok: false, error: validation.error || 'Please check the form fields and try again.' }, 400);
  }

  const { name, mobile, email, designation, description, turnstileToken } = validation.data;

  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim() || '';
  if (turnstileSecret) {
    if (!turnstileToken) {
      return jsonResponse({ ok: false, error: 'Please complete the security verification challenge.' }, 400);
    }

    try {
      const remoteIp = request.headers.get('CF-Connecting-IP');
      const verified = await verifyTurnstile(turnstileSecret, turnstileToken, remoteIp);
      if (!verified) {
        return jsonResponse(
          { ok: false, error: 'Security verification failed. Please retry the verification check.' },
          403
        );
      }
    } catch {
      return jsonResponse(
        { ok: false, error: 'Unable to verify the security challenge right now. Please try again.' },
        502
      );
    }
  }

  const submittedAt = new Date().toISOString();
  const subject = `Website Enquiry — ${name}`;

  const textLines = [
    'New enquiry submitted via the Shivansh Engineering website.',
    '',
    `Name: ${name}`,
    `Mobile Number: ${mobile}`,
    `Email: ${email}`,
    `Designation: ${designation || 'Not specified'}`,
    `Submitted At (UTC): ${submittedAt}`,
    '',
    'Description:',
    description,
  ];

  const htmlBody = `<!doctype html>
<html lang="en">
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #29434F; background-color: #F5F1E9; margin: 0; padding: 24px;">
    <div style="max-width: 640px; margin: 0 auto; background-color: #FFFCF6; border: 1px solid #DDD4C6; border-radius: 12px; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #29434F; font-size: 20px;">New Website Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6; font-weight: 600; width: 150px;">Name</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6; font-weight: 600;">Mobile Number</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6;">${escapeHtml(mobile)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6; font-weight: 600;">Email</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6; font-weight: 600;">Designation</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6;">${escapeHtml(designation || 'Not specified')}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6; font-weight: 600;">Submitted (UTC)</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #DDD4C6;">${escapeHtml(submittedAt)}</td>
        </tr>
      </table>
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Enquiry Details</div>
      <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap; background-color: #F5F1E9; border: 1px solid #DDD4C6; border-radius: 8px; padding: 14px;">${escapeHtml(description)}</div>
    </div>
  </body>
</html>`;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: enquiryFrom,
        to: recipients,
        reply_to: email,
        subject,
        text: textLines.join('\n'),
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      console.error(`Resend API rejected enquiry request with status ${resendResponse.status}`);
      return jsonResponse(
        {
          ok: false,
          error: 'Unable to send your enquiry right now. Please try again later or contact us directly.',
        },
        502
      );
    }

    const resendData = (await resendResponse.json().catch(() => null)) as ResendSuccessResponse | null;
    if (!resendData?.id) {
      return jsonResponse(
        {
          ok: false,
          error: 'Email delivery could not be confirmed. Please try again or contact us directly.',
        },
        502
      );
    }

    return jsonResponse({ ok: true, id: resendData.id }, 200);
  } catch {
    console.error('Resend API network request failed');
    return jsonResponse(
      {
        ok: false,
        error: 'Unable to reach the email service right now. Please try again later or contact us directly.',
      },
      502
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/admin/')) {
      return handleAdminRequest(request, url, env);
    }

    if (url.pathname === '/api/media') {
      if (request.method !== 'GET') {
        return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
      }
      return handleMediaGet(request, env);
    }

    if (url.pathname === '/api/enquiry/config') {
      if (request.method !== 'GET') {
        return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
      }
      const turnstileSiteKey = env.TURNSTILE_SITE_KEY?.trim() || null;
      return jsonResponse({ ok: true, turnstileSiteKey }, 200);
    }

    if (url.pathname === '/api/enquiry') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: { Allow: 'POST, OPTIONS' } });
      }
      if (request.method !== 'POST') {
        return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
      }
      return handleEnquiryPost(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ ok: false, error: 'API endpoint not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

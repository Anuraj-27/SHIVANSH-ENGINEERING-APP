interface AssetsFetcher {
  fetch(request: Request | string): Promise<Response>;
}

export interface Env {
  ASSETS: AssetsFetcher;
  RESEND_API_KEY?: string;
  ENQUIRY_FROM?: string;
  ENQUIRY_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
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

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, CheckCircle2, Send, AlertCircle } from 'lucide-react';

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      theme?: 'light' | 'dark' | 'auto';
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface EnquiryResponse {
  ok?: boolean;
  error?: string;
  id?: string;
}

const BUILD_TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_PATTERN = /^[+\d\s().-]+$/;

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    designation: '',
    description: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string>(BUILD_TURNSTILE_SITE_KEY);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  // Discover optional public Turnstile site key from Worker runtime config if not provided at build time
  useEffect(() => {
    if (BUILD_TURNSTILE_SITE_KEY) return;
    let active = true;
    fetch('/api/enquiry/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok?: boolean; turnstileSiteKey?: string | null } | null) => {
        if (active && data?.ok && typeof data.turnstileSiteKey === 'string' && data.turnstileSiteKey.trim()) {
          setTurnstileSiteKey(data.turnstileSiteKey.trim());
        }
      })
      .catch(() => {
        // Optional runtime discovery; ignore when running static Vite preview without Worker
      });
    return () => {
      active = false;
    };
  }, []);

  // Load and render Cloudflare Turnstile widget when a public site key is configured
  useEffect(() => {
    if (!turnstileSiteKey || submitted) return;

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !turnstileContainerRef.current || !window.turnstile) return;
      if (turnstileWidgetIdRef.current) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        } catch {
          // Ignore removal errors if widget was already unmounted
        }
        turnstileWidgetIdRef.current = null;
      }

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: (token: string) => {
          setTurnstileToken(token);
          setSubmitError(null);
        },
        'expired-callback': () => {
          setTurnstileToken('');
        },
        'error-callback': () => {
          setTurnstileToken('');
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const scriptId = 'cf-turnstile-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', renderWidget);
      return () => {
        cancelled = true;
        script?.removeEventListener('load', renderWidget);
        if (turnstileWidgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(turnstileWidgetIdRef.current);
          } catch {
            // Ignore cleanup errors
          }
          turnstileWidgetIdRef.current = null;
        }
      };
    }

    return () => {
      cancelled = true;
      if (turnstileWidgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        } catch {
          // Ignore cleanup errors
        }
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [turnstileSiteKey, submitted]);

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (turnstileWidgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      } catch {
        // Ignore reset errors
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const name = formData.name.trim();
    const mobile = formData.mobile.trim();
    const email = formData.email.trim();
    const designation = formData.designation.trim();
    const description = formData.description.trim();

    if (name.length < 2) {
      setSubmitError('Please enter your full name (at least 2 characters).');
      return;
    }

    const digitCount = mobile.replace(/\D/g, '').length;
    if (mobile.length < 7 || !PHONE_ALLOWED_PATTERN.test(mobile) || digitCount < 7) {
      setSubmitError('Please enter a valid mobile or phone number.');
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    if (description.length < 10) {
      setSubmitError('Please describe your inquiry in detail (at least 10 characters).');
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setSubmitError('Please complete the security verification check before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          mobile,
          email,
          designation,
          description,
          website: honeypot,
          turnstileToken,
        }),
      });

      const data = (await response.json().catch(() => null)) as EnquiryResponse | null;

      if (response.ok && data?.ok === true) {
        setSubmitted(true);
        setSubmitError(null);
        return;
      }

      if (response.status === 503) {
        setSubmitError(
          data?.error ||
            'Enquiry email service is not configured yet. Your details have been kept below—please try again later or reach us at +91 88888 45711 / shivanshengineering@yahoo.in.'
        );
      } else {
        setSubmitError(
          data?.error ||
            'We could not submit your inquiry right now. Your details have been kept below—please try again or contact us directly.'
        );
      }

      resetTurnstile();
    } catch {
      setSubmitError(
        'Unable to reach the enquiry service right now. Your details have been kept below—please try again or contact us at +91 88888 45711.'
      );
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-canvas min-h-[85vh] py-12 sm:py-16 border-b border-border relative font-sans">
      <div className="blueprint-watermark" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Unified Page Header */}
        <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-2">
              <Mail className="w-4 h-4 text-sage" />
              COMMERCIAL &amp; ENGINEERING DESK
            </div>
            <h1 className="font-display font-normal text-4xl sm:text-5xl text-ink tracking-normal">
              Contact Us
            </h1>
          </div>
          <div className="text-xs font-sans text-ink font-semibold uppercase tracking-[0.1em]">
            WORKS OFFICE &amp; INQUIRY DESK
          </div>
        </div>

        {/* Top Section: 2x2 Grid of Cards (Our Location, Phone, Email, Visiting Card) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Card 1: Our Location */}
          <div className="bg-ivory rounded-2xl border border-border p-8 shadow-soft-diffused flex items-start gap-5 hover:border-sage hover:shadow-card-elevated transition-[border-color,box-shadow] duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-canvas border border-border text-sage flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-sage" />
            </div>
            <div>
              <h2 className="font-display font-normal text-xl sm:text-2xl text-ink mb-2">
                Our Location
              </h2>
              <div className="text-sm sm:text-base text-ink leading-relaxed space-y-0.5 font-sans">
                <div>Unit II, Gat No 882/1/3A,</div>
                <div>Behind Nisarg Hotel, Pune Nagar Road,</div>
                <div>Sanaswadi, Tal. Shirur,</div>
                <div>Dist. Pune (MH) 412 208</div>
              </div>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-ivory rounded-2xl border border-border p-8 shadow-soft-diffused flex items-start gap-5 hover:border-sage hover:shadow-card-elevated transition-[border-color,box-shadow] duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-canvas border border-border text-sage flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-sage" />
            </div>
            <div>
              <h2 className="font-display font-normal text-xl sm:text-2xl text-ink mb-2">
                Phone
              </h2>
              <a
                href="tel:+918888845711"
                className="text-base sm:text-lg text-ink hover:underline decoration-sage underline-offset-4 font-medium transition-colors duration-150 font-sans tabular-nums"
              >
                +91 88888 45711
              </a>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-ivory rounded-2xl border border-border p-8 shadow-soft-diffused flex items-start gap-5 hover:border-sage hover:shadow-card-elevated transition-[border-color,box-shadow] duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-canvas border border-border text-sage flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-sage" />
            </div>
            <div>
              <h2 className="font-display font-normal text-xl sm:text-2xl text-ink mb-2">
                Email
              </h2>
              <a
                href="mailto:shivanshengineering@yahoo.in"
                className="text-base sm:text-lg text-ink hover:underline decoration-sage underline-offset-4 font-medium transition-colors duration-150 break-all font-sans"
              >
                shivanshengineering@yahoo.in
              </a>
            </div>
          </div>

          {/* Card 4: Official Business Card Representation */}
          <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused flex items-center justify-center hover:border-sage hover:shadow-card-elevated transition-[border-color,box-shadow] duration-200">
            <div className="w-full max-w-md bg-ivory border border-border-strong rounded-xl p-4 sm:p-5 shadow-soft-diffused text-left relative overflow-hidden font-sans">
              {/* Header: SE Logo & Brand */}
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3 gap-2">
                <img
                  src="/assets/aistudio/image_2ce8df1a.png"
                  alt="SE Logo"
                  className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply"
                />
                <img
                  src="/assets/aistudio/image_c20114d0.png"
                  alt="Shivansh Engineering"
                  className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply"
                />
              </div>

              {/* Middle: Contact Person & Contact Details */}
              <div className="flex items-start justify-between text-xs mb-3 font-sans">
                <div>
                  <div className="font-semibold text-ink text-sm">Sunil Kokate</div>
                  <div className="text-ink/80 font-medium text-[11px]">Proprietor</div>
                </div>
                <div className="text-right text-[11px] text-ink space-y-0.5 tabular-nums">
                  <div className="font-medium">M +91 88888 45711</div>
                  <div>shivanshengineering@yahoo.in</div>
                  <div>www.shivanshengg.com</div>
                </div>
              </div>

              {/* Red Bottom Border Strip with Factory Address */}
              <div className="border-t-2 border-[#D92D20] pt-1.5 mt-2">
                <p className="text-[9px] text-ink leading-tight font-sans">
                  Unit -2, Gat No 882/1/3A, Behind Nisarg Hotel, Pune Nagar Road, Sanaswadi, Tal. Shirur Dist. Pune - 412 208, Maharashtra, India.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Second Section: Inquiry Form */}
        <div className="bg-ivory rounded-2xl border border-border p-8 sm:p-12 shadow-soft-diffused max-w-5xl mx-auto font-sans">
          <h2 className="font-display font-normal text-3xl sm:text-4xl text-ink text-center mb-8 sm:mb-10">
            Inquiry Form
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-sage/15 text-sage flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-sage" />
              </div>
              <h3 className="font-display font-normal text-2xl text-ink">
                Inquiry Submitted Successfully
              </h3>
              <p className="text-ink max-w-md mx-auto text-sm font-sans">
                Thank you for contacting Shivansh Engineering. Our technical engineering team will review your specifications and get back to you shortly.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitError(null);
                    setTurnstileToken('');
                    setFormData({
                      name: '',
                      mobile: '',
                      email: '',
                      designation: '',
                      description: '',
                    });
                  }}
                  className="px-6 py-2.5 text-sm font-semibold text-ink bg-ivory border border-ink hover:bg-canvas rounded-xl transition-colors duration-150 font-sans"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Hidden honeypot field for basic bot filtering */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="enquiry-website">Website</label>
                <input
                  id="enquiry-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-terracotta/12 border border-terracotta text-ink text-sm font-medium flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              
              {/* Row 1: Name & Mobile Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2 font-sans">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-ivory border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink transition-colors duration-150 placeholder:text-ink/50 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2 font-sans">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={30}
                    placeholder="Your mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-ivory border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink transition-colors duration-150 placeholder:text-ink/50 font-sans tabular-nums"
                  />
                </div>
              </div>

              {/* Row 2: Email & Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2 font-sans">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={254}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-ivory border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink transition-colors duration-150 placeholder:text-ink/50 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2 font-sans">
                    Designation
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    placeholder="Your designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-ivory border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink transition-colors duration-150 placeholder:text-ink/50 font-sans"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2 font-sans">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  maxLength={5000}
                  placeholder="Please describe your inquiry in detail"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-ivory border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink transition-colors duration-150 placeholder:text-ink/50 resize-y font-sans leading-relaxed"
                />
              </div>

              {/* Optional Cloudflare Turnstile Widget (renders automatically when public site key is configured) */}
              {turnstileSiteKey && (
                <div className="pt-1">
                  <div ref={turnstileContainerRef} />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 text-base font-semibold text-ivory bg-ink hover:bg-ink-hover disabled:opacity-60 rounded-xl transition-colors duration-150 shadow-soft-diffused font-sans flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

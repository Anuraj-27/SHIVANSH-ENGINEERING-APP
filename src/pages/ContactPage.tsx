import React, { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle2, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    designation: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.description) return;
    setSubmitted(true);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Mobile Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2 font-sans">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
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
                  placeholder="Please describe your inquiry in detail"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-ivory border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink transition-colors duration-150 placeholder:text-ink/50 resize-y font-sans leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 text-base font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused font-sans flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

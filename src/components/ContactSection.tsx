import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, FileCheck, Shield } from 'lucide-react';

interface ContactSectionProps {
  preFilledSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preFilledSubject }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    machineCategory: 'Continuous High-Speed Slitting Line',
    coilWidth: '1500 mm',
    stripThickness: '2.5 mm',
    notes: preFilledSubject || '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [inquiryNumber, setInquiryNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    const refCode = `RFQ-SHV-${Math.floor(1000 + Math.random() * 9000)}`;
    setInquiryNumber(refCode);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/70 border-b border-slate-200 relative">
      <div className="blueprint-watermark opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Factory Location & Direct Engineering Contacts */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#82C8E5]" />
                COMMERCIAL & TECHNICAL INQUIRIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Request an Engineering Quotation
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Connect directly with our senior application engineers to receive custom general arrangement (GA) drawings, load calculations, and turnkey capital proposals.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-soft-diffused">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-[#82C8E5] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-slate-700 font-bold">
                    Manufacturing Works & Headquarters
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    Shivansh Engineering Works Pvt. Ltd.
                  </div>
                  <div className="text-xs text-slate-600 mt-1 leading-snug">
                    Plot No. E-42/43, MIDC Industrial Area, Chakan Phase II, Pune – 410501, Maharashtra, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-soft-diffused">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-[#82C8E5] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-slate-700 font-bold">
                    Direct Sales & Application Desk
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    +91 98220 01920 / +91 2135 668800
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Monday to Saturday: 8:30 AM – 7:00 PM IST
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-soft-diffused">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-[#82C8E5] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-slate-700 font-bold">
                    Official Technical RFQ Email
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    rfq@shivanshengineering.com
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    General: info@shivanshengineering.com
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#0284C7] shrink-0" />
              <div>
                <strong className="text-slate-900">Standard Response Guarantee:</strong> Formal engineering proposals, layout drawings, and cycle-time calculations dispatched within 24 business hours.
              </div>
            </div>
          </div>

          {/* Right Column: High-Conversion RFQ Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-card-elevated">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#82C8E5]/20 text-[#0284C7] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Quotation Request Registered
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your requirement for <strong>{formData.machineCategory}</strong> has been logged in our engineering desk.
                </p>
                <div className="inline-block p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800">
                  Inquiry Tracking ID: <span className="font-bold text-[#0284C7]">{inquiryNumber}</span>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        machineCategory: 'Continuous High-Speed Slitting Line',
                        coilWidth: '1500 mm',
                        stripThickness: '2.5 mm',
                        notes: '',
                      });
                    }}
                    className="px-5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Technical Specification Form
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Please provide coil parameters and machine specifications for rapid processing.
                  </p>
                </div>

                {/* Row 1: Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name / Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company / Steel Plant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Steels Ltd."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="patil@apexsteels.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Row 3: Machine Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Machine or Processing Line
                  </label>
                  <select
                    value={formData.machineCategory}
                    onChange={(e) => setFormData({ ...formData, machineCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900"
                  >
                    <option value="Continuous High-Speed Slitting Line">Continuous High-Speed Slitting Line</option>
                    <option value="Flying Shear Cut-To-Length Line">Flying Shear Cut-To-Length Line</option>
                    <option value="Tension Leveling & Cleaning Line">Tension Leveling & Cleaning Line</option>
                    <option value="4-Hi / 6-Hi Cold Rolling Reversing Mill">4-Hi / 6-Hi Cold Rolling Reversing Mill</option>
                    <option value="Double-Mandrel Heavy Duty Decoiler">Double-Mandrel Heavy Duty Decoiler</option>
                    <option value="CNC 6-Hi Precision Roller Leveler">CNC 6-Hi Precision Roller Leveler</option>
                    <option value="High-Cycle Rotary Hydraulic Crop Shear">High-Cycle Rotary Hydraulic Crop Shear</option>
                    <option value="Mechanical & Hydraulic 90° Coil Upender">Mechanical & Hydraulic 90° Coil Upender</option>
                    <option value="Turnkey Custom Processing Plant">Turnkey Custom Processing Plant</option>
                    <option value="Line Retrofit & Automation Modernization">Line Retrofit & Automation Modernization</option>
                  </select>
                </div>

                {/* Row 4: Coil Parameters (Width & Thickness) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Max Coil Width (mm)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1500 mm or 2000 mm"
                      value={formData.coilWidth}
                      onChange={(e) => setFormData({ ...formData, coilWidth: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Strip Thickness Range (mm)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0.5 to 6.0 mm"
                      value={formData.stripThickness}
                      onChange={(e) => setFormData({ ...formData, stripThickness: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>

                {/* Row 5: Notes & Details */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Specific Technical Details / Plant Layout Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide desired line speed, coil weights, material grades, or project timeline..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82C8E5] focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Submit Button: bold primary button filled with #82C8E5 */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 text-sm font-bold text-slate-900 bg-[#82C8E5] hover:bg-[#68bddf] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Submit Engineering RFQ & Download GA Drawing</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-700 pt-1">
                  <Shield className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Non-Disclosure & Intellectual Property Protected</span>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

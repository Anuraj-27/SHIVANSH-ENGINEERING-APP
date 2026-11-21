import React, { useState } from 'react';
import { ShieldCheck, Cpu, Gauge, Zap, CheckCircle2, RotateCw } from 'lucide-react';

export const FlagshipMachineGraphic: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'3d' | 'schematic'>('3d');
  const [isSimulating, setIsSimulating] = useState(true);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-gradient-to-b from-slate-50/70 via-white to-slate-100/60 rounded-2xl border border-slate-200/80 p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-soft-diffused group">
      {/* Precision CAD grid backdrop */}
      <div className="absolute inset-0 bg-grid-architectural opacity-60 pointer-events-none" />
      <div className="blueprint-watermark opacity-10" />

      {/* Top micro status bar of the machine visual */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#82C8E5] animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-700 tracking-tight">
            MODEL: SHV-PL2200-SERIES
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            TOLERANCE: ±0.002mm
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-0.5 shadow-xs">
          <button
            onClick={() => setActiveMode('3d')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeMode === '3d'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Isometric 3D
          </button>
          <button
            onClick={() => setActiveMode('schematic')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeMode === 'schematic'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CAD Elevation
          </button>
        </div>
      </div>

      {/* Center Flagship Machine Illustration (Vector 3D Isometric / CAD Engineering View) */}
      <div className="relative z-10 my-auto w-full flex items-center justify-center py-2">
        <svg
          viewBox="0 0 800 480"
          className="w-full h-auto max-h-[340px] drop-shadow-md select-none transition-all duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for metallic machinery */}
            <linearGradient id="steelRollGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="bodyDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="cyanAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#82C8E5" />
              <stop offset="100%" stopColor="#5EAED2" />
            </linearGradient>

            <linearGradient id="stripSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <radialGradient id="studioFloorShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(30, 41, 59, 0.12)" />
              <stop offset="60%" stopColor="rgba(30, 41, 59, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Machine Floor Cast Shadow */}
          <ellipse cx="400" cy="425" rx="340" ry="25" fill="url(#studioFloorShadow)" />

          {activeMode === '3d' ? (
            /* ISOMETRIC 3D FLAGSHIP PROCESSING LINE & 6-HI ROLLER CASSETTE */
            <g id="isometric-machine">
              {/* Heavy Machined Base Bed */}
              <path
                d="M 100 370 L 680 370 L 720 405 L 140 405 Z"
                fill="#334155"
                stroke="#1E293B"
                strokeWidth="2"
              />
              <path
                d="M 140 405 L 720 405 L 720 418 L 140 418 Z"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1.5"
              />
              {/* Floor mounting bolt details */}
              {[180, 260, 340, 420, 500, 580, 660].map((bx, i) => (
                <circle key={i} cx={bx} cy="411" r="3" fill="#82C8E5" />
              ))}

              {/* Main Housing Stands (Left & Right Massive Uprights) */}
              {/* Stand 1 (Left Drive Stand) */}
              <path
                d="M 160 370 L 160 170 L 220 150 L 250 160 L 250 370 Z"
                fill="url(#bodyDarkGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <path
                d="M 220 150 L 220 120 L 250 120 L 250 160 Z"
                fill="url(#cyanAccentGrad)"
              />
              {/* Bearing cap left */}
              <circle cx="205" cy="270" r="26" fill="#1E293B" stroke="#82C8E5" strokeWidth="2" />
              <circle cx="205" cy="270" r="14" fill="#334155" />
              <circle cx="205" cy="270" r="6" fill="#82C8E5" />

              {/* Stand 2 (Center Precision 6-Hi Leveler Cassette) */}
              <rect x="270" y="190" width="260" height="180" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
              {/* Cassette faceplate cutout showing rolls */}
              <rect x="290" y="210" width="220" height="140" rx="4" fill="#0F172A" />

              {/* Top & Bottom Precision Roller Arrays */}
              {/* Back-up rolls top */}
              {[320, 370, 420, 470].map((rx, idx) => (
                <g key={`top-roll-${idx}`}>
                  <rect x={rx - 16} y="222" width="32" height="16" rx="4" fill="url(#steelRollGrad)" stroke="#475569" strokeWidth="1" />
                  <line x1={rx - 14} y1="230" x2={rx + 14} y2="230" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
                </g>
              ))}

              {/* Intermediate rolls */}
              {[335, 385, 435].map((rx, idx) => (
                <circle key={`mid-roll-${idx}`} cx={rx} cy="254" r="12" fill="url(#steelRollGrad)" stroke="#64748B" strokeWidth="1" />
              ))}

              {/* Continuous Precision Steel Strip Passing Through Leveler */}
              <path
                d="M 60 280 L 740 280 L 750 287 L 70 287 Z"
                fill="url(#stripSteelGrad)"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              {/* Animated or highlighted strip feed line */}
              <line
                x1="80"
                y1="283.5"
                x2="730"
                y2="283.5"
                stroke="#82C8E5"
                strokeWidth="1.5"
                strokeDasharray="8 6"
                className={isSimulating ? "animate-[dash_1s_linear_infinite]" : ""}
              />

              {/* Work Rolls Top & Bottom Contacting Strip */}
              {[315, 355, 395, 435, 475].map((rx, idx) => (
                <circle key={`work-top-${idx}`} cx={rx} cy="273" r="8" fill="url(#steelRollGrad)" stroke="#334155" strokeWidth="1" />
              ))}
              {[335, 375, 415, 455].map((rx, idx) => (
                <circle key={`work-bot-${idx}`} cx={rx} cy="295" r="8" fill="url(#steelRollGrad)" stroke="#334155" strokeWidth="1" />
              ))}

              {/* Bottom Back-up Rolls */}
              {[320, 370, 420, 470].map((rx, idx) => (
                <rect key={`bot-roll-${idx}`} x={rx - 16} y="318" width="32" height="16" rx="4" fill="url(#steelRollGrad)" stroke="#475569" strokeWidth="1" />
              ))}

              {/* Hydraulic AGC (Automatic Gauge Control) Cylinders on Top */}
              <rect x="330" y="145" width="28" height="45" rx="3" fill="#334155" stroke="#82C8E5" strokeWidth="1.5" />
              <rect x="440" y="145" width="28" height="45" rx="3" fill="#334155" stroke="#82C8E5" strokeWidth="1.5" />
              <rect x="336" y="130" width="16" height="18" fill="url(#cyanAccentGrad)" />
              <rect x="446" y="130" width="16" height="18" fill="url(#cyanAccentGrad)" />
              {/* Hydraulic fluid manifold lines */}
              <path d="M 344 130 C 344 110, 454 110, 454 130" stroke="#82C8E5" strokeWidth="2.5" fill="none" />
              <circle cx="399" cy="110" r="5" fill="#1E293B" stroke="#82C8E5" strokeWidth="1.5" />

              {/* Stand 3 (Right Flying Shear / Recoiler Bridge) */}
              <path
                d="M 550 370 L 550 170 L 610 150 L 640 160 L 640 370 Z"
                fill="url(#bodyDarkGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <circle cx="595" cy="270" r="26" fill="#1E293B" stroke="#82C8E5" strokeWidth="2" />
              <circle cx="595" cy="270" r="14" fill="#334155" />
              <circle cx="595" cy="270" r="6" fill="#82C8E5" />

              {/* Digital Micrometer Readout Module Mounted on Frame */}
              <rect x="375" y="172" width="50" height="22" rx="3" fill="#0F172A" stroke="#82C8E5" strokeWidth="1" />
              <text x="400" y="187" textAnchor="middle" fill="#82C8E5" fontSize="9" fontFamily="monospace" fontWeight="bold">
                0.002mm
              </text>

              {/* Precision Laser Alignment Guide Beam (Soft Cyan) */}
              <line x1="80" y1="250" x2="720" y2="250" stroke="#82C8E5" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="80" cy="250" r="2.5" fill="#82C8E5" />
              <circle cx="720" cy="250" r="2.5" fill="#82C8E5" />

              {/* Brand Label Plaque on Machine Front */}
              <rect x="330" y="358" width="140" height="12" rx="2" fill="#0F172A" stroke="#82C8E5" strokeWidth="0.8" />
              <text x="400" y="367" textAnchor="middle" fill="#F8FAFC" fontSize="7.5" fontWeight="600" letterSpacing="0.8">
                SHIVANSH PRECISION HEAVY SYSTEMS
              </text>
            </g>
          ) : (
            /* TECHNICAL 2D CAD SCHEMATIC ELEVATION VIEW */
            <g id="cad-schematic">
              {/* Dimension lines & Blueprint markings */}
              <rect x="120" y="160" width="560" height="230" fill="none" stroke="#82C8E5" strokeWidth="1.2" strokeDasharray="4 2" />
              <line x1="120" y1="130" x2="680" y2="130" stroke="#1E293B" strokeWidth="1" />
              <line x1="120" y1="125" x2="120" y2="135" stroke="#1E293B" strokeWidth="1" />
              <line x1="680" y1="125" x2="680" y2="135" stroke="#1E293B" strokeWidth="1" />
              <text x="400" y="122" textAnchor="middle" fill="#1E293B" fontSize="10" fontFamily="monospace">
                SPAN L = 5,600 mm ± 0.05
              </text>

              {/* Machine Outline Schematics */}
              <rect x="140" y="180" width="90" height="200" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
              <text x="185" y="285" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600">UNCOILER</text>

              <rect x="260" y="195" width="280" height="185" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
              <text x="400" y="275" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">6-HI LEVELER CASSETTE</text>
              <text x="400" y="295" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">21 ROLLS / HYDRAULIC AGC</text>

              <rect x="570" y="180" width="90" height="200" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
              <text x="615" y="285" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600">RECOILER</text>

              {/* Strip Pass Line */}
              <line x1="100" y1="285" x2="700" y2="285" stroke="#82C8E5" strokeWidth="2.5" />
              <text x="400" y="325" textAnchor="middle" fill="#0284C7" fontSize="9" fontFamily="monospace">
                PASS LINE ELEVATION: +1,150 mm REF
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Floating SaaS-style Informational Nodes (as explicitly requested in prompt) */}
      
      {/* Node 1: Top-Left "High Efficiency" Node */}
      <div className="absolute top-14 left-4 sm:left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-card-elevated max-w-[200px] transition-all hover:scale-105 duration-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-md bg-[#82C8E5]/20 text-slate-800">
            <Zap className="w-3.5 h-3.5 text-[#0284C7]" />
          </div>
          <span className="text-xs font-semibold text-slate-900 tracking-tight">High Efficiency</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">99.4%</span>
          <span className="text-[11px] text-slate-700">Line OEE Uptime</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-[#82C8E5] h-full w-[94%]" />
        </div>
      </div>

      {/* Node 2: Top-Right "ISO Certified" Node */}
      <div className="absolute top-14 right-4 sm:right-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-card-elevated max-w-[190px] transition-all hover:scale-105 duration-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-md bg-[#82C8E5]/20 text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
          </div>
          <span className="text-xs font-semibold text-slate-900 tracking-tight">ISO Certified</span>
        </div>
        <p className="text-xs text-slate-800 font-medium leading-tight">
          ISO 9001:2015 Quality & CE Safety Compliant
        </p>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-[#0284C7] font-medium">
          <CheckCircle2 className="w-3 h-3 text-[#0284C7]" />
          <span>Audit Verified 2026</span>
        </div>
      </div>

      {/* Node 3: Bottom-Left "Precision Machined" Tolerance Node */}
      <div className="absolute bottom-12 left-4 sm:left-8 z-20 hidden md:block bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-card-elevated max-w-[210px] transition-all hover:scale-105 duration-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-md bg-[#82C8E5]/20 text-slate-800">
            <Cpu className="w-3.5 h-3.5 text-[#0284C7]" />
          </div>
          <span className="text-xs font-semibold text-slate-900 tracking-tight">Tolerance Standard</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold font-mono text-slate-900">±0.002 mm</span>
          <span className="text-[11px] text-slate-700">Sub-micron Runout</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-700">
          62–64 HRC Induction Hardened Rolls
        </div>
      </div>

      {/* Bottom Bar Details & Interactive Simulator Toggle */}
      <div className="relative z-10 flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/70 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5 text-[#82C8E5]" />
          <span>Strip Speed: <strong>320 m/min</strong></span>
          <span className="text-slate-300">·</span>
          <span>Max Width: <strong>2,200 mm</strong></span>
        </div>

        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
          title="Toggle active feed simulation"
        >
          <RotateCw className={`w-3 h-3 ${isSimulating ? 'text-[#82C8E5] animate-spin' : ''}`} />
          <span>{isSimulating ? 'Feed Active' : 'Feed Paused'}</span>
        </button>
      </div>
    </div>
  );
};

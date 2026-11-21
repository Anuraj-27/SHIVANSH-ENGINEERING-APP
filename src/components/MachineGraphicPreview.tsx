import React from 'react';

interface MachineGraphicPreviewProps {
  id: string;
}

export const MachineGraphicPreview: React.FC<MachineGraphicPreviewProps> = ({ id }) => {
  return (
    <div className="relative w-full h-44 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-xl border border-slate-200/80 p-3 flex items-center justify-center overflow-hidden group-hover:border-[#82C8E5]/80 transition-colors">
      {/* Background CAD grid */}
      <div className="absolute inset-0 bg-grid-architectural opacity-40 pointer-events-none" />

      {id === 'heavy-slitting-line' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          {/* Base Stand */}
          <rect x="50" y="125" width="220" height="15" rx="3" fill="#1E293B" />
          {/* Left & Right Arbor Columns */}
          <rect x="70" y="45" width="30" height="80" rx="3" fill="#334155" />
          <rect x="220" y="45" width="30" height="80" rx="3" fill="#334155" />
          {/* Top & Bottom Tool Arbors */}
          <rect x="95" y="60" width="130" height="12" rx="2" fill="#94A3B8" />
          <rect x="95" y="88" width="130" height="12" rx="2" fill="#94A3B8" />
          {/* Rotary Slitter Circular Blades */}
          {[115, 140, 165, 190].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="66" r="16" fill="#0F172A" stroke="#82C8E5" strokeWidth="1.5" />
              <circle cx={x} cy="66" r="5" fill="#CBD5E1" />
              <circle cx={x + 10} cy="94" r="16" fill="#0F172A" stroke="#82C8E5" strokeWidth="1.5" />
              <circle cx={x + 10} cy="94" r="5" fill="#CBD5E1" />
            </g>
          ))}
          {/* Steel Strip passing through */}
          <line x1="20" y1="80" x2="300" y2="80" stroke="#82C8E5" strokeWidth="2.5" strokeDasharray="6 4" />
          {/* Eccentric Adjustment Dial */}
          <circle cx="85" cy="35" r="10" fill="#0284C7" stroke="#82C8E5" strokeWidth="1" />
          <text x="85" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace">Ø</text>
        </svg>
      )}

      {id === 'cut-to-length-line' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          <rect x="40" y="125" width="240" height="15" rx="3" fill="#1E293B" />
          {/* Leveler section */}
          <rect x="60" y="65" width="90" height="60" rx="3" fill="#334155" />
          {[75, 95, 115, 135].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="82" r="7" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1" />
              <circle cx={x - 10} cy="98" r="7" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1" />
            </g>
          ))}
          {/* Flying Shear Stand */}
          <rect x="180" y="45" width="80" height="80" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
          {/* Shear Guillotine Blade */}
          <path d="M190 70 L250 82 L250 90 L190 78 Z" fill="#82C8E5" stroke="#FFFFFF" strokeWidth="1" />
          {/* Cut sheet exiting */}
          <rect x="270" y="85" width="40" height="3" fill="#94A3B8" />
          <line x1="20" y1="90" x2="180" y2="90" stroke="#82C8E5" strokeWidth="2" />
        </svg>
      )}

      {id === 'tension-leveling-line' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          <rect x="40" y="125" width="240" height="15" rx="3" fill="#1E293B" />
          {/* Tension Bridle 1 */}
          <rect x="60" y="50" width="60" height="75" rx="3" fill="#334155" />
          <circle cx="78" cy="72" r="14" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1.5" />
          <circle cx="102" cy="100" r="14" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1.5" />
          {/* Leveler Mesh in center */}
          <rect x="135" y="70" width="50" height="55" rx="2" fill="#0F172A" />
          <line x1="140" y1="88" x2="180" y2="88" stroke="#82C8E5" strokeWidth="2" strokeDasharray="3 2" />
          {/* Tension Bridle 2 */}
          <rect x="200" y="50" width="60" height="75" rx="3" fill="#334155" />
          <circle cx="218" cy="72" r="14" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1.5" />
          <circle cx="242" cy="100" r="14" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1.5" />
          {/* Laser flatness sensor */}
          <path d="M150 45 L170 45 L165 58 L155 58 Z" fill="#82C8E5" />
          <line x1="160" y1="58" x2="160" y2="85" stroke="#82C8E5" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      )}

      {id === 'cold-rolling-mill' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          {/* Heavy Mill Stand Housing */}
          <path d="M110 25 L210 25 L210 135 L110 135 Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <rect x="130" y="40" width="60" height="85" rx="3" fill="#0F172A" />
          {/* Hydraulic AGC Cylinder on top */}
          <rect x="145" y="15" width="30" height="20" rx="2" fill="#82C8E5" />
          {/* Backup Rolls (Large) */}
          <circle cx="160" cy="55" r="15" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="160" cy="110" r="15" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1" />
          {/* Work Rolls (Small, precision) */}
          <circle cx="160" cy="76" r="7" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1.5" />
          <circle cx="160" cy="89" r="7" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1.5" />
          {/* Strip being rolled */}
          <line x1="40" y1="82.5" x2="280" y2="82.5" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="40" y1="82.5" x2="155" y2="82.5" stroke="#82C8E5" strokeWidth="3.5" />
        </svg>
      )}

      {id === 'hydraulic-decoiler' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          {/* Machine Pedestal */}
          <rect x="50" y="70" width="70" height="65" rx="4" fill="#1E293B" />
          {/* Main Spindle Shaft */}
          <rect x="110" y="85" width="130" height="20" rx="3" fill="#64748B" />
          {/* Expanding Mandrel Segments */}
          <circle cx="175" cy="95" r="32" fill="#334155" stroke="#82C8E5" strokeWidth="2" />
          <circle cx="175" cy="95" r="14" fill="#0F172A" />
          {/* Expanding Wedges */}
          {[0, 90, 180, 270].map((deg, i) => (
            <line
              key={i}
              x1="175"
              y1="95"
              x2={175 + Math.cos((deg * Math.PI) / 180) * 32}
              y2={95 + Math.sin((deg * Math.PI) / 180) * 32}
              stroke="#82C8E5"
              strokeWidth="2"
            />
          ))}
          {/* Coil Car Scissor Lift */}
          <rect x="130" y="130" width="90" height="12" rx="2" fill="#0284C7" />
          <path d="M145 130 L160 115 L175 130 L190 115 L205 130" stroke="#334155" strokeWidth="2" fill="none" />
        </svg>
      )}

      {id === 'precision-leveler' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          <rect x="45" y="35" width="230" height="100" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <rect x="60" y="48" width="200" height="74" rx="3" fill="#0F172A" />
          {/* Multi-roll nest */}
          {[75, 95, 115, 135, 155, 175, 195, 215, 235].map((x, i) => (
            <circle key={`t-${i}`} cx={x} cy="75" r="6" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1" />
          ))}
          {[85, 105, 125, 145, 165, 185, 205, 225].map((x, i) => (
            <circle key={`b-${i}`} cx={x} cy="92" r="6" fill="#CBD5E1" stroke="#82C8E5" strokeWidth="1" />
          ))}
          <line x1="50" y1="83.5" x2="270" y2="83.5" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
      )}

      {id === 'flying-crop-shear' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          {/* Heavy Shear Frame */}
          <rect x="80" y="30" width="160" height="105" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <rect x="100" y="55" width="120" height="60" rx="2" fill="#0F172A" />
          {/* Upper Moving Blade */}
          <path d="M110 65 L210 75 L210 82 L110 72 Z" fill="#82C8E5" stroke="#FFFFFF" strokeWidth="1" />
          {/* Hydraulic Cylinder */}
          <rect x="145" y="15" width="30" height="25" rx="2" fill="#334155" stroke="#82C8E5" strokeWidth="1" />
          <line x1="160" y1="40" x2="160" y2="65" stroke="#82C8E5" strokeWidth="3" />
        </svg>
      )}

      {id === 'coil-upender' && (
        <svg viewBox="0 0 320 160" className="w-full h-full select-none" fill="none">
          <ellipse cx="160" cy="145" rx="120" ry="10" fill="rgba(30,41,59,0.08)" />
          {/* Rotating Cradle Frame (L-shape / V-deck) */}
          <rect x="70" y="125" width="180" height="15" rx="2" fill="#1E293B" />
          <path d="M120 125 L120 45 L135 45 L135 110 L210 110 L210 125 Z" fill="#0284C7" stroke="#82C8E5" strokeWidth="1.5" />
          {/* Slit Coil nested on deck */}
          <ellipse cx="170" cy="80" rx="28" ry="24" fill="#334155" stroke="#CBD5E1" strokeWidth="2" />
          <ellipse cx="170" cy="80" rx="12" ry="10" fill="#0F172A" />
          {/* Rotation Curved Arrow indicator */}
          <path d="M95 70 A 40 40 0 0 1 150 35" stroke="#82C8E5" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <polygon points="150,30 156,36 148,40" fill="#82C8E5" />
        </svg>
      )}
    </div>
  );
};

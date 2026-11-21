import React, { useState } from 'react';
import { Calculator, ArrowRight, Gauge, Activity, Sparkles, Check } from 'lucide-react';

interface CapacityEstimatorProps {
  onPreFillQuote: (specs: string) => void;
}

export const CapacityEstimator: React.FC<CapacityEstimatorProps> = ({ onPreFillQuote }) => {
  const [width, setWidth] = useState<number>(1500); // mm
  const [thickness, setThickness] = useState<number>(2.5); // mm
  const [speed, setSpeed] = useState<number>(160); // m/min
  const [hours, setHours] = useState<number>(16); // 2 shifts
  const [material, setMaterial] = useState<'steel' | 'stainless' | 'aluminum'>('steel');

  const densities: Record<'steel' | 'stainless' | 'aluminum', number> = {
    steel: 7.85,
    stainless: 7.93,
    aluminum: 2.7,
  };

  // Calculation:
  // Volume per minute = (width/1000) * (thickness/1000) * speed (m^3/min)
  // Weight per minute = Volume * density * 1000 kg/m^3 (kg/min)
  // Daily weight = kg/min * 60 * hours * 0.75 (practical duty factor) / 1000 = Metric Tons
  const density = densities[material];
  const linearMetersPerDay = Math.round(speed * 60 * hours * 0.78);
  const dailyTonnage = Number(
    ((width / 1000) * (thickness / 1000) * speed * 60 * hours * 0.78 * (density * 1000) / 1000).toFixed(1)
  );
  const annualTonnage = Math.round(dailyTonnage * 300);

  const handleApplyToQuote = () => {
    const summary = `Estimated Requirements: ${width} mm width, ${thickness} mm thickness (${material}), at ${speed} m/min speed (~${dailyTonnage} MT/day output)`;
    onPreFillQuote(summary);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="capacity-estimator" className="py-20 bg-white border-b border-slate-200 relative">
      <div className="blueprint-watermark opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
            <Calculator className="w-4 h-4 text-[#82C8E5]" />
            ENGINEERING TOOL
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Processing Line Output & Tonnage Estimator
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Model your daily metal throughput based on coil geometry, material alloy, and line speed parameters to select the optimal Shivansh machine configuration.
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-slate-50/80 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Material Selector */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                  Select Coil Metallurgy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['steel', 'stainless', 'aluminum'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMaterial(m)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all capitalize ${
                        material === m
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {m} Strip
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Coil Width */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Strip Width:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {width} <span className="text-xs text-slate-500 font-normal">mm</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2200"
                  step="50"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#82C8E5]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-700 mt-1">
                  <span>400 mm</span>
                  <span>1,300 mm (Std)</span>
                  <span>2,200 mm (Wide)</span>
                </div>
              </div>

              {/* Slider 2: Strip Thickness */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Strip Gauge / Thickness:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {thickness.toFixed(1)} <span className="text-xs text-slate-500 font-normal">mm</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="12.0"
                  step="0.1"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#82C8E5]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-700 mt-1">
                  <span>0.3 mm (Foil)</span>
                  <span>3.0 mm (Medium)</span>
                  <span>12.0 mm (Heavy)</span>
                </div>
              </div>

              {/* Slider 3: Line Speed */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Continuous Operating Speed:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {speed} <span className="text-xs text-slate-500 font-normal">m/min</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="10"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#82C8E5]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-700 mt-1">
                  <span>30 m/min</span>
                  <span>150 m/min</span>
                  <span>300 m/min (Max)</span>
                </div>
              </div>

              {/* Slider 4: Operating Hours */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Operational Shifts (Hours/Day):</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {hours} <span className="text-xs text-slate-500 font-normal">hrs</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="4"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#82C8E5]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-700 mt-1">
                  <span>8 hrs (1 Shift)</span>
                  <span>16 hrs (2 Shifts)</span>
                  <span>24 hrs (Continuous)</span>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Includes 78% net factory duty factor</span>
              <span className="font-mono font-medium text-slate-700">Density: {density} g/cm³</span>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card-elevated flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  ESTIMATED THROUGHPUT
                </span>
                <span className="text-xs font-mono font-bold text-[#0284C7] bg-[#82C8E5]/20 px-2 py-0.5 rounded">
                  CALCULATED
                </span>
              </div>

              {/* Massive Output Metric */}
              <div className="my-6">
                <div className="text-xs font-medium text-slate-500">Daily Production Output:</div>
                <div className="text-5xl font-black font-mono text-slate-900 tracking-tight mt-1 tabular-nums">
                  {dailyTonnage.toLocaleString()}
                  <span className="text-xl font-sans font-bold text-slate-500 ml-2">MT / Day</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Metric Tons of precision processed coil per 24h cycle
                </div>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] text-slate-700 font-medium">Linear Yield / Day</div>
                  <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                    {(linearMetersPerDay / 1000).toFixed(1)} km
                  </div>
                  <div className="text-[10px] text-slate-700">{linearMetersPerDay.toLocaleString()} meters</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] text-slate-700 font-medium">Annualized Output</div>
                  <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                    {annualTonnage.toLocaleString()} MT
                  </div>
                  <div className="text-[10px] text-slate-700">@ 300 annual working days</div>
                </div>
              </div>

              {/* Recommended Machine Model */}
              <div className="mt-6 p-4 rounded-xl border border-[#82C8E5] bg-[#82C8E5]/10">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  Recommended Shivansh Configuration
                </div>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  {thickness > 6.0
                    ? 'Shivansh Heavy-Gauge CTL-2200 Line with Dual Hydraulic Slitting Arbors'
                    : speed > 200
                    ? 'Shivansh Ultra High-Speed SLT-2000 Line with Automatic Turret Arbors'
                    : 'Shivansh Precision SLT-1600 Slitting Line with 6-Hi Leveler Cassette'}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleApplyToQuote}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-900 bg-[#82C8E5] hover:bg-[#68bddf] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group"
              >
                <span>Transfer Specifications to RFQ Form</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

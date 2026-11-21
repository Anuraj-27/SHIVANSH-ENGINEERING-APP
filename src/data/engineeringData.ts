export interface ProductItem {
  id: string;
  name: string;
  category: 'processing-line' | 'equipment';
  tagline: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  keyFeatures: string[];
  materialsSupported: string[];
  typicalApplications: string[];
  schematicCode: string;
}

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'heavy-slitting-line',
    name: 'Continuous High-Speed Slitting Line',
    category: 'processing-line',
    tagline: 'Micron-accurate coil cutting with zero edge burr',
    description: 'Engineered for high-yield precision slitting of hot rolled, cold rolled, galvanized, and stainless steel coils with quick-change tooling arbors and automated scrap winders.',
    specs: [
      { label: 'Strip Thickness Range', value: '0.2 mm – 16.0 mm' },
      { label: 'Max Coil Width', value: '2,200 mm' },
      { label: 'Max Line Speed', value: '320 m/min' },
      { label: 'Coil Weight Capacity', value: 'Up to 35 Metric Tons' },
      { label: 'Slitting Width Tolerance', value: '± 0.02 mm' },
      { label: 'Drive Automation', value: 'Siemens / ABB Closed Loop PLC' },
    ],
    keyFeatures: [
      'Dual-eccentric arbor adjustment with digital digital readouts',
      'Turret-type quick tool changeover system (under 3 minutes)',
      'Hydraulic looping pit tension control with felt & roll bridles',
      'High-speed auto traversing scrap recoilers with tension clutch'
    ],
    materialsSupported: ['Hot Rolled Steel', 'CRCA Sheets', 'Stainless Steel (304/316)', 'Alloy Aluminum', 'Silicon Electrical Steel'],
    typicalApplications: ['Automotive stamping strips', 'Tube mill feed stock', 'Transformer lamination', 'Electrical panel enclosures'],
    schematicCode: 'SLT-2200-HS'
  },
  {
    id: 'cut-to-length-line',
    name: 'Flying Shear Cut-To-Length Line',
    category: 'processing-line',
    tagline: 'High-speed continuous shearing with precision leveler',
    description: 'Designed for non-stop decoiling, precision multi-roll leveling, and continuous flying shearing of heavy sheet metal coils into dead-flat precision panels.',
    specs: [
      { label: 'Strip Thickness Range', value: '0.5 mm – 12.0 mm' },
      { label: 'Sheet Length Accuracy', value: '± 0.15 mm at 2000 mm' },
      { label: 'Leveler Configuration', value: '6-Hi 21-Roll CNC Leveler' },
      { label: 'Max Line Speed', value: '110 m/min continuous' },
      { label: 'Max Cut Frequency', value: '120 cuts / minute' },
      { label: 'Stacking System', value: 'Magnetic & Air-Cushion Dual Stacker' },
    ],
    keyFeatures: [
      'Synchronous servo flying shear eliminates stop-start sheet marks',
      'Hydraulic roll-bending system for eliminating center buckle and edge wave',
      'Zero-scratch polyurethane coated drive and pinch rollers',
      'Automated pallet changer with live weight scale feedback'
    ],
    materialsSupported: ['Cold Rolled Steel', 'Electro-Galvanized', 'Prepainted Steel (PPGI)', 'Copper & Brass Coils'],
    typicalApplications: ['Home appliances white goods', 'Elevator cabin panels', 'Architectural facades', 'Switchgear cabinets'],
    schematicCode: 'CTL-1600-FS'
  },
  {
    id: 'tension-leveling-line',
    name: 'Tension Leveling & Cleaning Line',
    category: 'processing-line',
    tagline: 'Eliminates internal stress and residual coil camber',
    description: 'High-tension continuous elongation line combining mechanical roll bending under intense hydraulic tension to achieve true panel flatness for surface-critical applications.',
    specs: [
      { label: 'Elongation Range', value: '0.2% – 2.5% controlled' },
      { label: 'Tension Bridle Force', value: 'Up to 300 kN' },
      { label: 'Line Speed', value: 'Up to 240 m/min' },
      { label: 'Flatness Standard', value: '< 2 I-Units guaranteed' },
      { label: 'Washing System', value: 'Ultrasonic degreasing & hot air dry' },
      { label: 'Thickness Capability', value: '0.15 mm – 2.5 mm' },
    ],
    keyFeatures: [
      'Interlocking 4-bridle drive system with precision regenerative braking',
      'Four-roll cluster cassette with quick motorized retraction',
      'Continuous laser non-contact flatness monitoring array',
      'Chemical-free multi-stage electrolytic cleaning bath'
    ],
    materialsSupported: ['Aluminum 1xxx-6xxx alloys', 'Cold Rolled Ultra-Thin', 'Tinplate Coil', 'Bright Annealed Stainless'],
    typicalApplications: ['Lithographic plates', 'Beverage can bodies', 'Aerospace skins', 'EV battery casing foil'],
    schematicCode: 'TLL-1500-ULTRA'
  },
  {
    id: 'cold-rolling-mill',
    name: '4-Hi / 6-Hi Cold Rolling Reversing Mill',
    category: 'processing-line',
    tagline: 'Extreme reduction ratios with sub-micron gauge consistency',
    description: 'Heavy duty reversing cold rolling mill engineered for high-rigidity strip reduction, uniform mechanical grain structure, and mirror surface finish.',
    specs: [
      { label: 'Rolling Force', value: 'Up to 14,000 kN' },
      { label: 'Entry Thickness', value: 'Up to 6.0 mm' },
      { label: 'Finished Thickness', value: 'Down to 0.12 mm' },
      { label: 'Rolling Speed', value: '0 – 600 m/min' },
      { label: 'Roll Eccentricity Control', value: 'Dynamic AGC Response < 10 ms' },
      { label: 'Thickness Tolerance', value: '± 0.002 mm (2 microns)' },
    ],
    keyFeatures: [
      'High-response hydraulic Automatic Gauge Control (AGC) cylinders',
      'Work roll positive and negative bending for parabolic crown control',
      'Automated roll coolant & lubrication filtration system',
      'High-torque mill stand housing cast from high-rigidity spheroidal iron'
    ],
    materialsSupported: ['Carbon Steel', 'Medium & High Carbon Strip', 'Spring Steel', 'Nickel Alloys'],
    typicalApplications: ['Precision saw blades', 'Automotive transmission clutches', 'Bearing raceways', 'Cutlery blades'],
    schematicCode: 'CRM-6HI-REV'
  },
  {
    id: 'hydraulic-decoiler',
    name: 'Double-Mandrel Heavy Duty Decoiler',
    category: 'equipment',
    tagline: '35-Ton hydraulic expansion with automated coil car',
    description: 'Precision hydraulic uncoiler with motorized wedge-type spindle expansion, pneumatic brake disk assembly, and integrated hydraulic coil saddle loading car.',
    specs: [
      { label: 'Weight Capacity', value: '10 to 35 Metric Tons' },
      { label: 'Coil I.D. Range', value: '508 mm – 610 mm (with pads to 760 mm)' },
      { label: 'Coil O.D. Max', value: '2,100 mm' },
      { label: 'Expansion Drive', value: 'Hydraulic Cylinder 160 Bar' },
      { label: 'Braking System', value: 'Dual multi-disc pneumatic with cooling' },
      { label: 'Hold-Down Roll', value: 'Motorized polyurethane snubber roll' },
    ],
    keyFeatures: [
      'Wedge-link expanding segments ensuring 360° concentric coil grip',
      'Floor-flush hydraulic traversing coil car with vertical scissor lift',
      'Overarm motorized snubber roller to prevent clock-springing',
      'Laser strip edge guidance sensor with hydraulic base shifting'
    ],
    materialsSupported: ['All sheet metal coils', 'Pre-coated coils', 'Heavy gauge strip'],
    typicalApplications: ['Entry uncoiling for slitting lines', 'Tube mills', 'Continuous stamping presses'],
    schematicCode: 'EQ-DEC-35T'
  },
  {
    id: 'precision-leveler',
    name: 'CNC 6-Hi Precision Roller Leveler',
    category: 'equipment',
    tagline: '21-Roll stress relief with dynamic back-up roll adjustment',
    description: 'High-density multi-roll corrective leveler eliminating coil set, cross bow, camber, and internal material residual stress with motorized CNC wedge adjustments.',
    specs: [
      { label: 'Work Roll Count', value: '21 Precision Ground Rolls' },
      { label: 'Work Roll Diameter', value: 'Ø 35 mm to Ø 90 mm' },
      { label: 'Roll Surface Hardness', value: '62–64 HRC Induction Hardened' },
      { label: 'Back-Up Flights', value: '7 to 9 independently adjustable flights' },
      { label: 'Drive Transmission', value: 'Multi-shaft universal joint gearbox' },
      { label: 'Control Screen', value: '15-inch Touchscreen Recipe Memory' },
    ],
    keyFeatures: [
      'Independent motorized back-up roll banks for targeted localized strain relief',
      'Quick-swapping cassette mechanism for fast maintenance and cleaning',
      'Hard chrome micro-crack roller plating with 0.1 Ra surface finish',
      'Integrated oil circulation & bearing temperature monitoring'
    ],
    materialsSupported: ['High-strength automotive steel (AHSS)', 'Stainless steel', 'Aluminum plates', 'Copper foil'],
    typicalApplications: ['Laser cutting blank preparation', 'Perforated sheets', 'Chassis bracket forming'],
    schematicCode: 'EQ-LEV-21R'
  },
  {
    id: 'flying-crop-shear',
    name: 'High-Cycle Rotary Hydraulic Crop Shear',
    category: 'equipment',
    tagline: 'Extreme shear velocity with zero line deceleration',
    description: 'Rigid cast-steel shear frame equipped with hardened tool-steel cutting knives for squaring coil head and tail ends, or continuous flying cut operations.',
    specs: [
      { label: 'Max Material Width', value: '2,000 mm' },
      { label: 'Max Shearing Thickness', value: '12.0 mm Mild Steel' },
      { label: 'Blade Clearance', value: 'Hydraulically adjusted with dial scale' },
      { label: 'Knife Material', value: 'D2 / HCHCr High wear tool steel' },
      { label: 'Cycle Time', value: '0.45 seconds per stroke' },
      { label: 'Blade Edges', value: '4-edge reversible blades' },
    ],
    keyFeatures: [
      'Hydraulic synchronized hold-down clamp bar before blade contact',
      'Integrated scrap chute with automatic diversion diverter flap',
      'Shock-absorbing heavy cast-iron bed dampening impact vibrations',
      'Dual safety optical light curtains and interlocked protective enclosure'
    ],
    materialsSupported: ['Carbon steel', 'Galvanized iron', 'Alloy steel', 'Armor plate'],
    typicalApplications: ['Head/tail crop before welder', 'Defect rejection cropping', 'Continuous line shearing'],
    schematicCode: 'EQ-SHR-2000'
  },
  {
    id: 'coil-upender',
    name: 'Mechanical & Hydraulic 90° Coil Upender',
    category: 'equipment',
    tagline: 'Heavy coil tilting between eye-to-sky and eye-to-horizon',
    description: 'Robust material handling tilter engineered to rotate heavy slit coils and mother coils 90 degrees safely with anti-slip V-deck and hydraulic safety valving.',
    specs: [
      { label: 'Load Capacity', value: '5 to 40 Metric Tons' },
      { label: 'Rotation Angle', value: '90° Continuous' },
      { label: 'Cycle Time (90°)', value: '28 seconds' },
      { label: 'Platform Deck', value: 'V-Grooved nylon/hardwood lined' },
      { label: 'Drive Mechanism', value: 'Dual gear-motor rack & pinion / Hydraulic' },
      { label: 'Safety Redundancy', value: 'Mechanical counter-balance stops' },
    ],
    keyFeatures: [
      'Self-locking gear system prevents platform drift in any tilted position',
      'Smooth acceleration & deceleration via variable frequency drive',
      'Surface-protective polyurethane pads prevent coil outer wrap damage',
      'Crane loading clearance with optional powered rotation base'
    ],
    materialsSupported: ['Steel coils', 'Slit coil packs', 'Heavy wire spools', 'Die tooling molds'],
    typicalApplications: ['Warehouse logistics', 'Packaging lines', 'Slitting coil packaging stations'],
    schematicCode: 'EQ-UPN-40T'
  }
];

export const ENGINEERING_METRICS = [
  { value: '±0.002 mm', label: 'Machining Precision', detail: 'Sub-micron CNC ground tolerances' },
  { value: '500+', label: 'Global Installations', detail: 'Across 28 industrial territories' },
  { value: '99.4%', label: 'Average Line OEE', detail: 'Verified operational availability' },
  { value: '28 Years', label: 'Precision Heritage', detail: 'Pioneering heavy hardware OEM' }
];

export const SERVICES_DATA = [
  {
    id: 'turnkey-installation',
    title: 'Turnkey Plant Commissioning',
    number: '01',
    description: 'Complete civil foundation design, mechanical erection, pneumatic/hydraulic piping, and full electrical line integration overseen by veteran Shivansh site engineers.',
    deliverables: ['Foundation anchor engineering plans', 'Complete mechanical line alignment', 'Laser geometric verification', 'Cold & hot trial production runs'],
    timeline: '4 – 8 Weeks on-site'
  },
  {
    id: 'retrofitting-automation',
    title: 'Retrofit & Automation Upgrades',
    number: '02',
    description: 'Modernize legacy processing lines with modern closed-loop Siemens/Allen-Bradley PLCs, AC vector drives, non-contact laser measurement, and digital recipe control.',
    deliverables: ['Replacement of obsolete DC drives', 'Digital tension & gauge control integration', 'SCADA & IoT production telemetry', 'Up to 35% higher line throughput'],
    timeline: '2 – 3 Weeks downtime minimized'
  },
  {
    id: 'tooling-spares',
    title: 'Precision Tooling & Blade Grinding',
    number: '03',
    description: 'High-alloy rotary slitter knives, rubber stripper rings, spacers, and leveler rolls ground to mirror Ra 0.08 finish with cryogenic heat treatment for extended life.',
    deliverables: ['D2 & Tungsten Carbide rotary blades', 'Precision shim sets ± 0.001 mm', 'Sub-micron roll re-grinding service', 'Emergency spares express shipment'],
    timeline: 'In-stock / 48hr express reconditioning'
  },
  {
    id: 'preventive-maintenance',
    title: 'Preventive Maintenance & Calibration',
    number: '04',
    description: 'Scheduled comprehensive audits, laser vibration analysis, hydraulic contamination testing, and ISO calibration certificates for critical line elements.',
    deliverables: ['Laser alignment of roll axes', 'Hydraulic proportional valve calibration', 'Thermal imaging of drive gearboxes', 'Detailed compliance audit reports'],
    timeline: 'Quarterly & Annual contracts'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'High-Speed Precision Slitting Line (2,200 mm)',
    category: 'processing-line',
    location: 'Automotive Steel Service Center, Pune',
    speed: '300 m/min',
    description: 'Commissioned 2200 mm wide heavy slitting line with dual turret tool arbor head and automated strapping station.',
    imageType: 'slitting'
  },
  {
    id: 'gal-2',
    title: 'Flying Shear Cut-To-Length Line',
    category: 'processing-line',
    location: 'Electrical Stamping Facility, Nashik',
    speed: '100 m/min',
    description: 'Precision cut-to-length processing line handling mirror-finish stainless steel with air-float stacking table.',
    imageType: 'ctl'
  },
  {
    id: 'gal-3',
    title: 'CNC 6-Hi 21-Roll Leveler Cassette',
    category: 'equipment',
    location: 'Heavy Industrial Fabrication Yard, Gujarat',
    speed: '21 Ground Rolls',
    description: 'Individual motorized back-up flight leveler cassette displaying hardened and chrome-plated work rolls.',
    imageType: 'leveler'
  },
  {
    id: 'gal-4',
    title: '35-Ton Double-Mandrel Decoil Machine',
    category: 'equipment',
    location: 'Cold Rolling Mill Complex, Mumbai',
    speed: '35T Payload',
    description: 'Heavy duty uncoiling station equipped with automated traversing scissor lift coil car and hydraulic snubber roll.',
    imageType: 'decoiler'
  },
  {
    id: 'gal-5',
    title: 'Tension Leveling & Continuous Cleaning Bay',
    category: 'processing-line',
    location: 'Precision Foil Manufacturing Plant, Chennai',
    speed: '240 m/min',
    description: 'High-tension continuous bridle stand assembly for eliminating strip internal stresses in ultra-thin foil.',
    imageType: 'tension'
  },
  {
    id: 'gal-6',
    title: 'Rotary Hydraulic Crop Shear Assembly',
    category: 'equipment',
    location: 'Tube & Section Mill Facility, Faridabad',
    speed: '0.45s Cycle',
    description: 'Precision shear bed with hydraulic clamping bar and reversible four-edge high alloy tool-steel blades.',
    imageType: 'shear'
  }
];

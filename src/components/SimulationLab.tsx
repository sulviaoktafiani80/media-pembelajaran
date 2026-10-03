import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FlaskConical, 
  RotateCcw, 
  Info, 
  HelpCircle, 
  TrendingDown, 
  Gauge, 
  Waves, 
  Layers, 
  Maximize2 
} from 'lucide-react';

type SimulationMode = 'hidrostatis' | 'pascal' | 'archimedes';

export const SimulationLab: React.FC = () => {
  const { recordSimulationUse, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState<SimulationMode>('hidrostatis');

  useEffect(() => {
    recordSimulationUse(activeTab);
  }, [activeTab]);

  // --------------------------------------------------------------------------
  // STATE SIMULASI 1: TEKANAN HIDROSTATIS
  // --------------------------------------------------------------------------
  const [fluidDensity, setFluidDensity] = useState<number>(1000); // kg/m³
  const [gravity, setGravity] = useState<number>(9.8); // m/s²
  const [depth, setDepth] = useState<number>(5.0); // meter (0 - 10m)
  const [includeAtmosphere, setIncludeAtmosphere] = useState<boolean>(true);
  const P0 = 101325; // 1 atm = 101.325 Pa

  // Preset fluids
  const fluidPresets = [
    { label: 'Air Tawar', density: 1000, color: '#38bdf8' },
    { label: 'Minyak Goreng', density: 800, color: '#fbbf24' },
    { label: 'Air Laut Mantang', density: 1025, color: '#0284c7' },
    { label: 'Madu Alami', density: 1420, color: '#f59e0b' },
    { label: 'Air Raksa (Hg)', density: 13600, color: '#94a3b8' },
  ];

  // Preset gravities
  const gravityPresets = [
    { label: 'Bumi (9,8 m/s²)', g: 9.8 },
    { label: 'Bulan (1,6 m/s²)', g: 1.62 },
    { label: 'Jupiter (24,8 m/s²)', g: 24.79 },
  ];

  const hydrostaticPressure = Math.round(fluidDensity * gravity * depth);
  const totalPressure = includeAtmosphere ? hydrostaticPressure + P0 : hydrostaticPressure;

  // --------------------------------------------------------------------------
  // STATE SIMULASI 2: HUKUM PASCAL (DONGKRAK HIDROLIK)
  // --------------------------------------------------------------------------
  const [area1, setArea1] = useState<number>(0.02); // m²
  const [area2, setArea2] = useState<number>(0.4); // m²
  const [force1, setForce1] = useState<number>(200); // N

  const ratio = area2 / area1;
  const force2 = Math.round(force1 * ratio);
  const displacement1 = 10; // cm down
  const displacement2 = Number((displacement1 / ratio).toFixed(2)); // cm up (volume constancy)

  // --------------------------------------------------------------------------
  // STATE SIMULASI 3: HUKUM ARCHIMEDES (TERAPUNG, MELAYANG, TENGGELAM)
  // --------------------------------------------------------------------------
  const [solidDensity, setSolidDensity] = useState<number>(650); // kg/m³
  const [archimedesFluidDensity, setArchimedesFluidDensity] = useState<number>(1000); // kg/m³
  const objectVolume = 0.05; // m³

  // Calculation of condition
  let stateCondition: 'terapung' | 'melayang' | 'tenggelam' = 'terapung';
  let submergedFraction = 1.0;
  if (solidDensity < archimedesFluidDensity) {
    stateCondition = 'terapung';
    submergedFraction = solidDensity / archimedesFluidDensity;
  } else if (Math.abs(solidDensity - archimedesFluidDensity) < 10) {
    stateCondition = 'melayang';
    submergedFraction = 1.0;
  } else {
    stateCondition = 'tenggelam';
    submergedFraction = 1.0;
  }

  const weightObject = Math.round(solidDensity * objectVolume * 9.8);
  const buoyantForce = stateCondition === 'tenggelam'
    ? Math.round(archimedesFluidDensity * objectVolume * 9.8)
    : weightObject;

  const normalForceFloor = stateCondition === 'tenggelam' ? weightObject - buoyantForce : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Simulation Header & Mode Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Laboratorium Fisika Virtual SMA Negeri 1 Mantang</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Eksperimen Interaktif Fluida Statis
          </h1>
        </div>

        {/* 3 Simulation Mode Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('hidrostatis')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'hidrostatis'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>1. Tekanan Hidrostatis</span>
          </button>

          <button
            onClick={() => setActiveTab('pascal')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pascal'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Hukum Pascal</span>
          </button>

          <button
            onClick={() => setActiveTab('archimedes')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'archimedes'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>3. Hukum Archimedes</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SIMULASI 1: TEKANAN HIDROSTATIS                                      */}
      {/* ==================================================================== */}
      {activeTab === 'hidrostatis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Stage Zone: Visual Water Tank (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Visualisasi Kolom Fluida & Sensor Kedalaman
              </span>
              <span className="text-xs text-slate-500 font-mono">
                h = {depth.toFixed(1)} meter
              </span>
            </div>

            {/* Virtual Tank Stage */}
            <div className="relative w-full h-84 sm:h-96 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col justify-end p-4">
              
              {/* Atmospheric overlay above water */}
              <div className="absolute top-2 left-4 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                <span>Tekanan Udara Luar (P₀) = 101,3 kPa</span>
              </div>

              {/* Water Body */}
              <div 
                className="w-full relative rounded-b-lg transition-all duration-300 flex flex-col justify-end"
                style={{ 
                  height: '75%',
                  backgroundColor: fluidPresets.find(f => f.density === fluidDensity)?.color || '#38bdf8',
                  opacity: 0.85
                }}
              >
                {/* Surface wave shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 border-t border-white/60" />

                {/* Depth Meter Lines (0 to 10m) */}
                <div className="absolute top-0 bottom-0 left-3 flex flex-col justify-between text-[10px] font-mono text-slate-900/70 select-none py-1 pointer-events-none">
                  <span>0 m (Permukaan)</span>
                  <span>2 m</span>
                  <span>4 m</span>
                  <span>6 m</span>
                  <span>8 m</span>
                  <span>10 m (Dasar)</span>
                </div>

                {/* Hydrostatic Pressure Gradient Visual Vectors */}
                <div className="absolute inset-y-2 right-4 flex flex-col justify-around items-end text-[11px] font-mono opacity-80 pointer-events-none text-slate-900">
                  <span className="text-[10px] text-slate-700">Tekanan Rendah</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">→</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">→→</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">→→→</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">→→→→</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-900">Tekanan Maksimum Dasar</span>
                </div>

                {/* Pressure Sensor Probe (Draggable by slider or click) */}
                <div 
                  className="absolute left-1/3 right-1/4 transition-all duration-150 flex items-center gap-3"
                  style={{ top: `${(depth / 10) * 88}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-sky-400 flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-sky-500/50">
                    <Gauge className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div className="px-2.5 py-1 rounded bg-slate-900/90 text-white font-mono text-xs shadow-md border border-slate-700">
                    <span>Ph = {(hydrostaticPressure / 1000).toFixed(1)} kPa</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Live Readout Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Tekanan Hidrostatis (Ph)</span>
                <span className="text-base font-bold font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                  {hydrostaticPressure.toLocaleString('id-ID')} Pa
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {(hydrostaticPressure / 1000).toFixed(2)} kPa
                </span>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Tekanan Total / Mutlak</span>
                <span className="text-base font-bold font-mono text-indigo-700 dark:text-indigo-300 tabular-nums">
                  {totalPressure.toLocaleString('id-ID')} Pa
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {(totalPressure / 101325).toFixed(2)} atm
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Rumus Aktif</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block mt-1">
                  P = ρ × g × h
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {fluidDensity} × {gravity} × {depth.toFixed(1)}
                </span>
              </div>
            </div>

          </div>

          {/* Control Deck (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Panel Kontrol Parameter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Geser nilai untuk mengamati perubahan tekanan fluida secara langsung.
              </p>
            </div>

            {/* Slider 1: Kedalaman (h) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="depth-slider" className="text-slate-700 dark:text-slate-300">
                  Kedalaman dari Permukaan (h):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {depth.toFixed(1)} meter
                </span>
              </div>
              <input
                id="depth-slider"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 m (Permukaan)</span>
                <span>5 m</span>
                <span>10 m (Dasar)</span>
              </div>
            </div>

            {/* Slider 2: Massa Jenis Zat Cair (rho) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="density-slider" className="text-slate-700 dark:text-slate-300">
                  Massa Jenis Fluida (ρ):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {fluidDensity} kg/m³
                </span>
              </div>
              <input
                id="density-slider"
                type="range"
                min="600"
                max="2000"
                step="25"
                value={fluidDensity}
                onChange={(e) => setFluidDensity(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {fluidPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setFluidDensity(preset.density)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      fluidDensity === preset.density
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Percepatan Gravitasi (g) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="gravity-slider" className="text-slate-700 dark:text-slate-300">
                  Percepatan Gravitasi (g):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {gravity.toFixed(2)} m/s²
                </span>
              </div>
              <input
                id="gravity-slider"
                type="range"
                min="1.0"
                max="25.0"
                step="0.1"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {gravityPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setGravity(preset.g)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      Math.abs(gravity - preset.g) < 0.1
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Tekanan Atmosfer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Sertakan Tekanan Atmosfer (P₀):
              </span>
              <input
                type="checkbox"
                checked={includeAtmosphere}
                onChange={(e) => setIncludeAtmosphere(e.target.checked)}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Sederhana & Wawasan Konsep */}
            <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-xs space-y-1.5 leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300">
                <Info className="w-3.5 h-3.5" />
                <span>Penjelasan Konsep Sederhana:</span>
              </div>
              <p>
                Semakin dalam posisi sensor dimasukkan ke dalam air, semakin besar berat air di atasnya yang menekan sensor. Itulah mengapa penyelam di kedalaman 10 meter laut Mantang menanggung tekanan dua kali lipat dibanding di udara terbuka.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SIMULASI 2: HUKUM PASCAL (DONGKRAK HIDROLIK)                         */}
      {/* ==================================================================== */}
      {activeTab === 'pascal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Stage Zone: U-Tube Hydraulic Lift Visual */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Visualisasi Sistem Pipa U Bejana Pascal
              </span>
              <span className="text-xs text-sky-600 font-mono font-semibold">
                Faktor Pengganda: {ratio}×
              </span>
            </div>

            {/* Interactive U-Tube Diagram */}
            <div className="relative w-full h-84 sm:h-96 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-6 flex items-end justify-center">
              
              {/* U-tube container */}
              <div className="relative w-full max-w-lg h-64 flex justify-between items-end">
                
                {/* Left Cylinder: Piston Kecil (Input) */}
                <div 
                  className="flex flex-col items-center justify-end transition-all"
                  style={{ width: `${Math.max(15, area1 * 800)}px` }}
                >
                  {/* Push down force vector arrow */}
                  <div className="flex flex-col items-center mb-1 text-xs text-rose-500 font-bold font-mono">
                    <span>F₁ = {force1} N</span>
                    <TrendingDown className="w-5 h-5 text-rose-500 animate-bounce" />
                  </div>
                  
                  {/* Piston 1 head */}
                  <div className="w-full h-4 bg-slate-700 dark:bg-slate-400 rounded-t border border-slate-800" />
                  
                  {/* Fluid column under piston 1 */}
                  <div 
                    className="w-full bg-sky-500/80 border-x border-sky-600 transition-all duration-300"
                    style={{ height: `${120 - displacement1 * 4}px` }}
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 whitespace-nowrap">
                    Piston Kecil (A₁ = {area1} m²)
                  </span>
                </div>

                {/* Connecting Pipe / Bottom Reservoir */}
                <div className="flex-1 h-12 bg-sky-500/80 border-y border-sky-600 flex items-center justify-center">
                  <span className="text-[10px] text-white/90 font-mono font-semibold">
                    Tekanan Sama (P₁ = P₂)
                  </span>
                </div>

                {/* Right Cylinder: Piston Besar (Output & Heavy Load) */}
                <div 
                  className="flex flex-col items-center justify-end transition-all"
                  style={{ width: `${Math.min(180, area2 * 350)}px` }}
                >
                  {/* Car / Load on piston 2 */}
                  <div className="p-2 mb-1 rounded bg-amber-500 text-white font-bold text-xs text-center shadow-md border border-amber-600">
                    <span>Beban Mobil</span>
                    <span className="block text-[10px] font-mono">F₂ = {force2.toLocaleString('id-ID')} N</span>
                  </div>

                  {/* Piston 2 head */}
                  <div className="w-full h-4 bg-slate-700 dark:bg-slate-400 rounded-t border border-slate-800" />

                  {/* Fluid column under piston 2 */}
                  <div 
                    className="w-full bg-sky-500/80 border-x border-sky-600 transition-all duration-300"
                    style={{ height: `${120 + displacement2 * 4}px` }}
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 whitespace-nowrap">
                    Piston Besar (A₂ = {area2} m²)
                  </span>
                </div>

              </div>

            </div>

            {/* Pascal Readout Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Gaya Angkat Output (F₂)</span>
                <span className="text-lg font-bold font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                  {force2.toLocaleString('id-ID')} N
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Setara angkat {Math.round(force2 / 9.8)} kg!
                </span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Keuntungan Mekanis</span>
                <span className="text-lg font-bold font-mono text-amber-700 dark:text-amber-300 tabular-nums">
                  {ratio.toFixed(1)}× Lipat
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Rasio A₂ / A₁
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Kekekalan Usaha</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block mt-1">
                  s₂ = s₁ / {ratio}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Piston naik {displacement2} cm
                </span>
              </div>
            </div>

          </div>

          {/* Control Deck (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Pengaturan Dongkrak Hidrolik
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ubah gaya masukan dan luas penampang kedua silinder.
              </p>
            </div>

            {/* Slider Gaya Masukan F1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="f1-slider" className="text-slate-700 dark:text-slate-300">
                  Gaya Tekan Input (F₁):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {force1} Newton
                </span>
              </div>
              <input
                id="f1-slider"
                type="range"
                min="50"
                max="1000"
                step="25"
                value={force1}
                onChange={(e) => setForce1(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>50 N (Tekan Tangan)</span>
                <span>500 N</span>
                <span>1.000 N (Tekan Kaki)</span>
              </div>
            </div>

            {/* Slider Luas Piston Kecil A1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="a1-slider" className="text-slate-700 dark:text-slate-300">
                  Luas Piston Kecil (A₁):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {area1} m²
                </span>
              </div>
              <input
                id="a1-slider"
                type="range"
                min="0.01"
                max="0.05"
                step="0.005"
                value={area1}
                onChange={(e) => setArea1(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Slider Luas Piston Besar A2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="a2-slider" className="text-slate-700 dark:text-slate-300">
                  Luas Piston Besar (A₂):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {area2} m²
                </span>
              </div>
              <input
                id="a2-slider"
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={area2}
                onChange={(e) => setArea2(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Penjelasan Pascal Sederhana */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 text-xs space-y-1.5 leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <Info className="w-3.5 h-3.5" />
                <span>Prinsip Kerja di Bengkel Motor Mantang:</span>
              </div>
              <p>
                Zat cair tidak dapat dimampatkan. Tekanan dari gaya tangan kita (F₁/A₁) merambat utuh melalui minyak ke piston besar. Karena penampang piston besar {ratio}× lebih luas, maka gaya angkat mobil pun menjadi {ratio}× lipat lebih perkasa!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SIMULASI 3: HUKUM ARCHIMEDES (TERAPUNG, MELAYANG, TENGGELAM)         */}
      {/* ==================================================================== */}
      {activeTab === 'archimedes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Stage Zone: Buoyancy Visual Tank */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Tangki Daya Apung & Vektor Gaya
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Status Fisis:</span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  stateCondition === 'terapung'
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    : stateCondition === 'melayang'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  ● {stateCondition}
                </span>
              </div>
            </div>

            {/* Archimedes Tank Stage */}
            <div className="relative w-full h-84 sm:h-96 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-end overflow-hidden">
              
              {/* Fluid Area */}
              <div className="w-full h-72 relative bg-sky-500/40 dark:bg-sky-600/30 rounded-b-lg border-t-2 border-sky-400">
                
                {/* Surface Label */}
                <span className="absolute top-1 left-2 text-[10px] font-mono text-sky-800 dark:text-sky-200">
                  Permukaan Fluida (ρ_f = {archimedesFluidDensity} kg/m³)
                </span>

                {/* Submerged / Floating Object */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-28 h-28 rounded-lg shadow-lg border-2 border-slate-800 transition-all duration-500 flex flex-col items-center justify-center p-2 text-center"
                  style={{
                    backgroundColor: solidDensity <= 800 ? '#d97706' : solidDensity <= 1050 ? '#64748b' : '#334155',
                    color: '#ffffff',
                    top: stateCondition === 'terapung' 
                      ? `${-28 * (1 - submergedFraction)}px` 
                      : stateCondition === 'melayang' 
                      ? '35%' 
                      : '60%' // Sits at bottom
                  }}
                >
                  <span className="text-xs font-bold leading-tight">Balok Benda</span>
                  <span className="text-[10px] font-mono opacity-90">{solidDensity} kg/m³</span>
                  {stateCondition === 'terapung' && (
                    <span className="text-[9px] font-mono text-sky-200 mt-1">
                      Tercelup: {Math.round(submergedFraction * 100)}%
                    </span>
                  )}
                </div>

                {/* Force Vector Arrows: Weight Down vs Buoyancy Up */}
                <div className="absolute right-8 top-1/3 flex flex-col items-center gap-4 text-xs font-mono">
                  {/* Upward Buoyancy Vector */}
                  <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold">
                    <span>↑ Fa = {buoyantForce} N (Gaya Apung)</span>
                  </div>
                  {/* Downward Weight Vector */}
                  <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                    <span>↓ W = {weightObject} N (Berat Benda)</span>
                  </div>
                  {normalForceFloor > 0 && (
                    <div className="text-[10px] text-amber-500">
                      Gaya Tekan Normal Dasar = {normalForceFloor} N
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Live Readout Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Gaya Apung (Fa)</span>
                <span className="text-lg font-bold font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                  {buoyantForce} N
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Arah Tegak ke Atas
                </span>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Gaya Berat Benda (W)</span>
                <span className="text-lg font-bold font-mono text-rose-700 dark:text-rose-300 tabular-nums">
                  {weightObject} N
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Arah Gravitasi ke Bawah
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Volume Tercelup</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 block mt-0.5">
                  {Math.round(submergedFraction * 100)}% Bagian
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {(objectVolume * submergedFraction).toFixed(3)} m³
                </span>
              </div>
            </div>

          </div>

          {/* Control Deck (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Eksperimen Kerapatan Zat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uji kondisi benda dengan mengubah massa jenis balok dan zat cair.
              </p>
            </div>

            {/* Slider Massa Jenis Benda */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="solid-density-slider" className="text-slate-700 dark:text-slate-300">
                  Massa Jenis Benda (ρ_benda):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {solidDensity} kg/m³
                </span>
              </div>
              <input
                id="solid-density-slider"
                type="range"
                min="100"
                max="2500"
                step="50"
                value={solidDensity}
                onChange={(e) => setSolidDensity(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: 'Kayu Ringan', val: 500 },
                  { label: 'Es Padat', val: 920 },
                  { label: 'Melayang Seimbang', val: archimedesFluidDensity },
                  { label: 'Batu / Bata', val: 1800 },
                  { label: 'Aluminium', val: 2500 },
                ].map((mat) => (
                  <button
                    key={mat.label}
                    onClick={() => setSolidDensity(mat.val)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      solidDensity === mat.val
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {mat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Massa Jenis Cairan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="fluid-density-slider" className="text-slate-700 dark:text-slate-300">
                  Massa Jenis Fluida (ρ_fluida):
                </label>
                <span className="font-mono text-sky-600 dark:text-sky-400 tabular-nums text-sm">
                  {archimedesFluidDensity} kg/m³
                </span>
              </div>
              <input
                id="fluid-density-slider"
                type="range"
                min="600"
                max="1500"
                step="25"
                value={archimedesFluidDensity}
                onChange={(e) => setArchimedesFluidDensity(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: 'Minyak (800)', val: 800 },
                  { label: 'Air Murni (1000)', val: 1000 },
                  { label: 'Air Laut Asin (1030)', val: 1030 },
                  { label: 'Madu Hutan (1420)', val: 1420 },
                ].map((fl) => (
                  <button
                    key={fl.label}
                    onClick={() => setArchimedesFluidDensity(fl.val)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      archimedesFluidDensity === fl.val
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {fl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kesimpulan Kondisi Benda */}
            <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-xs space-y-1.5 leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300">
                <Info className="w-3.5 h-3.5" />
                <span>Analisis Hukum Archimedes:</span>
              </div>
              {stateCondition === 'terapung' && (
                <p>
                  Karena massa jenis benda ({solidDensity} kg/m³) lebih kecil daripada fluida ({archimedesFluidDensity} kg/m³), benda mengapung. Bagian yang terendam sebesar {Math.round(submergedFraction * 100)}% sudah cukup menghasilkan gaya angkat Fa yang menyeimbangkan berat benda.
                </p>
              )}
              {stateCondition === 'melayang' && (
                <p>
                  Massa jenis benda tepat sama dengan massa jenis zat cair. Benda dapat diam melayang di posisi kedalaman manapun di dalam air tanpa menyentuh dasar.
                </p>
              )}
              {stateCondition === 'tenggelam' && (
                <p>
                  Massa jenis benda lebih rapat dari zat cair. Gaya apung maksimum fluida ({buoyantForce} N) tidak cukup menahan berat benda ({weightObject} N), sehingga benda tenggelam hingga bertumpu pada dasar tangki.
                </p>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Bottom Bar: Jump to Quiz or Submaterials */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Setelah mencoba simulasi, uji pemahamanmu dengan menjawab latihan soal.</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('materi')}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Baca Teori Modul
          </button>
          <button
            onClick={() => setCurrentPage('latihan')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            Mulai Latihan Soal
          </button>
        </div>
      </div>

    </div>
  );
};

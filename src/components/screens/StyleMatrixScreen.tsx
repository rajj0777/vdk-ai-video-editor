import React, { useState } from 'react';
import { STYLE_PRESETS } from '../../data/mockData';
import { Project } from '../../types';

interface StyleMatrixScreenProps {
  activeProject: Project;
  onApplyStyleToProject: (styleTitle: string, lut: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onNavigateToProjects: () => void;
}

export const StyleMatrixScreen: React.FC<StyleMatrixScreenProps> = ({
  activeProject,
  onApplyStyleToProject,
  onShowToast,
  onNavigateToProjects,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState(STYLE_PRESETS[0].id);
  const [grainIntensity, setGrainIntensity] = useState(15);
  const [halationBloom, setHalationBloom] = useState(24);
  const [shutterAngle, setShutterAngle] = useState(180);

  const selectedPreset =
    STYLE_PRESETS.find((p) => p.id === selectedPresetId) || STYLE_PRESETS[0];

  const handleApply = () => {
    onApplyStyleToProject(selectedPreset.name, selectedPreset.lut);
    onShowToast(`Style preset "${selectedPreset.name}" applied to ${activeProject.title}`, 'success');
    onNavigateToProjects();
  };

  return (
    <div className="w-full px-4 md:px-6 max-w-[1720px] mx-auto py-6 flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#4cd7f6] tracking-wider font-semibold">
            Color Science & Optical Grading
          </span>
          <span className="text-[#908fa0] text-[10px]">/</span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
            3D LUTs & Shutter Dynamics
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-[26px] md:text-[30px] font-semibold text-[#e1e1f1] tracking-tight">
          Style Matrix
        </h1>
        <p className="text-xs text-[#c7c4d7]">
          Calibrated optical looks engineered for high-cadence short-form video. Each preset applies
          matched color LUT, grain texture, and optical velocity curves.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Presets Grid */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {STYLE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`flex flex-col rounded-2xl bg-[#191b26] border cursor-pointer overflow-hidden transition-all shadow-lg hover:bg-[#1d1f2a] ${
                  isSelected
                    ? 'border-[#4cd7f6] ring-1 ring-[#4cd7f6]/50 shadow-[0_0_20px_rgba(76,215,246,0.15)]'
                    : 'border-[#272935]'
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#0b0e18]">
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0b0e18]/80 backdrop-blur font-mono text-[10px] text-[#4cd7f6] font-semibold border border-[#272935]">
                    {preset.tag}
                  </div>
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#4cd7f6] text-[#001f26] font-mono text-[10px] font-bold">
                      ACTIVE SELECTION
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[#e1e1f1]">{preset.name}</h3>
                    <span className="text-[11px] font-mono text-[#c0c1ff]">{preset.genre}</span>
                  </div>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">{preset.description}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#272935] text-[10px] font-mono text-[#908fa0]">
                    <div>
                      LUT: <span className="text-[#e1e1f1]">{preset.lut.split(' ')[0]}</span>
                    </div>
                    <div>
                      GRAIN: <span className="text-[#e1e1f1]">{preset.grain}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 4 cols: Parameter Fine-Tuning Cockpit */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-[#e1e1f1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">tune</span>
              Preset Inspector: {selectedPreset.name}
            </h3>

            {/* Grain Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#c7c4d7]">Kodak Vision3 Film Grain</span>
                <span className="text-[#4cd7f6]">{grainIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={grainIntensity}
                onChange={(e) => setGrainIntensity(Number(e.target.value))}
                className="w-full accent-[#4cd7f6]"
              />
            </div>

            {/* Halation Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#c7c4d7]">Spectral Halation Bloom</span>
                <span className="text-[#4cd7f6]">{halationBloom}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={halationBloom}
                onChange={(e) => setHalationBloom(Number(e.target.value))}
                className="w-full accent-[#4cd7f6]"
              />
            </div>

            {/* Shutter Angle Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#c7c4d7]">Cinematic Shutter Angle</span>
                <span className="text-[#4cd7f6]">{shutterAngle}°</span>
              </div>
              <input
                type="range"
                min="45"
                max="360"
                step="45"
                value={shutterAngle}
                onChange={(e) => setShutterAngle(Number(e.target.value))}
                className="w-full accent-[#4cd7f6]"
              />
            </div>

            <div className="pt-3 border-t border-[#272935] flex flex-col gap-2">
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#571bc1] to-[#8083ff] text-white font-semibold text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">brush</span>
                <span>Apply to Active Project</span>
              </button>
              <span className="text-[10px] font-mono text-[#908fa0] text-center">
                Target: {activeProject.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

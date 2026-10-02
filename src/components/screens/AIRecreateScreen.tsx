import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { Project } from '../../types';

interface AIRecreateScreenProps {
  onAddNewProject: (project: Project) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onNavigateToProjects: () => void;
}

export const AIRecreateScreen: React.FC<AIRecreateScreenProps> = ({
  onAddNewProject,
  onShowToast,
  onNavigateToProjects,
}) => {
  const [referenceUrl, setReferenceUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('speed-ramp');
  const [beatSyncLock, setBeatSyncLock] = useState(true);
  const [horizonLock, setHorizonLock] = useState(true);
  const [bpmDetection, setBpmDetection] = useState(132);
  const [lutProfile, setLutProfile] = useState('Teal & Orange Rec.709');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthStage, setSynthStage] = useState('');

  const handleLaunchSynthesis = () => {
    setIsSynthesizing(true);
    setSynthStage('Extracting audio cadence & peak frequency transients...');

    setTimeout(() => {
      setSynthStage('Computing optical velocity flow & speed ramp keyframes...');
    }, 1000);

    setTimeout(() => {
      setSynthStage('Synthesizing horizon lock & 3D camera re-projection...');
    }, 2000);

    setTimeout(() => {
      setSynthStage('Color balance & LUT spectral transfer complete. Lossless container ready.');
    }, 3000);

    setTimeout(() => {
      setIsSynthesizing(false);
      const newEdit: Project = {
        id: `EXP-${Math.floor(10000 + Math.random() * 90000)}-RECR`,
        title: referenceUrl.trim()
          ? `Viral Cadence Recreate - ${new URL(referenceUrl).hostname || 'Web'}`
          : 'Viral Tokyo Cadence - Neural Recreate',
        category: 'BEAT-SYNCED MASTER',
        duration: '00:22.10',
        durationSeconds: 22.1,
        createdAt: 'Just now',
        spec: `Recreated from viral audio cadence with ${bpmDetection} BPM lock, horizon stabilization, and ${lutProfile}.`,
        imageUrl: ASSETS.tokyoNeon,
        status: 'exported',
        aspectRatio: '9:16',
        resolution: '1080p',
        bpm: bpmDetection,
        gpuLatency: '7.8s total',
        fileSize: '41.2 MB',
        isFaceShielded: true,
      };

      onAddNewProject(newEdit);
      onShowToast('New neural recreate rendered and loaded into Flight-Deck!', 'success');
      onNavigateToProjects();
    }, 3800);
  };

  return (
    <div className="w-full px-4 md:px-6 max-w-[1720px] mx-auto py-6 flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#4cd7f6] tracking-wider font-semibold">
            Generative Core
          </span>
          <span className="text-[#908fa0] text-[10px]">/</span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
            Audio Cadence & Motion Ramp Sync
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-[26px] md:text-[30px] font-semibold text-[#e1e1f1] tracking-tight">
          AI Recreate & Edit
        </h1>
        <p className="text-xs text-[#c7c4d7]">
          Paste any viral reel or audio link. VDK reverse-engineers the speed ramps, cuts, and color
          profile into a master project.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Audio Cadence & Parameters */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          {/* Reference Input Card */}
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-[#e1e1f1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">link</span>
              Reference Audio & Video Source
            </h3>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="Paste Instagram Reel, TikTok, or YouTube Short URL..."
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11131e] border border-[#272935] text-xs text-[#e1e1f1] placeholder:text-[#908fa0] focus:outline-none focus:border-[#4cd7f6]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setReferenceUrl('https://instagram.com/reel/C8_Amalfi_SpeedSync_Master');
                  onShowToast('Sample viral reel URL populated', 'info');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#272935] hover:bg-[#373845] text-xs font-semibold text-[#e1e1f1] border border-[#373845] shrink-0"
              >
                Sample URL
              </button>
            </div>

            {/* Cadence Extractor Box */}
            <div className="p-4 rounded-xl bg-[#0b0e18] border border-[#272935] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#c7c4d7]">DETECTED CADENCE: HIGH TEMPO</span>
                <span className="text-[#4cd7f6] font-semibold">{bpmDetection} BPM (LOCKED)</span>
              </div>

              {/* Dynamic waveform representation */}
              <div className="w-full h-12 bg-[#11131e] rounded-lg p-2 border border-[#272935] flex items-center">
                <svg className="w-full h-full text-[#4cd7f6]" fill="none" viewBox="0 0 300 30">
                  <path
                    d="M0 15 L20 15 L25 4 L30 26 L35 8 L40 22 L45 15 L70 15 L75 2 L80 28 L85 6 L90 24 L95 15 L120 15 L125 5 L130 25 L135 10 L140 20 L145 15 L170 15 L175 1 L180 29 L185 4 L190 26 L195 15 L220 15 L225 6 L230 24 L235 12 L240 18 L245 15 L270 15 L275 3 L280 27 L285 7 L290 23 L295 15 L300 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#908fa0]">
                <span>00:00 Intro Drop</span>
                <span>00:08 Beat Spike</span>
                <span>00:15 Climax Velocity</span>
                <span>00:22 Outro S-Curve</span>
              </div>
            </div>
          </div>

          {/* Speed Ramp Motion Curves */}
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-[#e1e1f1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">show_chart</span>
              Optical Speed-Ramp Curves
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'speed-ramp', name: 'Exponential Beat Ramp', desc: 'Accelerates into kick drum' },
                { id: 'stutter', name: 'Snap Stutter & Freeze', desc: 'Micro freeze-frame pulse' },
                { id: 'fluid', name: 'Anamorphic Float', desc: 'Ultra-smooth cinematic drift' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedStyle === style.id
                      ? 'border-[#c0c1ff] bg-[#272935] text-[#e1e1f1]'
                      : 'border-[#272935] bg-[#11131e] text-[#c7c4d7]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#e1e1f1]">{style.name}</div>
                  <div className="text-[10px] text-[#908fa0] mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#11131e] border border-[#272935] cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#e1e1f1]">Beat Sync Lock</span>
                  <span className="text-[10px] text-[#c7c4d7]">Snaps keyframes to audio kicks</span>
                </div>
                <input
                  type="checkbox"
                  checked={beatSyncLock}
                  onChange={(e) => setBeatSyncLock(e.target.checked)}
                  className="rounded text-[#4cd7f6]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#11131e] border border-[#272935] cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#e1e1f1]">Horizon Gyroscope</span>
                  <span className="text-[10px] text-[#c7c4d7]">Locks level horizon automatically</span>
                </div>
                <input
                  type="checkbox"
                  checked={horizonLock}
                  onChange={(e) => setHorizonLock(e.target.checked)}
                  className="rounded text-[#4cd7f6]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Style LUT & Master Synthesis Trigger */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-[#e1e1f1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#acedff] text-[20px]">palette</span>
              Color Spectral LUT Match
            </h3>

            <div className="flex flex-col gap-2">
              {[
                { name: 'Teal & Orange Rec.709', tone: 'Warm Mediterranean Skin + Deep Cyan' },
                { name: 'Blade Runner Rec.2020', tone: 'Neon Cyan & Vermilion Highlights' },
                { name: 'Tri-X 400 Haute Noir', tone: 'Monochrome High-Contrast Silver' },
                { name: 'Nordic Bleach Bypass', tone: 'Cold Ocean Mist Slate' },
              ].map((lut) => (
                <div
                  key={lut.name}
                  onClick={() => setLutProfile(lut.name)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    lutProfile === lut.name
                      ? 'border-[#4cd7f6] bg-[#272935]'
                      : 'border-[#272935] bg-[#11131e] hover:bg-[#1d1f2a]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#e1e1f1]">{lut.name}</span>
                    <span className="text-[10px] text-[#c7c4d7]">{lut.tone}</span>
                  </div>
                  {lutProfile === lut.name && (
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                      check
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Synthesize CTA */}
            <div className="pt-3 border-t border-[#272935] flex flex-col gap-2">
              {isSynthesizing ? (
                <div className="p-4 rounded-xl bg-[#0b0e18] border border-[#4cd7f6] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4cd7f6] animate-spin text-[20px]">
                      sync
                    </span>
                    <span className="text-xs font-semibold text-[#4cd7f6]">
                      GPU Render in Progress...
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#c7c4d7]">{synthStage}</span>
                  <div className="w-full h-1 bg-[#272935] rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] animate-pulse w-4/5 rounded-full"></div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchSynthesis}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#001f26] font-semibold text-sm shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                  <span>Synthesize Neural Recreate Edit</span>
                </button>
              )}
              <span className="text-[10px] font-mono text-[#908fa0] text-center">
                100% Free Export • Zero Render Queues • Lossless H.265 Master
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

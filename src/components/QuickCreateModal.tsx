import React, { useState } from 'react';
import { AspectRatio, Project, Resolution } from '../types';
import { ASSETS } from '../data/mockData';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProject: Project) => void;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState<'url' | 'preset' | 'upload'>('preset');
  const [selectedAsset, setSelectedAsset] = useState<string>(ASSETS.tokyoNeon);
  const [modelEngine, setModelEngine] = useState('vdk-v3.4-speed');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState('');

  const samplePresets = [
    { name: 'Tokyo Neon Cyber Walk', url: ASSETS.tokyoNeon, bpm: 130, cat: 'TOKYO NEON CINEMATIC' },
    { name: 'Paris Studio Runway', url: ASSETS.parisFashion, bpm: 115, cat: 'EDITORIAL FASHION 9:16' },
    { name: 'Amalfi Coast Speed-Sync', url: ASSETS.amalfi, bpm: 128, cat: 'NEURAL RECREATE V3' },
    { name: 'Iceland Volcanic Sands', url: ASSETS.icelandMoody, bpm: 88, cat: 'ICELAND MOODY VLOG' },
  ];

  const handleGenerate = () => {
    setIsProcessing(true);
    setProgressStep('Analyzing audio cadence and BPM drop markers...');

    setTimeout(() => {
      setProgressStep('Extracting optical flow velocity vectors...');
    }, 800);

    setTimeout(() => {
      setProgressStep('Applying neural horizon stabilization and LUT balancing...');
    }, 1600);

    setTimeout(() => {
      setProgressStep('Encoding lossless NVENC H.265 master container...');
    }, 2400);

    setTimeout(() => {
      setIsProcessing(false);
      const chosenSample = samplePresets.find((s) => s.url === selectedAsset) || samplePresets[0];
      const newProj: Project = {
        id: `EXP-${Math.floor(10000 + Math.random() * 90000)}-${modelEngine.slice(0, 4).toUpperCase()}`,
        title: title.trim() || `${chosenSample.name} - Neural Recreate`,
        category: chosenSample.cat,
        duration: '00:21.50',
        durationSeconds: 21.5,
        createdAt: 'Just now',
        spec: `Neural recreate rendered via ${modelEngine}. Beat-synced cadence with zero watermark and lossless container.`,
        imageUrl: selectedAsset,
        status: 'exported',
        aspectRatio,
        resolution,
        bpm: chosenSample.bpm,
        gpuLatency: '6.4s total',
        fileSize: resolution === '4k' ? '128 MB' : resolution === '1080p' ? '42.8 MB' : '14 MB',
        isFaceShielded: true,
      };

      onCreateProject(newProj);
      onClose();
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#191b26] border border-[#272935] shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#272935]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[24px]">auto_awesome</span>
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e1f1]">
                Quick Create: Neural Recreate & Speed-Sync
              </h3>
              <p className="text-[11px] font-mono text-[#c7c4d7]">
                Generate broadcast-ready edits with AI cadence matching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#272935]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="py-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Edit Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-[#c7c4d7] uppercase">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Cyber Runner Speed-Ramp (Leave empty for auto-name)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#11131e] border border-[#272935] text-xs text-[#e1e1f1] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          {/* Reference Footage Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[#c7c4d7] uppercase">
              Reference Visual Inspiration
            </label>
            <div className="grid grid-cols-2 gap-2">
              {samplePresets.map((sample) => (
                <div
                  key={sample.name}
                  onClick={() => setSelectedAsset(sample.url)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                    selectedAsset === sample.url
                      ? 'border-[#4cd7f6] bg-[#272935]'
                      : 'border-[#272935] bg-[#11131e] hover:bg-[#1d1f2a]'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#e1e1f1] truncate">
                      {sample.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#4cd7f6]">
                      {sample.bpm} BPM Cadence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neural Model Engine */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#c7c4d7] uppercase">Neural Engine</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'vdk-v3.4-speed', label: 'VDK v3.4 Speed-Sync', desc: 'Auto BPM Ramp' },
                { id: 'vdk-lut-master', label: 'Spectral Matcher', desc: 'Teal/Orange LUT' },
                { id: 'vdk-horizon-flow', label: 'Horizon Gyro Lock', desc: 'Steadicam Flow' },
              ].map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => setModelEngine(engine.id)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    modelEngine === engine.id
                      ? 'border-[#c0c1ff] bg-[#272935] text-[#e1e1f1]'
                      : 'border-[#272935] bg-[#11131e] text-[#c7c4d7]'
                  }`}
                >
                  <div className="font-semibold">{engine.label}</div>
                  <div className="text-[10px] text-[#908fa0]">{engine.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect & Resolution */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-[#c7c4d7] uppercase">Framing</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['9:16', '16:9'] as AspectRatio[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    className={`py-1.5 text-xs font-mono rounded-lg border ${
                      aspectRatio === r
                        ? 'border-[#4cd7f6] bg-[#272935] text-[#4cd7f6]'
                        : 'border-[#272935] bg-[#11131e] text-[#c7c4d7]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-[#c7c4d7] uppercase">Quality</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['1080p', '4k'] as Resolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-1.5 text-xs font-mono rounded-lg border ${
                      resolution === res
                        ? 'border-[#c0c1ff] bg-[#272935] text-[#c0c1ff]'
                        : 'border-[#272935] bg-[#11131e] text-[#c7c4d7]'
                    }`}
                  >
                    {res.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Processing state indicator */}
          {isProcessing && (
            <div className="p-3 rounded-xl bg-[#0b0e18] border border-[#4cd7f6]/40 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4cd7f6] animate-spin text-[22px]">
                progress_activity
              </span>
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-[#4cd7f6]">Synthesizing Neural Render</span>
                <span className="text-[11px] text-[#c7c4d7] font-mono">{progressStep}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#272935]">
          <span className="text-[11px] font-mono text-[#4cd7f6] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6]"></span>
            Unlimited GPU Compute Available
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#272935] text-[#c7c4d7] hover:bg-[#373845]"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#001f26] hover:brightness-110 shadow-lg cursor-pointer"
            >
              {isProcessing ? 'Rendering...' : 'Synthesize Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

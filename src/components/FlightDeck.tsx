import React, { useState, useEffect, useRef } from 'react';
import { Project, Resolution, AspectRatio, PlatformPreset } from '../types';

interface FlightDeckProps {
  project: Project;
  onOpenShareModal: (platform: 'instagram' | 'tiktok' | 'youtube' | 'whatsapp') => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onUpdateProject: (updated: Partial<Project>) => void;
}

export const FlightDeck: React.FC<FlightDeckProps> = ({
  project,
  onOpenShareModal,
  onShowToast,
  onUpdateProject,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(18.24);
  const [resolution, setResolution] = useState<Resolution>(project.resolution || '1080p');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspectRatio || '9:16');
  const [activePlatform, setActivePlatform] = useState<PlatformPreset>('instagram-reel');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const duration = project.durationSeconds || 18.24;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0;
          }
          return Math.min(duration, prev + 0.1);
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const getFileSizeByResolution = (res: Resolution) => {
    switch (res) {
      case '720p':
        return '14.0 MB';
      case '1080p':
        return '42.8 MB';
      case '4k':
        return '128.0 MB';
    }
  };

  const handleCopyLink = () => {
    const fakeUrl = `https://vdk.studio/v/${project.id.toLowerCase()}`;
    navigator.clipboard?.writeText?.(fakeUrl);
    setIsCopied(true);
    onShowToast('Encrypted cloud link copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(10);
    onShowToast(`Packaging lossless ${resolution.toUpperCase()} MP4 container...`, 'info');

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          onShowToast(`Lossless render (${getFileSizeByResolution(resolution)}) downloaded!`, 'success');
          // Trigger actual file download simulation
          const element = document.createElement('a');
          const file = new Blob([`VDK Studio Master Render: ${project.title}`], {
            type: 'text/plain',
          });
          element.href = URL.createObjectURL(file);
          element.download = `${project.title.replace(/\s+/g, '_')}_${resolution}.mp4`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    onUpdateProject({ aspectRatio: ratio });
    onShowToast(`Viewport reframed to ${ratio}`, 'info');
  };

  const handleResolutionChange = (res: Resolution) => {
    setResolution(res);
    onUpdateProject({ resolution: res, fileSize: getFileSizeByResolution(res) });
    onShowToast(`Render target switched to ${res.toUpperCase()}`, 'info');
  };

  // Get preview aspect ratio classes
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[580px] max-w-[326px]';
      case '16:9':
        return 'aspect-video max-h-[460px] max-w-full';
      case '1:1':
        return 'aspect-square max-h-[460px] max-w-[460px]';
      case '4:5':
        return 'aspect-[4/5] max-h-[520px] max-w-[416px]';
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#191b26]/90 backdrop-blur-2xl p-4 md:p-6 lg:p-8 shadow-2xl border border-[#272935] overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8083ff]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#009eb9]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left column: Rendered Output Showcase & Stream Specs */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          <div
            className={`relative rounded-xl overflow-hidden ${getAspectRatioClasses()} w-full mx-auto bg-[#0b0e18] shadow-2xl group border border-[#272935] transition-all duration-300`}
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Video Stage Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e18] via-transparent to-[#0b0e18]/40 pointer-events-none"></div>

            {/* Top HUD status */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b0e18]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] font-semibold tracking-wide border border-[#4cd7f6]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                READY FOR BROADCAST
              </span>
              <span className="px-2 py-0.5 rounded bg-[#272935]/90 backdrop-blur font-['JetBrains_Mono'] text-[12px] text-[#e1e1f1] font-semibold border border-[#373845]">
                {formatTime(currentTime)}
              </span>
            </div>

            {/* Central interactive Play/Pause HUD button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-10">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play rendered edit'}
                className="h-14 w-14 rounded-full bg-[#c0c1ff]/20 backdrop-blur-md hover:bg-[#c0c1ff]/40 text-[#e1e1f1] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xl border border-[#c0c1ff]/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[32px] text-[#e1e0ff]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Bottom HUD details with real-time waveform sparkline */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 pointer-events-auto z-10">
              {/* Timeline scrubber bar */}
              <div
                className="w-full h-1.5 bg-[#272935]/80 hover:h-2.5 rounded-full cursor-pointer transition-all overflow-hidden relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  setCurrentTime(ratio * duration);
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px]">
                <span>AUDIO SPEED-MATCH: DUAL STEREO</span>
                <span className="text-[#4cd7f6] font-semibold">{project.bpm || 128} BPM LOCK</span>
              </div>

              {/* Dynamic waveform SVG with wave oscillation animation when playing */}
              <div className="w-full h-7 flex items-center overflow-hidden">
                <svg
                  className={`w-full h-7 text-[#c0c1ff]/70 transition-opacity ${
                    isPlaying ? 'opacity-100 animate-pulse' : 'opacity-70'
                  }`}
                  fill="none"
                  viewBox="0 0 200 24"
                >
                  <path
                    d={
                      isPlaying
                        ? 'M0 12 L10 12 L15 2 L20 22 L25 5 L30 19 L35 12 L45 12 L50 1 L55 23 L60 6 L65 18 L70 12 L85 12 L90 2 L95 22 L100 4 L105 20 L110 12 L125 12 L130 0 L135 24 L140 5 L145 19 L150 12 L165 12 L170 3 L175 21 L180 6 L185 18 L190 12 L200 12'
                        : 'M0 12 L10 12 L15 3 L20 21 L25 7 L30 17 L35 12 L45 12 L50 2 L55 22 L60 8 L65 16 L70 12 L85 12 L90 4 L95 20 L100 6 L105 18 L110 12 L125 12 L130 1 L135 23 L140 7 L145 17 L150 12 L165 12 L170 5 L175 19 L180 8 L185 16 L190 12 L200 12'
                    }
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Live Export Telemetry Banner */}
          <div className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-[#1d1f2a] border border-[#272935] font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">bolt</span>
              GPU Latency:{' '}
              <span className="text-[#e1e1f1] font-semibold">{project.gpuLatency || '8.4s total'}</span>
            </span>
            <span className="text-[#908fa0]">•</span>
            <span>H.265 Main 10 NVENC</span>
            <span className="text-[#908fa0]">•</span>
            <span className="text-[#d0bcff] font-semibold">{getFileSizeByResolution(resolution)}</span>
          </div>
        </div>

        {/* Right column: Master Export Controls, Format Switches, and Direct Share */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          {/* Title & Badges */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded bg-[#571bc1]/30 text-[#d0bcff] font-['JetBrains_Mono'] text-[10px] font-semibold border border-[#571bc1]/50">
                {project.category || 'NEURAL RECREATE V3'}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#009eb9]/30 text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] font-semibold border border-[#009eb9]/50">
                BEAT-SYNCED MASTER
              </span>
              <span className="px-2 py-0.5 rounded bg-[#272935] text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px] border border-[#373845]">
                ID: {project.id}
              </span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-[24px] sm:text-[30px] font-semibold tracking-tight text-[#e1e1f1] leading-tight mt-1">
              {project.title}
            </h2>

            <p className="font-['Geist'] text-[13px] text-[#c7c4d7] leading-relaxed">
              {project.spec}
            </p>
          </div>

          {/* Value Proposition Callout Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#272935] via-[#1d1f2a] to-[#272935] gap-2 border border-[#373845] shadow-md">
            <div className="flex items-center gap-2.5">
              <span
                className="material-symbols-outlined text-[#4cd7f6] text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <div className="flex flex-col">
                <span className="font-['Geist'] text-[14px] text-[#e1e1f1] font-semibold tracking-wide">
                  GUARANTEED NO WATERMARK
                </span>
                <span className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                  100% Free Export • GPU Render Finished in 8.4s Lossless
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] font-bold self-start sm:self-auto uppercase tracking-wider border border-[#4cd7f6]/30">
              Zero Queues
            </span>
          </div>

          {/* Parameter Selectors Group */}
          <div className="flex flex-col gap-4">
            {/* Resolution Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#c7c4d7] font-medium tracking-wider">
                  Export Resolution
                </label>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] font-semibold">
                  Native Upscale Ready
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleResolutionChange('720p')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all text-center cursor-pointer border ${
                    resolution === '720p'
                      ? 'bg-[#373845] text-[#e1e1f1] ring-1 ring-[#c0c1ff]/50 border-[#c0c1ff]/50 shadow-md'
                      : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                  }`}
                >
                  <span className="font-['Geist'] text-[14px] font-semibold text-[#e1e1f1]">
                    720p
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                    Fast Web (14 MB)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolutionChange('1080p')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all text-center cursor-pointer border ${
                    resolution === '1080p'
                      ? 'bg-[#373845] text-[#e1e1f1] ring-1 ring-[#c0c1ff]/50 border-[#c0c1ff]/50 shadow-md'
                      : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                  }`}
                >
                  <span className="font-['Geist'] text-[14px] text-[#e1e1f1] font-semibold flex items-center gap-1">
                    1080p Full HD
                    <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                      star
                    </span>
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#c0c1ff] font-medium">
                    Recommended (42.8 MB)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolutionChange('4k')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all text-center cursor-pointer border ${
                    resolution === '4k'
                      ? 'bg-[#373845] text-[#e1e1f1] ring-1 ring-[#c0c1ff]/50 border-[#c0c1ff]/50 shadow-md'
                      : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                  }`}
                >
                  <span className="font-['Geist'] text-[14px] font-semibold text-[#e1e1f1]">
                    4K Ultra HD
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#d0bcff] font-medium">
                    Pro Studio (128 MB)
                  </span>
                </button>
              </div>
            </div>

            {/* Aspect Ratio Framing Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#c7c4d7] font-medium tracking-wider">
                Aspect Ratio Framing
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleAspectRatioChange('9:16')}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left cursor-pointer transition-all border ${
                    aspectRatio === '9:16'
                      ? 'bg-[#373845] text-[#e1e1f1] border-[#c0c1ff]/40 shadow-sm'
                      : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                  }`}
                >
                  <span className="w-3.5 h-6 rounded-xs bg-[#c0c1ff]/30 shrink-0 border border-[#c0c1ff]/40"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#e1e1f1] truncate">
                      9:16
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#c0c1ff] truncate">
                      Reels & TikTok
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAspectRatioChange('16:9')}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left cursor-pointer transition-all border ${
                    aspectRatio === '16:9'
                      ? 'bg-[#373845] text-[#e1e1f1] border-[#c0c1ff]/40 shadow-sm'
                      : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                  }`}
                >
                  <span className="w-6 h-3.5 rounded-xs bg-[#323440] shrink-0 border border-[#464554]"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#e1e1f1] truncate">
                      16:9
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] truncate">
                      YouTube Standard
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAspectRatioChange('1:1')}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left cursor-pointer transition-all border ${
                    aspectRatio === '1:1'
                      ? 'bg-[#373845] text-[#e1e1f1] border-[#c0c1ff]/40 shadow-sm'
                      : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                  }`}
                >
                  <span className="w-4.5 h-4.5 rounded-xs bg-[#323440] shrink-0 border border-[#464554]"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#e1e1f1] truncate">
                      1:1
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] truncate">
                      Square Feed
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAspectRatioChange('4:5')}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left cursor-pointer transition-all border ${
                    aspectRatio === '4:5'
                      ? 'bg-[#373845] text-[#e1e1f1] border-[#c0c1ff]/40 shadow-sm'
                      : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                  }`}
                >
                  <span className="w-4 h-5 rounded-xs bg-[#323440] shrink-0 border border-[#464554]"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#e1e1f1] truncate">
                      4:5
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] truncate">
                      Portrait Feed
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Direct Platform Bitrate Target presets */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#c7c4d7] font-medium tracking-wider">
                Direct Platform Bitrate Target
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'instagram-reel', label: 'Instagram Reel', icon: 'auto_videocam' },
                  { id: 'tiktok', label: 'TikTok', icon: null },
                  { id: 'youtube-short', label: 'YouTube Short', icon: null },
                  { id: 'youtube-4k', label: 'YouTube 4K Cinema', icon: null },
                  { id: 'instagram-post', label: 'Instagram Post', icon: null },
                ].map((item) => {
                  const isActive = activePlatform === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActivePlatform(item.id as PlatformPreset);
                        onShowToast(`Optimized encoder preset: ${item.label}`, 'info');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-[11px] flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#373845] text-[#c0c1ff] border-[#c0c1ff]/40 shadow-sm'
                          : 'bg-[#1d1f2a] hover:bg-[#272935] text-[#c7c4d7] border-[#272935]'
                      }`}
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined text-[14px]">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DIRECT SOCIAL SHARING PIPELINE ACTIONS */}
          <div className="flex flex-col gap-2 pt-1 border-t border-[#272935]">
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#c7c4d7] font-medium tracking-wider">
              Broadcast & Distribution
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* Instagram Reel Direct API */}
              <button
                type="button"
                onClick={() => onOpenShareModal('instagram')}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#571bc1] to-[#8083ff] text-[#e1e0ff] font-['Geist'] text-[13px] font-semibold shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer text-left border border-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">movie_filter</span>
                <div className="flex flex-col leading-tight">
                  <span>Share to Instagram</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#e1e0ff]/80">
                    Official Direct API
                  </span>
                </div>
              </button>

              {/* TikTok Direct API */}
              <button
                type="button"
                onClick={() => onOpenShareModal('tiktok')}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-['Geist'] text-[13px] font-semibold shadow-md transition-all cursor-pointer text-left border border-[#373845]"
              >
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                  play_circle
                </span>
                <div className="flex flex-col leading-tight">
                  <span>Share to TikTok</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    Ready to Publish
                  </span>
                </div>
              </button>

              {/* YouTube Shorts */}
              <button
                type="button"
                onClick={() => onOpenShareModal('youtube')}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-['Geist'] text-[13px] font-semibold shadow-md transition-all cursor-pointer text-left border border-[#373845]"
              >
                <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">
                  video_library
                </span>
                <div className="flex flex-col leading-tight">
                  <span>YouTube Shorts</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    Scheduled / Draft
                  </span>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => onOpenShareModal('whatsapp')}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-['Geist'] text-[13px] font-semibold shadow-md transition-all cursor-pointer text-left border border-[#373845]"
              >
                <span className="material-symbols-outlined text-[#acedff] text-[20px]">chat</span>
                <div className="flex flex-col leading-tight">
                  <span>Share via WhatsApp</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    Quick HD Send
                  </span>
                </div>
              </button>

              {/* Direct Cloud Link Copy */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-['Geist'] text-[13px] font-semibold shadow-md transition-all cursor-pointer text-left border border-[#373845] ${
                  isCopied ? 'ring-1 ring-[#4cd7f6] text-[#4cd7f6]' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">
                  {isCopied ? 'check' : 'link'}
                </span>
                <div className="flex flex-col leading-tight">
                  <span>{isCopied ? 'Link Copied!' : 'Copy Direct Link'}</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    Encrypted Cloud URL
                  </span>
                </div>
              </button>

              {/* Lossless MP4 Download Trigger */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="relative overflow-hidden flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#323440] hover:bg-[#373845] text-[#e1e1f1] font-['Geist'] text-[13px] font-semibold shadow-md transition-all cursor-pointer text-left border border-[#464554]"
              >
                {isDownloading && (
                  <div
                    className="absolute inset-0 bg-[#4cd7f6]/20 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                )}
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px] relative z-10">
                  {isDownloading ? 'hourglass_top' : 'download'}
                </span>
                <div className="flex flex-col leading-tight relative z-10">
                  <span>{isDownloading ? `Exporting (${downloadProgress}%)` : 'Download MP4'}</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#4cd7f6] font-semibold">
                    Lossless ({getFileSizeByResolution(resolution)})
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

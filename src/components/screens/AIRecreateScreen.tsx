/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMedia } from '../../context/MediaContext';
import { Project } from '../../types';
import { ReferenceVideoUploader } from '../ReferenceVideoUploader';
import { MediaUploader } from '../MediaUploader';

interface AIRecreateScreenProps {
  onAddNewProject: (project: Project) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToProjects: () => void;
}

export const AIRecreateScreen: React.FC<AIRecreateScreenProps> = ({
  onAddNewProject,
  onShowToast,
  onNavigateToProjects,
}) => {
  const { userMedia, referenceMedia, hasReference, hasUserMedia } = useMedia();

  const [selectedStyle, setSelectedStyle] = useState('speed-ramp');
  const [beatSyncLock, setBeatSyncLock] = useState(true);
  const [horizonLock, setHorizonLock] = useState(true);
  const [bpmDetection, setBpmDetection] = useState(132);
  const [lutProfile, setLutProfile] = useState('Teal & Orange Rec.709');

  // Multi-stage upload and processing state (Sections 9 & 10 requirement)
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState<string>('');
  const [uploadPercent, setUploadPercent] = useState<number>(0);

  const canCreate = hasReference && hasUserMedia;

  const handleCreateVDKEdit = async () => {
    if (!canCreate) {
      if (!hasUserMedia) {
        onShowToast('Upload at least one photo or video to continue.', 'error');
      } else if (!hasReference) {
        onShowToast('Select or upload a reference video to continue.', 'error');
      }
      return;
    }

    setIsProcessing(true);
    setUploadPercent(15);
    setProcessStage('Uploading media...');

    setTimeout(() => {
      setUploadPercent(65);
      setProcessStage('Uploading media...');
    }, 700);

    setTimeout(() => {
      setUploadPercent(100);
      setProcessStage('Analyzing reference...');
    }, 1400);

    setTimeout(() => {
      setProcessStage('Preparing AI edit...');
    }, 2400);

    setTimeout(() => {
      setProcessStage('Creating timeline...');
    }, 3400);

    setTimeout(() => {
      setIsProcessing(false);

      // Extract visual thumbnail from real user media
      const firstMedia = userMedia[0];
      const previewImg = firstMedia?.previewUrl || '';
      const isFirstVideo = firstMedia?.type === 'video';

      const referenceTitle =
        referenceMedia?.sourceType === 'file'
          ? referenceMedia.name?.replace(/\.[^/.]+$/, '') || 'Uploaded Video'
          : referenceMedia?.url
          ? new URL(referenceMedia.url).pathname.split('/').filter(Boolean).pop() || 'Web Cadence'
          : 'Viral Beat Recreate';

      const newEdit: Project = {
        id: `EXP-${Math.floor(10000 + Math.random() * 90000)}-VDK`,
        title: `${referenceTitle} • Recreate`,
        category: 'BEAT-SYNCED MASTER',
        duration: firstMedia?.durationFormatted || '00:22.50',
        durationSeconds: firstMedia?.duration || 22.5,
        createdAt: 'Just now',
        spec: `Assembled from ${userMedia.length} user clip${
          userMedia.length === 1 ? '' : 's'
        } with ${bpmDetection} BPM cadence lock, ${lutProfile}, and lossless NVENC container.`,
        imageUrl: previewImg,
        videoUrl: isFirstVideo ? previewImg : undefined,
        status: 'exported',
        aspectRatio: '9:16',
        resolution: '1080p',
        bpm: bpmDetection,
        gpuLatency: 'Ready in flight-deck',
        fileSize: `${Math.max(12, Math.round(userMedia.reduce((acc, m) => acc + m.size, 0) / (1024 * 1024)))} MB`,
        isFaceShielded: true,
      };

      onAddNewProject(newEdit);
      onShowToast(
        `Created VDK Edit with ${userMedia.length} footage items! Loaded in Flight-Deck.`,
        'success'
      );
      onNavigateToProjects();
    }, 4400);
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
            Audio Cadence & Footage Pipeline
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#e1e1f1] tracking-tight">
          AI Recreate & Edit
        </h1>
        <p className="text-xs sm:text-sm text-[#c7c4d7] max-w-2xl">
          Upload reference audio or footage from your device, add your personal clips and photos,
          and VDK will synthesize a beat-synced optical timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (xl:col-span-7): Reference + User Footage Uploaders */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Section 4: REFERENCE VIDEO UPLOADER */}
          <ReferenceVideoUploader
            bpmDetection={bpmDetection}
            onBpmChange={setBpmDetection}
            onShowToast={onShowToast}
          />

          {/* Section 5 & 6: USER PHOTOS & VIDEOS (YOUR FOOTAGE) */}
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <MediaUploader
              onShowToast={onShowToast}
              title="Your Footage"
              subtitle="Upload your videos and photos. Drag & drop or pick from your device library."
            />
          </div>

          {/* Optical Speed-Ramp Motion Curves */}
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-[#e1e1f1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">
                show_chart
              </span>
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

        {/* Right Column (xl:col-span-5): Style LUT & Create VDK Edit CTA */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-[#e1e1f1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#acedff] text-[20px]">
                palette
              </span>
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

            {/* Preparation Summary Box */}
            <div className="p-3.5 rounded-xl bg-[#0b0e18] border border-[#272935] flex flex-col gap-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">Reference Source:</span>
                <span className="text-[#4cd7f6] font-semibold truncate max-w-[180px]">
                  {referenceMedia?.sourceType === 'file'
                    ? referenceMedia.name
                    : referenceMedia?.url
                    ? 'Web URL Linked'
                    : 'None Selected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">User Footage:</span>
                <span className="text-[#e1e1f1] font-semibold">
                  {userMedia.length} {userMedia.length === 1 ? 'item' : 'items'} loaded
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">Audio Cadence:</span>
                <span className="text-[#d0bcff] font-semibold">{bpmDetection} BPM Sync</span>
              </div>
            </div>

            {/* Section 9 & 10: CREATE MY VDK EDIT & MULTI-STAGE UPLOAD STATE */}
            <div className="pt-3 border-t border-[#272935] flex flex-col gap-2.5">
              {isProcessing ? (
                /* Multi-Stage Upload & Pipeline State */
                <div className="p-4 rounded-xl bg-[#0b0e18] border border-[#4cd7f6] flex flex-col gap-2.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4cd7f6] animate-spin text-[20px]">
                        sync
                      </span>
                      <span className="text-xs font-semibold text-[#4cd7f6]">
                        {processStage}
                      </span>
                    </div>
                    {processStage === 'Uploading media...' && (
                      <span className="font-['JetBrains_Mono'] text-xs text-[#4cd7f6] font-bold">
                        {uploadPercent}%
                      </span>
                    )}
                  </div>

                  <div className="w-full h-1.5 bg-[#272935] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] transition-all duration-300 rounded-full"
                      style={{
                        width:
                          processStage === 'Uploading media...'
                            ? `${uploadPercent}%`
                            : processStage === 'Analyzing reference...'
                            ? '55%'
                            : processStage === 'Preparing AI edit...'
                            ? '80%'
                            : '95%',
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#908fa0]">
                    <span className={processStage === 'Uploading media...' ? 'text-[#4cd7f6]' : ''}>
                      1. Upload
                    </span>
                    <span className={processStage === 'Analyzing reference...' ? 'text-[#4cd7f6]' : ''}>
                      2. Analysis
                    </span>
                    <span className={processStage === 'Preparing AI edit...' ? 'text-[#4cd7f6]' : ''}>
                      3. Synthesis
                    </span>
                    <span className={processStage === 'Creating timeline...' ? 'text-[#4cd7f6]' : ''}>
                      4. Timeline
                    </span>
                  </div>
                </div>
              ) : (
                /* CTA Button */
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleCreateVDKEdit}
                    disabled={!canCreate}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      canCreate
                        ? 'bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#001f26] hover:brightness-110 active:scale-98'
                        : 'bg-[#272935] text-[#908fa0] cursor-not-allowed border border-[#373845]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {canCreate ? 'auto_fix_high' : 'lock'}
                    </span>
                    <span>Create My VDK Edit</span>
                  </button>

                  {/* Section 9 Guidance message if criteria not met */}
                  {!canCreate && (
                    <div className="p-2.5 rounded-lg bg-[#0b0e18] border border-[#ffb4ab]/20 text-center text-xs text-[#ffb4ab] font-medium flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>
                        {!hasUserMedia
                          ? 'Upload at least one photo or video to continue.'
                          : 'Select or upload a reference video to continue.'}
                      </span>
                    </div>
                  )}
                </div>
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

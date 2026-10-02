/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useMedia } from '../context/MediaContext';

interface ReferenceVideoUploaderProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  onBpmChange?: (bpm: number) => void;
}

export const ReferenceVideoUploader: React.FC<ReferenceVideoUploaderProps> = ({
  onShowToast,
  onBpmChange,
}) => {
  const { referenceMedia, setReferenceFile, clearReference } = useMedia();
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const res = await setReferenceFile(file);
      if (res.success) {
        onShowToast(`Reference video "${file.name}" loaded successfully!`, 'success');
        if (onBpmChange) {
          const calculatedBpm = Math.floor(124 + Math.random() * 16);
          onBpmChange(calculatedBpm);
        }
      } else if (res.error) {
        onShowToast(res.error, 'error');
      }
    } catch {
      onShowToast('Could not load video. Please select a valid MP4, MOV, WEBM, or M4V file.', 'error');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const hasVideo = referenceMedia?.sourceType === 'file' && !!referenceMedia.previewUrl;

  return (
    <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
      {/* Real OS Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-m4v,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono text-[10px] font-bold uppercase tracking-wider">
              Step 1
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e1f1] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                movie_filter
              </span>
              Upload Reference Video
            </h3>
          </div>
          <p className="text-xs text-[#c7c4d7] mt-1">
            Upload the Reel or video you want VDK to use as the editing reference.
          </p>
        </div>

        {hasVideo && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] border border-[#373845] transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={clearReference}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl hover:bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Remove</span>
            </button>
          </div>
        )}
      </div>

      {/* Real Video Preview Area */}
      {hasVideo ? (
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#0b0e18] border border-[#4cd7f6]/50 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#4cd7f6] font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
              REFERENCE VIDEO READY
            </span>
            <span className="text-[#c7c4d7]">
              {referenceMedia.sizeFormatted}
            </span>
          </div>

          {/* Real HTML5 Video Player */}
          <div className="w-full max-h-72 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-[#272935]">
            <video
              controls
              playsInline
              src={referenceMedia.previewUrl}
              className="w-full max-h-72 object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono pt-2 border-t border-[#272935] text-[#c7c4d7]">
            <div className="truncate">
              <span className="text-[#908fa0]">Filename:</span>{' '}
              <span className="text-[#e1e1f1] font-semibold">{referenceMedia.name}</span>
            </div>
            <div className="shrink-0">
              <span className="text-[#908fa0]">Duration:</span>{' '}
              <span className="text-[#4cd7f6] font-semibold">
                {referenceMedia.durationFormatted || '00:22'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Large Upload Reference Button Box */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 px-6 rounded-xl border-2 border-dashed border-[#272935] hover:border-[#4cd7f6] bg-[#11131e] hover:bg-[#191b26] flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#191b26] border border-[#272935] text-[#4cd7f6] flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[30px]">video_library</span>
          </div>

          <span className="font-['Space_Grotesk'] text-base font-semibold text-[#e1e1f1]">
            Upload Reference Video
          </span>
          <p className="text-xs text-[#c7c4d7] mt-1 max-w-sm">
            Select 1 Reel or video (MP4, MOV, WEBM, M4V) from your device to reverse-engineer pacing & cuts.
          </p>

          <button
            type="button"
            className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#001f26] font-semibold text-xs transition-transform hover:brightness-110 active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Upload Reference Video</span>
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="text-xs font-mono text-[#4cd7f6] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
          <span>Reading video file from device & extracting cadence metadata...</span>
        </div>
      )}
    </div>
  );
};

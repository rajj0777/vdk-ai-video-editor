/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useCallback } from 'react';
import { useMedia } from '../context/MediaContext';
import { MediaItem } from '../types';

interface MediaUploaderProps {
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
  title?: string;
  subtitle?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onShowToast,
  title = 'Upload your videos and photos',
  subtitle = 'Select footage from your device or drag & drop. Supports MP4, MOV, WEBM, JPG, PNG, WEBP, and HEIC.',
}) => {
  const { userMedia, addFiles, removeFile } = useMedia();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [activePreviewItem, setActivePreviewItem] = useState<MediaItem | null>(null);

  // Hidden native file input refs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const anyMediaInputRef = useRef<HTMLInputElement>(null);
  const cameraPhotoInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoInputRef = useRef<HTMLInputElement>(null);

  // Handle incoming file list
  const handleProcessFiles = useCallback(
    async (fileList: FileList | File[] | null) => {
      if (!fileList || fileList.length === 0) return;

      setIsProcessingFiles(true);
      try {
        const { addedCount, errors } = await addFiles(fileList);

        if (errors.length > 0) {
          errors.forEach((err) => {
            if (onShowToast) onShowToast(err, 'error');
          });
        }

        if (addedCount > 0) {
          if (onShowToast) {
            onShowToast(
              `Added ${addedCount} ${addedCount === 1 ? 'file' : 'files'} to your footage library.`,
              'success'
            );
          }
        }
      } catch (err) {
        if (onShowToast) {
          onShowToast('Could not process selected files. Please try again.', 'error');
        }
      } finally {
        setIsProcessingFiles(false);
      }
    },
    [addFiles, onShowToast]
  );

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Hidden real native file inputs for OS file pickers */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-m4v,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleProcessFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />

      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleProcessFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />

      <input
        ref={anyMediaInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleProcessFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />

      {/* Mobile camera capture inputs */}
      <input
        ref={cameraPhotoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleProcessFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />

      <input
        ref={cameraVideoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleProcessFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />

      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-['Space_Grotesk'] text-[18px] sm:text-[20px] font-semibold text-[#e1e1f1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              video_library
            </span>
            {title}
          </h3>
          <p className="text-xs text-[#c7c4d7] mt-0.5">{subtitle}</p>
        </div>

        {/* Desktop upload action buttons */}
        <div className="hidden sm:flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-[#373845]"
          >
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">videocam</span>
            <span>+ Add Videos</span>
          </button>

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-[#373845]"
          >
            <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">photo_camera</span>
            <span>+ Add Photos</span>
          </button>

          <button
            type="button"
            onClick={() => anyMediaInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#8083ff]/30 to-[#4cd7f6]/30 hover:from-[#8083ff]/40 hover:to-[#4cd7f6]/40 text-[#e1e1f1] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-[#4cd7f6]/40 shadow-sm"
          >
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">upload</span>
            <span>+ Add Media</span>
          </button>
        </div>
      </div>

      {/* Mobile-optimized action buttons */}
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => cameraPhotoInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-[#191b26] hover:bg-[#272935] text-[#e1e1f1] text-[11px] font-medium border border-[#272935] flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">photo_camera</span>
          <span>Take Photo</span>
        </button>

        <button
          type="button"
          onClick={() => cameraVideoInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-[#191b26] hover:bg-[#272935] text-[#e1e1f1] text-[11px] font-medium border border-[#272935] flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">videocam</span>
          <span>Record Video</span>
        </button>

        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-[#191b26] hover:bg-[#272935] text-[#e1e1f1] text-[11px] font-medium border border-[#272935] flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">image</span>
          <span>Choose Photos</span>
        </button>

        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-[#191b26] hover:bg-[#272935] text-[#e1e1f1] text-[11px] font-medium border border-[#272935] flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#acedff] text-[20px]">movie</span>
          <span>Choose Videos</span>
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => anyMediaInputRef.current?.click()}
        className={`relative w-full rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
          isDragging
            ? 'border-[#4cd7f6] bg-[#4cd7f6]/10 scale-[1.01] shadow-[0_0_24px_rgba(76,215,246,0.25)]'
            : 'border-[#272935] bg-[#11131e]/80 hover:bg-[#191b26] hover:border-[#4cd7f6]/50'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#191b26] border border-[#272935] flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform">
          <span
            className={`material-symbols-outlined text-[32px] transition-colors ${
              isDragging ? 'text-[#4cd7f6]' : 'text-[#c0c1ff]'
            }`}
          >
            {isDragging ? 'download' : 'cloud_upload'}
          </span>
        </div>

        <h4 className="font-['Space_Grotesk'] text-base sm:text-lg font-semibold text-[#e1e1f1]">
          {isDragging ? 'Drop your photos and videos right here' : 'Drag & drop your photos and videos here'}
        </h4>

        <p className="text-xs text-[#c7c4d7] mt-1 max-w-md">
          Or click to browse from device. Supports <span className="text-[#e1e1f1] font-mono">MP4, MOV, WEBM, JPG, PNG, WEBP</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="px-2.5 py-1 rounded-full bg-[#191b26] text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px] border border-[#272935]">
            Up to 500MB per video
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#191b26] text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] border border-[#272935]">
            Zero compression on import
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#191b26] text-[#c0c1ff] font-['JetBrains_Mono'] text-[10px] border border-[#272935]">
            Multi-file batch selection
          </span>
        </div>

        {isProcessingFiles && (
          <div className="absolute inset-0 bg-[#0b0e18]/85 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-[#4cd7f6] z-20">
            <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
            <span>Validating & processing media files...</span>
          </div>
        )}
      </div>

      {/* Selected Media Grid (Section 5 requirement) */}
      {userMedia.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] text-[16px] font-semibold text-[#e1e1f1]">
                Selected Footage
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#272935] text-[#4cd7f6] font-['JetBrains_Mono'] text-[11px] font-bold border border-[#373845]">
                {userMedia.length} {userMedia.length === 1 ? 'file' : 'files'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => anyMediaInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-[#272935] hover:bg-[#373845] text-[#4cd7f6] font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1 cursor-pointer border border-[#373845]"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>+ Add More</span>
              </button>
            </div>
          </div>

          {/* Media Grid: Responsive cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {userMedia.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl bg-[#191b26] border border-[#272935] overflow-hidden flex flex-col shadow-md hover:border-[#4cd7f6]/60 transition-all"
              >
                {/* Visual Thumbnail */}
                <div
                  className="relative aspect-square w-full bg-[#0b0e18] overflow-hidden cursor-pointer"
                  onClick={() => setActivePreviewItem(item)}
                  title="Click to view full preview"
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.previewUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Overlay Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e18]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none"></div>

                  {/* Indicator Badge: PHOTO / VIDEO */}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`px-1.5 py-0.5 rounded backdrop-blur font-['JetBrains_Mono'] text-[9px] font-bold tracking-wider uppercase border ${
                        item.type === 'video'
                          ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/40'
                          : 'bg-[#c0c1ff]/20 text-[#c0c1ff] border-[#c0c1ff]/40'
                      }`}
                    >
                      {item.type === 'video' ? 'VIDEO ▶' : 'PHOTO'}
                    </span>
                  </div>

                  {/* Video Duration (if available) */}
                  {item.type === 'video' && item.durationFormatted && (
                    <div className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur font-['JetBrains_Mono'] text-[10px] text-[#e1e1f1] border border-white/10">
                      {item.durationFormatted}
                    </div>
                  )}

                  {/* Hover play / inspect icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <span className="w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.type === 'video' ? 'play_arrow' : 'zoom_in'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Card metadata & Remove button */}
                <div className="p-2 flex items-center justify-between gap-1.5 bg-[#191b26]">
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-xs font-medium text-[#e1e1f1] truncate"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#908fa0]">
                      {item.sizeFormatted}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                      if (onShowToast) onShowToast(`Removed "${item.name}"`, 'info');
                    }}
                    className="p-1 rounded-lg text-[#c7c4d7] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer shrink-0"
                    title="Remove from footage"
                    aria-label={`Remove ${item.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Quick Add More Tile */}
            <div
              onClick={() => anyMediaInputRef.current?.click()}
              className="aspect-square rounded-xl border border-dashed border-[#272935] hover:border-[#4cd7f6] bg-[#11131e]/50 hover:bg-[#191b26] flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-[#272935] group-hover:bg-[#4cd7f6]/20 text-[#c7c4d7] group-hover:text-[#4cd7f6] flex items-center justify-center mb-1.5 transition-colors">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </div>
              <span className="text-xs font-semibold text-[#e1e1f1] group-hover:text-[#4cd7f6] transition-colors">
                + Add More
              </span>
              <span className="text-[10px] font-mono text-[#908fa0] mt-0.5">Photos & Videos</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal for user inspection (Section 8 requirement) */}
      {activePreviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#191b26] border border-[#272935] shadow-2xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#272935]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono text-[10px] font-bold uppercase">
                  {activePreviewItem.type}
                </span>
                <span className="text-sm font-semibold text-[#e1e1f1] truncate">
                  {activePreviewItem.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewItem(null)}
                className="p-1 rounded-lg text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#272935] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="w-full max-h-[60vh] bg-[#0b0e18] rounded-xl overflow-hidden flex items-center justify-center">
              {activePreviewItem.type === 'video' ? (
                <video
                  controls
                  autoPlay
                  src={activePreviewItem.previewUrl}
                  className="w-full max-h-[60vh] object-contain"
                />
              ) : (
                <img
                  src={activePreviewItem.previewUrl}
                  alt={activePreviewItem.name}
                  className="w-full max-h-[60vh] object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#c7c4d7] pt-2">
              <span>Size: {activePreviewItem.sizeFormatted}</span>
              {activePreviewItem.durationFormatted && (
                <span>Duration: {activePreviewItem.durationFormatted}</span>
              )}
              <button
                type="button"
                onClick={() => {
                  removeFile(activePreviewItem.id);
                  setActivePreviewItem(null);
                  if (onShowToast) onShowToast(`Removed "${activePreviewItem.name}"`, 'info');
                }}
                className="text-[#ffb4ab] hover:underline flex items-center gap-1 cursor-pointer font-sans"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Remove this file</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

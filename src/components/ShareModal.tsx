import React, { useState } from 'react';
import { Project } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'whatsapp';
  project: Project;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  platform,
  project,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [caption, setCaption] = useState(
    `${project.title} • Synced with VDK Engine v3.4 #Cinematic #SpeedSync #Lossless`
  );
  const [isPosting, setIsPosting] = useState(false);
  const [includeAudioTag, setIncludeAudioTag] = useState(true);

  const getPlatformDetails = () => {
    switch (platform) {
      case 'instagram':
        return {
          title: 'Share to Instagram Reel',
          badge: 'Meta Graph API v19.0',
          icon: 'movie_filter',
          color: 'from-[#571bc1] to-[#8083ff]',
          btnText: 'Publish Direct to Reel',
        };
      case 'tiktok':
        return {
          title: 'Publish to TikTok',
          badge: 'TikTok Direct Post API',
          icon: 'play_circle',
          color: 'from-[#009eb9] to-[#4cd7f6]',
          btnText: 'Publish to TikTok Feed',
        };
      case 'youtube':
        return {
          title: 'Upload to YouTube Shorts',
          badge: 'YouTube Data API v3',
          icon: 'video_library',
          color: 'from-[#93000a] to-[#ffb4ab]',
          btnText: 'Upload as Short Draft',
        };
      case 'whatsapp':
        return {
          title: 'Send via WhatsApp HD',
          badge: 'WhatsApp Cloud Relay',
          icon: 'chat',
          color: 'from-[#004e5c] to-[#acedff]',
          btnText: 'Generate HD Share Link',
        };
    }
  };

  const details = getPlatformDetails();

  const handlePublish = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      onSuccess(`Broadcast complete! Edit synced with ${details.title}.`);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#191b26] border border-[#272935] shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#272935]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-r ${details.color} flex items-center justify-center text-white shadow-md`}
            >
              <span className="material-symbols-outlined text-[20px]">{details.icon}</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-[#e1e1f1]">{details.title}</h3>
              <span className="font-mono text-[10px] text-[#4cd7f6]">{details.badge}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#272935] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="py-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0e18] border border-[#272935]">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-16 h-20 object-cover rounded-lg border border-[#272935] shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm text-[#e1e1f1] truncate">{project.title}</span>
              <span className="font-mono text-xs text-[#c7c4d7] mt-0.5">
                {project.duration} • Lossless {project.resolution?.toUpperCase() || '1080P'} • {project.bpm || 128} BPM
              </span>
              <span className="text-[11px] text-[#4cd7f6] font-mono mt-1">
                Zero Watermark • HDR Metadata Attached
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase text-[#c7c4d7]">Caption & Hashtags</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#11131e] border border-[#272935] text-[#e1e1f1] focus:outline-none focus:border-[#4cd7f6] resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#11131e] border border-[#272935] cursor-pointer">
            <input
              type="checkbox"
              checked={includeAudioTag}
              onChange={(e) => setIncludeAudioTag(e.target.checked)}
              className="rounded text-[#4cd7f6] focus:ring-0"
            />
            <div className="flex flex-col text-xs text-[#e1e1f1]">
              <span className="font-medium">Attach Original Audio Stem Track</span>
              <span className="text-[10px] text-[#c7c4d7]">
                Locks viral audio cadence for maximum platform algorithmic reach
              </span>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#272935]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#272935] hover:bg-[#373845] text-[#c7c4d7]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPosting}
            onClick={handlePublish}
            className={`px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r ${details.color} text-white shadow-lg hover:brightness-110 flex items-center gap-1.5`}
          >
            {isPosting && (
              <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
            )}
            <span>{isPosting ? 'Broadcasting...' : details.btnText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

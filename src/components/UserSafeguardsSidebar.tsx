import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';

interface UserSafeguardsSidebarProps {
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onOpenFaceShield: () => void;
}

export const UserSafeguardsSidebar: React.FC<UserSafeguardsSidebarProps> = ({
  onShowToast,
  onOpenFaceShield,
}) => {
  const [isPurging, setIsPurging] = useState(false);
  const [isPurged, setIsPurged] = useState(false);

  const handleWipeStorage = () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete all uploaded raw video clips from cloud edge storage? (Your rendered exports will remain safe and intact)'
    );
    if (!confirmed) return;

    setIsPurging(true);
    onShowToast('Initiating zero-knowledge storage purge...', 'info');

    setTimeout(() => {
      setIsPurging(false);
      setIsPurged(true);
      onShowToast('Edge cache storage purged losslessly. 0 bytes retained.', 'success');

      setTimeout(() => {
        setIsPurged(false);
      }, 4000);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Creator Identity Dock */}
      <div className="flex flex-col p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              alt="Alex Rivera Profile Avatar"
              className="w-16 h-16 rounded-xl object-cover shadow-md ring-1 ring-[#373845]"
              src={ASSETS.avatar}
            />
            <span
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#4cd7f6] border-2 border-[#191b26] flex items-center justify-center"
              title="Online & Synced"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#0b0e18]"></span>
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-['Space_Grotesk'] text-[18px] font-semibold text-[#e1e1f1] truncate">
                Alex Rivera
              </h3>
              <span
                className="material-symbols-outlined text-[16px] text-[#4cd7f6]"
                title="Verified Creator"
              >
                verified
              </span>
            </div>
            <span className="font-['Geist'] text-[13px] text-[#c7c4d7] truncate">
              Director & Cinematographer
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#d0bcff] mt-0.5 font-medium">
              Pro Free Tier • Unlimited AI Edits
            </span>
          </div>
        </div>

        {/* Quota metrics bar */}
        <div className="flex flex-col gap-1.5 mt-4 pt-3.5 bg-[#0b0e18]/60 p-3 rounded-xl border border-[#272935]/80">
          <div className="flex justify-between items-center text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px]">
            <span>CLOUD NEURAL COMPUTE</span>
            <span className="text-[#4cd7f6] font-bold">UNLIMITED FREE TIER</span>
          </div>
          <div className="w-full h-1.5 bg-[#272935] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] w-3/4 rounded-full"></div>
          </div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] text-right">
            0 of ∞ credits consumed
          </span>
        </div>

        {/* Auth Status Line */}
        <div className="flex items-center justify-between mt-3.5 pt-1 text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px]">
          <span className="flex items-center gap-1 text-[#e1e1f1]">
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">lock</span>
            Google OAuth & Phone verified
          </span>
          <span className="text-[#4cd7f6] font-semibold">2FA ACTIVE</span>
        </div>
      </div>

      {/* Privacy & Identity Safeguards Cockpit */}
      <div className="flex flex-col p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl gap-3.5">
        <div className="flex items-center justify-between">
          <div
            onClick={onOpenFaceShield}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px] group-hover:scale-110 transition-transform">
              shield
            </span>
            <h4 className="font-['Geist'] text-[14px] font-semibold text-[#e1e1f1] group-hover:text-[#4cd7f6] transition-colors">
              Face & ID Shield
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] font-bold uppercase border border-[#4cd7f6]/30">
            Encrypted
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Safeguard Point 1 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#1d1f2a] border border-[#272935]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] shrink-0 mt-0.5">
              face_retouching_natural
            </span>
            <div className="flex flex-col">
              <span className="font-['Geist'] text-[13px] text-[#e1e1f1] font-semibold leading-tight">
                Biometric Protection
              </span>
              <span className="font-['Geist'] text-[11px] text-[#c7c4d7] mt-1 leading-normal">
                Zero biometric coordinates or facial embeddings stored on training servers. All
                source frames ephemeral.
              </span>
            </div>
          </div>

          {/* Safeguard Point 2 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#1d1f2a] border border-[#272935]">
            <span className="material-symbols-outlined text-[#d0bcff] text-[18px] shrink-0 mt-0.5">
              policy
            </span>
            <div className="flex flex-col">
              <span className="font-['Geist'] text-[13px] text-[#e1e1f1] font-semibold leading-tight">
                Absolute Data Sovereignty
              </span>
              <span className="font-['Geist'] text-[11px] text-[#c7c4d7] mt-1 leading-normal">
                Your media belongs entirely to you. Exports do not require attribution and carry
                commercial rights.
              </span>
            </div>
          </div>
        </div>

        {/* 1-Click Complete Cloud Wipe Triggers */}
        <div className="flex flex-col gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleWipeStorage}
            disabled={isPurging}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-all cursor-pointer border ${
              isPurged
                ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/40'
                : isPurging
                ? 'bg-[#272935] text-[#c7c4d7] border-[#373845]'
                : 'bg-[#272935] hover:bg-[#ffb4ab]/20 hover:text-[#ffb4ab] text-[#e1e1f1] border-[#373845] hover:border-[#ffb4ab]/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPurged ? 'check_circle' : isPurging ? 'hourglass_bottom' : 'delete_forever'}
            </span>
            <span>
              {isPurged
                ? 'Storage Purged Losslessly'
                : isPurging
                ? 'Purging Edge Cache...'
                : '1-Click Delete All Uploaded Clips'}
            </span>
          </button>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] text-center">
            Instantly purges raw video binaries from edge cache storage
          </span>
        </div>
      </div>
    </div>
  );
};

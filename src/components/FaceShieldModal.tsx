import React, { useState } from 'react';

interface FaceShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const FaceShieldModal: React.FC<FaceShieldModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [biometricShield, setBiometricShield] = useState(true);
  const [ephemeralStorage, setEphemeralStorage] = useState(true);
  const [watermarkStripping, setWatermarkStripping] = useState(true);
  const [commercialLicense, setCommercialLicense] = useState(true);

  const handleSave = () => {
    onShowToast('Face & ID Shield security protocols updated and encrypted.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#191b26] border border-[#272935] shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#272935]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[24px]">shield</span>
            <div>
              <h3 className="text-lg font-semibold text-[#e1e1f1]">Face & ID Shield Cockpit</h3>
              <p className="text-[11px] font-mono text-[#4cd7f6]">ISO 27001 Certified Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#272935]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-4 flex flex-col gap-3">
          {/* Item 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#11131e] border border-[#272935]">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-semibold text-[#e1e1f1]">
                Zero-Biometric Coordinate Policy
              </span>
              <span className="text-[11px] text-[#c7c4d7]">
                Never passes human facial landmarks or embeddings to persistent neural training weights.
              </span>
            </div>
            <button
              onClick={() => setBiometricShield(!biometricShield)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                biometricShield ? 'bg-[#4cd7f6]' : 'bg-[#373845]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0b0e18] absolute top-0.5 transition-transform ${
                  biometricShield ? 'left-5.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#11131e] border border-[#272935]">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-semibold text-[#e1e1f1]">
                Ephemeral Edge Cache Purge
              </span>
              <span className="text-[11px] text-[#c7c4d7]">
                Automatically purges decoded raw media frames after neural rendering completes.
              </span>
            </div>
            <button
              onClick={() => setEphemeralStorage(!ephemeralStorage)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                ephemeralStorage ? 'bg-[#4cd7f6]' : 'bg-[#373845]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0b0e18] absolute top-0.5 transition-transform ${
                  ephemeralStorage ? 'left-5.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Item 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#11131e] border border-[#272935]">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-semibold text-[#e1e1f1]">
                100% Watermark-Free Export Rights
              </span>
              <span className="text-[11px] text-[#c7c4d7]">
                Guaranteed zero digital watermarks or branding burnt into visual pixels.
              </span>
            </div>
            <button
              onClick={() => setWatermarkStripping(!watermarkStripping)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                watermarkStripping ? 'bg-[#4cd7f6]' : 'bg-[#373845]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0b0e18] absolute top-0.5 transition-transform ${
                  watermarkStripping ? 'left-5.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Item 4 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#11131e] border border-[#272935]">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-semibold text-[#e1e1f1]">
                Commercial Broadcast License
              </span>
              <span className="text-[11px] text-[#c7c4d7]">
                Full commercial rights granted with zero royalty obligations or mandatory attribution.
              </span>
            </div>
            <button
              onClick={() => setCommercialLicense(!commercialLicense)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                commercialLicense ? 'bg-[#4cd7f6]' : 'bg-[#373845]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0b0e18] absolute top-0.5 transition-transform ${
                  commercialLicense ? 'left-5.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#272935]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#272935] text-[#c7c4d7]"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#4cd7f6] text-[#001f26] hover:brightness-110"
          >
            Save Protection Rules
          </button>
        </div>
      </div>
    </div>
  );
};

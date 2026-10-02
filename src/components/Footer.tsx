import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0b0e18] border-t border-[#1d1f2a] py-8 mt-12">
      <div className="w-full px-4 md:px-6 max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-['Space_Grotesk'] text-[20px] font-semibold tracking-tight text-[#e1e1f1]">
            VDK
          </span>
          <span className="font-['Geist'] text-[11px] text-[#c7c4d7]">
            © 2025 Cinematic Neural Systems Inc. All rights reserved.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase tracking-wider">
            Zero Render Queues
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase tracking-wider">
            Lossless Neural Export
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase tracking-wider">
            ISO 27001 Identity Safeguard
          </span>
        </div>
      </div>
    </footer>
  );
};

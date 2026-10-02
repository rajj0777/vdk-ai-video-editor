import React, { useState } from 'react';
import { NavScreen } from '../types';
import { ASSETS } from '../data/mockData';

interface HeaderProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onOpenQuickCreate: () => void;
  onOpenFaceShield: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenQuickCreate,
  onOpenFaceShield,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavScreen; label: string }[] = [
    { id: 'studio-home', label: 'Studio Home' },
    { id: 'ai-recreate-and-edit', label: 'AI Recreate & Edit' },
    { id: 'style-matrix', label: 'Style Matrix' },
    { id: 'my-projects', label: 'My Projects' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0b0e18]/90 backdrop-blur-xl border-b border-[#1d1f2a] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 w-full px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Brand + Desktop Navigation */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <div
              onClick={() => onNavigate('my-projects')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <img
                alt="VDK Studio Brand Logo"
                className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src={ASSETS.logo}
              />
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[18px] sm:text-[20px] font-semibold tracking-tight text-[#e1e1f1] leading-none">
                  VDK
                </span>
                <span className="hidden sm:inline-block font-['JetBrains_Mono'] text-[9px] sm:text-[10px] text-[#c7c4d7] tracking-wider uppercase mt-0.5">
                  Create edits. Not timelines.
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#0b0e18] rounded-xl border border-[#1d1f2a]">
              {navItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3.5 py-1.5 rounded-lg transition-all text-[13px] font-medium whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#272935] text-[#e1e1f1] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                        : 'text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#191b26]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center: Engine Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#191b26] border border-[#272935]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd7f6]"></span>
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#c7c4d7] font-semibold">
              VDK Engine v3.4
            </span>
            <span className="text-[#908fa0] text-[10px]">•</span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] tracking-wide uppercase font-medium">
              GPU Accelerated
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Create CTA */}
            <button
              onClick={onOpenQuickCreate}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#272935] hover:bg-[#373845] active:scale-95 text-[#e1e1f1] transition-all font-semibold text-xs sm:text-[13px] border border-[#373845] shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add</span>
              <span className="hidden xs:inline sm:inline whitespace-nowrap">Quick Create</span>
              <span className="inline xs:hidden sm:hidden">Create</span>
            </button>

            {/* Tokens & Credits */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#191b26] border border-[#272935]">
              <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">token</span>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] uppercase">
                  Tokens & Credits
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#d0bcff] font-medium whitespace-nowrap">
                  Unlimited Free Tier
                </span>
              </div>
            </div>

            {/* Face & ID Shield indicator */}
            <button
              onClick={onOpenFaceShield}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#191b26] hover:bg-[#272935] transition-colors border border-[#272935] cursor-pointer"
              title="Biometric Protection & Face Shield"
            >
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                verified_user
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] uppercase">
                  Face & ID Shield
                </span>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6]"></span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] font-bold">
                    ON
                  </span>
                </div>
              </div>
            </button>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-0.5 sm:gap-1 pl-1 py-1 rounded-lg hover:bg-[#191b26] transition-colors cursor-pointer"
                aria-label="Creator Profile Menu"
              >
                <img
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-[#373845]"
                  src={ASSETS.avatar}
                />
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#c7c4d7]">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] rounded-xl bg-[#1d1f2a] border border-[#272935] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3 border-b border-[#272935] flex items-center gap-3">
                    <img
                      alt="Alex Rivera"
                      className="w-10 h-10 rounded-full object-cover"
                      src={ASSETS.avatar}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-semibold text-[#e1e1f1] truncate">
                        Alex Rivera
                      </span>
                      <span className="text-[11px] text-[#c7c4d7] truncate">
                        Director & Cinematographer
                      </span>
                      <span className="text-[10px] text-[#4cd7f6] font-mono">
                        Pro Free Tier • 2FA Active
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('my-projects');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#e1e1f1] hover:bg-[#272935] rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">folder</span>
                      My Projects & Renders
                    </button>
                    <button
                      onClick={() => {
                        onOpenFaceShield();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#e1e1f1] hover:bg-[#272935] rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#d0bcff]">shield</span>
                      Privacy & Biometric Guard
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('style-matrix');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#e1e1f1] hover:bg-[#272935] rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">tune</span>
                      LUT & Style Presets
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#272935]">
                    <div className="px-3 py-2 text-[11px] font-mono text-[#908fa0] flex justify-between">
                      <span>Compute Credits</span>
                      <span className="text-[#4cd7f6] font-semibold">Unlimited</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Drawer Toggle (Secondary) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-lg bg-[#191b26] text-[#e1e1f1] cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#11131e] border-b border-[#272935] px-4 py-3 flex flex-col gap-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === item.id
                    ? 'bg-[#272935] text-[#e1e1f1] border border-[#373845]'
                    : 'text-[#c7c4d7] hover:bg-[#191b26]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#272935] flex items-center justify-between text-xs font-mono text-[#c7c4d7]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                VDK Engine v3.4
              </span>
              <span className="text-[#4cd7f6] font-semibold">GPU Accelerated</span>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar for Instant Thumb Access */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0e18]/95 backdrop-blur-xl border-t border-[#1d1f2a] px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.5)]">
        {[
          { id: 'studio-home' as NavScreen, label: 'Home', icon: 'home' },
          { id: 'ai-recreate-and-edit' as NavScreen, label: 'AI Recreate', icon: 'auto_fix_high' },
          { id: 'style-matrix' as NavScreen, label: 'Styles', icon: 'palette' },
          { id: 'my-projects' as NavScreen, label: 'Projects', icon: 'folder' },
        ].map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#4cd7f6] font-semibold scale-105'
                  : 'text-[#c7c4d7] hover:text-[#e1e1f1]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

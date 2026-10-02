import React from 'react';
import { NavScreen, Project } from '../../types';
import { ASSETS } from '../../data/mockData';

interface StudioHomeScreenProps {
  onNavigate: (screen: NavScreen) => void;
  onOpenQuickCreate: () => void;
  recentProjects: Project[];
  onSelectProject: (p: Project) => void;
}

export const StudioHomeScreen: React.FC<StudioHomeScreenProps> = ({
  onNavigate,
  onOpenQuickCreate,
  recentProjects,
  onSelectProject,
}) => {
  return (
    <div className="w-full px-4 md:px-6 max-w-[1720px] mx-auto py-6 flex flex-col gap-8">
      {/* Hero Welcome banner */}
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#191b26] via-[#1d1f2a] to-[#191b26] border border-[#272935] p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono text-[10px] font-bold uppercase border border-[#4cd7f6]/30">
                VDK ENGINE v3.4 ONLINE
              </span>
              <span className="text-[#908fa0] text-xs">•</span>
              <span className="font-mono text-xs text-[#c7c4d7]">Lossless Neural Pipeline</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-[28px] md:text-[36px] font-semibold text-[#e1e1f1] tracking-tight leading-tight">
              Create Edits. Not Timelines.
            </h1>
            <p className="text-sm text-[#c7c4d7] leading-relaxed">
              Welcome back, Alex Rivera. VDK synchronizes optical flow, viral audio transients, and
              high-cadence speed ramping directly into broadcast-ready masters with zero render queues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuickCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#001f26] font-semibold text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Quick Create Edit</span>
            </button>
            <button
              onClick={() => onNavigate('my-projects')}
              className="px-4 py-2.5 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-semibold text-xs border border-[#373845] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">folder</span>
              <span>Open My Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Quick Launch Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => onNavigate('ai-recreate-and-edit')}
          className="p-5 rounded-2xl bg-[#191b26] hover:bg-[#1d1f2a] border border-[#272935] hover:border-[#4cd7f6]/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#009eb9]/20 flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[22px]">auto_fix_high</span>
            </div>
            <span className="material-symbols-outlined text-[#908fa0] group-hover:text-[#4cd7f6] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#e1e1f1] group-hover:text-[#4cd7f6] transition-colors">
              AI Recreate & Edit
            </h3>
            <p className="text-xs text-[#c7c4d7] mt-1">
              Extract viral cadence, auto-generate beat-synced optical speed ramping and LUT grade.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => onNavigate('style-matrix')}
          className="p-5 rounded-2xl bg-[#191b26] hover:bg-[#1d1f2a] border border-[#272935] hover:border-[#c0c1ff]/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#571bc1]/20 flex items-center justify-center text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[22px]">palette</span>
            </div>
            <span className="material-symbols-outlined text-[#908fa0] group-hover:text-[#c0c1ff] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#e1e1f1] group-hover:text-[#c0c1ff] transition-colors">
              Style Matrix
            </h3>
            <p className="text-xs text-[#c7c4d7] mt-1">
              Browse cinematic color science looks, 35mm grain simulations, and anamorphic flare profiles.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => onNavigate('my-projects')}
          className="p-5 rounded-2xl bg-[#191b26] hover:bg-[#1d1f2a] border border-[#272935] hover:border-[#acedff]/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#272935] flex items-center justify-center text-[#acedff]">
              <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
            </div>
            <span className="material-symbols-outlined text-[#908fa0] group-hover:text-[#acedff] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#e1e1f1] group-hover:text-[#acedff] transition-colors">
              Broadcast Distribution
            </h3>
            <p className="text-xs text-[#c7c4d7] mt-1">
              Direct official API integration for Instagram Reels, TikTok, and YouTube Shorts.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Renders Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e1f1]">
            Recent High-Cadence Renders
          </h3>
          <button
            onClick={() => onNavigate('my-projects')}
            className="text-xs font-mono text-[#4cd7f6] hover:underline"
          >
            View all 14 projects →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProjects.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectProject(p);
                onNavigate('my-projects');
              }}
              className="flex flex-col rounded-xl bg-[#191b26] border border-[#272935] overflow-hidden hover:border-[#4cd7f6]/40 cursor-pointer transition-all group"
            >
              <div className="relative aspect-video w-full bg-[#0b0e18] overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0b0e18]/80 text-[10px] font-mono text-[#e1e1f1]">
                  {p.duration}
                </span>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <span className="font-semibold text-xs text-[#e1e1f1] truncate">{p.title}</span>
                <span className="text-[10px] text-[#c7c4d7]">{p.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPU Cluster Status */}
      <div className="p-4 rounded-xl bg-[#191b26] border border-[#272935] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono text-[#c7c4d7]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
          <span className="text-[#e1e1f1] font-semibold">Cluster Node: APAC-Singapore-GPU-8</span>
          <span className="text-[#908fa0]">•</span>
          <span>NVENC Main 10 Lossless Mode</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Queued Tasks: 0</span>
          <span className="text-[#4cd7f6]">Active Compute Latency: 8.4ms</span>
        </div>
      </div>
    </div>
  );
};

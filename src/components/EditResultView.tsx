/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AIEditingPlan, MediaItem, Project, ReferenceMedia, TimelineClip } from '../types';
import { modifyEditingPlan } from '../services/aiEditingEngine';

interface EditResultViewProps {
  initialPlan: AIEditingPlan;
  allUserMedia: MediaItem[];
  referenceMedia: ReferenceMedia;
  onSaveProject: (project: Project) => void;
  onMakeAnotherEdit: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const EditResultView: React.FC<EditResultViewProps> = ({
  initialPlan,
  allUserMedia,
  referenceMedia,
  onSaveProject,
  onMakeAnotherEdit,
  onShowToast,
}) => {
  const [plan, setPlan] = useState<AIEditingPlan>(initialPlan);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: `I've analyzed your reference video "${referenceMedia.name || 'Reel'}" and ${allUserMedia.length} clips. ${initialPlan.summary} You can ask me to change the pacing, add slow motion, use more photos, or adjust styling anytime!`,
      time: 'Just now',
    },
  ]);

  const activeClip: TimelineClip | undefined = plan.clips[activeClipIndex] || plan.clips[0];

  // Sequence playback simulation across timeline clips
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isPlaying && plan.clips.length > 0) {
      const curClip = plan.clips[activeClipIndex];
      const durationMs = Math.max(800, (curClip?.duration || 1.5) * 1000);

      timer = setTimeout(() => {
        setActiveClipIndex((prev) => (prev + 1) % plan.clips.length);
      }, durationMs);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, activeClipIndex, plan.clips]);

  // Quick prompt suggestions requested by user
  const quickPrompts = [
    'Make it more cinematic',
    'Use more photos',
    'Use all my videos',
    'Make it faster',
    'Add slow motion',
    'Make it 15 seconds',
    'Make it like the reference',
    'Use less text',
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: promptText, time };
    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      const { updatedPlan, aiResponse } = modifyEditingPlan(plan, allUserMedia, promptText);
      setPlan(updatedPlan);
      setActiveClipIndex(0);
      setIsAiThinking(false);

      const aiMsg = { sender: 'ai' as const, text: aiResponse, time };
      setChatMessages((prev) => [...prev, aiMsg]);
      onShowToast('VDK AI updated your edit plan!', 'success');
    }, 600);
  };

  const handleToggleUseAllMedia = () => {
    const nextState = !plan.useAllMedia;
    handleSendPrompt(nextState ? 'Use all my videos and photos' : 'Pick the strongest moments');
  };

  const handleSaveToPipeline = () => {
    const firstClipMedia = plan.clips[0]?.media;
    const isVideo = firstClipMedia?.type === 'video';

    const newProject: Project = {
      id: `EXP-${Math.floor(10000 + Math.random() * 90000)}-AI`,
      title: plan.title,
      category: 'AI MASTER EDIT',
      duration: `00:${Math.round(plan.totalDuration).toString().padStart(2, '0')}.00`,
      durationSeconds: plan.totalDuration,
      createdAt: 'Just now',
      spec: `${plan.clips.length} cuts • ${plan.styleName} • ${plan.bpm} BPM sync • ${plan.summary}`,
      imageUrl: firstClipMedia?.previewUrl || '',
      videoUrl: isVideo ? firstClipMedia?.previewUrl : undefined,
      status: 'exported',
      aspectRatio: plan.aspectRatio,
      resolution: '1080p',
      bpm: plan.bpm,
      gpuLatency: 'Synthesized in browser',
      fileSize: `${Math.round(allUserMedia.reduce((acc, m) => acc + m.size, 0) / (1024 * 1024)) || 32} MB`,
      isFaceShielded: true,
    };

    onSaveProject(newProject);
    onShowToast(`"${plan.title}" saved and loaded into Flight-Deck!`, 'success');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header bar with Status & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#191b26] p-4 sm:p-5 rounded-2xl border border-[#272935] shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#4cd7f6]/30">
              VDK AI Edit Result
            </span>
            <span className="text-[#908fa0] text-xs">•</span>
            <span className="font-mono text-xs text-[#c7c4d7]">
              {plan.clips.length} Cuts ({plan.totalDuration}s)
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-[20px] sm:text-[24px] font-semibold text-[#e1e1f1] tracking-tight">
            {plan.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onMakeAnotherEdit}
            className="px-3.5 py-2 rounded-xl bg-[#272935] hover:bg-[#373845] text-[#c7c4d7] hover:text-[#e1e1f1] text-xs font-semibold transition-all cursor-pointer border border-[#373845] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Edit Footage</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToPipeline}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#001f26] font-semibold text-xs transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            <span>Export & Save Edit</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player on Left, AI Assistant & Chat on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (xl:col-span-7): Video Sequence Player & Visual Timeline */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          {/* Main Visual Cut Preview Player */}
          <div className="relative w-full rounded-2xl bg-[#0b0e18] border border-[#272935] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-3 sm:p-5">
            <div className="relative aspect-[9/16] w-full max-w-[340px] max-h-[540px] rounded-xl overflow-hidden bg-black border border-[#272935] shadow-2xl flex items-center justify-center">
              {activeClip?.media.type === 'video' ? (
                <video
                  key={activeClip.id}
                  src={activeClip.media.previewUrl}
                  className="w-full h-full object-cover"
                  autoPlay={isPlaying}
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  key={activeClip?.id}
                  src={activeClip?.media.previewUrl}
                  alt={activeClip?.media.name}
                  className={`w-full h-full object-cover transition-transform duration-1000 ${
                    activeClip?.zoom === 'punch-in'
                      ? 'scale-115'
                      : activeClip?.zoom === 'slow-zoom-in'
                      ? 'scale-105'
                      : 'scale-100'
                  }`}
                />
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

              {/* Top HUD Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono pointer-events-none z-10">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[#4cd7f6] font-bold border border-[#4cd7f6]/30">
                  CLIP {activeClipIndex + 1} OF {plan.clips.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[#d0bcff] font-semibold border border-white/10">
                  {activeClip?.speed}x SPEED
                </span>
              </div>

              {/* Central Play/Pause button */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/20 cursor-pointer shadow-xl"
                  aria-label={isPlaying ? 'Pause' : 'Play edit'}
                >
                  <span className="material-symbols-outlined text-[32px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>

              {/* Bottom HUD: Active Transition & Duration */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 pointer-events-none z-10">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#e1e1f1]">
                  <span className="truncate max-w-[180px] font-semibold text-[#4cd7f6]">
                    {activeClip?.media.name}
                  </span>
                  <span>{activeClip?.duration}s</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#c7c4d7]">
                  <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[#c0c1ff]">
                    ⚡ {activeClip?.transition}
                  </span>
                  <span className="text-[#908fa0]">{plan.styleName}</span>
                </div>
              </div>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="w-full flex items-center justify-between gap-3 pt-3 mt-2 border-t border-[#272935] text-xs font-mono text-[#c7c4d7]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span className="font-sans text-[11px] font-semibold">
                    {isPlaying ? 'Pause' : 'Play Timeline'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveClipIndex(0)}
                  className="p-1.5 rounded-lg hover:bg-[#272935] text-[#c7c4d7] hover:text-[#e1e1f1] cursor-pointer"
                  title="Rewind to start"
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                </button>
              </div>

              <span>
                Total Duration: <strong className="text-[#4cd7f6]">{plan.totalDuration}s</strong>
              </span>
            </div>
          </div>

          {/* Section: Intelligent Media Selection Notice with Toggle (Section 9 Requirement) */}
          <div className="p-4 rounded-xl bg-[#191b26] border border-[#272935] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#e1e1f1] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                  auto_awesome
                </span>
                Intelligent Media Selection
              </span>
              <span className="text-xs text-[#c7c4d7] mt-0.5">
                VDK analyzed {allUserMedia.length} files and selected the {plan.clips.length} strongest moments.
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleUseAllMedia}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
                plan.useAllMedia
                  ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/40 shadow-sm'
                  : 'bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] border-[#373845]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {plan.useAllMedia ? 'check_circle' : 'library_add_check'}
              </span>
              <span>{plan.useAllMedia ? 'All Media Included' : 'Use All Media'}</span>
            </button>
          </div>

          {/* Visual Sequence Timeline Strip */}
          <div className="p-4 rounded-xl bg-[#191b26] border border-[#272935] flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#e1e1f1]">
                Sequence Timeline ({plan.clips.length} Clips)
              </span>
              <span className="text-[#908fa0]">Click any clip to preview</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {plan.clips.map((clip, idx) => {
                const isActive = activeClipIndex === idx;
                return (
                  <div
                    key={clip.id}
                    onClick={() => {
                      setActiveClipIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`shrink-0 w-24 sm:w-28 rounded-xl bg-[#11131e] border cursor-pointer overflow-hidden transition-all flex flex-col group ${
                      isActive
                        ? 'border-[#4cd7f6] ring-2 ring-[#4cd7f6]/40 shadow-lg scale-102'
                        : 'border-[#272935] hover:border-[#4cd7f6]/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="relative aspect-video w-full bg-black overflow-hidden">
                      {clip.media.type === 'video' ? (
                        <video
                          src={clip.media.previewUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={clip.media.previewUrl}
                          alt={clip.media.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-1 left-1 px-1 rounded bg-black/80 font-mono text-[8px] text-[#4cd7f6] font-bold">
                        #{idx + 1}
                      </span>
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 font-mono text-[8px] text-white">
                        {clip.duration}s
                      </span>
                    </div>
                    <div className="p-1.5 flex flex-col bg-[#191b26]">
                      <span className="text-[10px] font-mono text-[#c7c4d7] truncate">
                        {clip.media.name}
                      </span>
                      <span className="text-[9px] font-mono text-[#4cd7f6] truncate">
                        {clip.transition.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (xl:col-span-5): VDK AI Assistant Interactive Panel */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#272935]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#001f26] flex items-center justify-center font-bold text-xs shadow-md">
                  VDK
                </div>
                <div className="flex flex-col">
                  <h3 className="font-['Space_Grotesk'] text-sm font-semibold text-[#e1e1f1] flex items-center gap-1.5">
                    VDK AI Assistant
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#c7c4d7]">
                    Ask for pacing, transitions, speed & aesthetic changes
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Prompt Suggestion Pills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono uppercase text-[#908fa0]">
                Quick Modifications
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendPrompt(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-[#11131e] hover:bg-[#272935] hover:text-[#4cd7f6] text-[#c7c4d7] font-['Geist'] text-xs transition-colors cursor-pointer border border-[#272935]"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="h-64 overflow-y-auto rounded-xl bg-[#0b0e18] p-3 border border-[#272935] flex flex-col gap-3 scrollbar-thin">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#4cd7f6] text-[#001f26] font-medium rounded-tr-xs'
                        : 'bg-[#191b26] text-[#e1e1f1] border border-[#272935] rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-mono text-[#908fa0] mt-0.5 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isAiThinking && (
                <div className="self-start flex items-center gap-2 p-2.5 rounded-xl bg-[#191b26] text-xs text-[#4cd7f6] border border-[#272935]">
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  <span>VDK AI is recalibrating the timeline plan...</span>
                </div>
              )}
            </div>

            {/* User Chat Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(userInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder='e.g. "Make it more cinematic" or "Add slow motion"'
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#11131e] border border-[#272935] text-xs text-[#e1e1f1] focus:outline-none focus:border-[#4cd7f6] placeholder:text-[#908fa0]"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isAiThinking}
                className="px-4 py-2.5 rounded-xl bg-[#4cd7f6] hover:brightness-110 active:scale-95 disabled:opacity-50 text-[#001f26] font-semibold text-xs transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[14px]">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

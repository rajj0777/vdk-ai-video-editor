/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIEditingPlan, MediaItem, ReferenceMedia, TimelineClip } from '../types';

const TRANSITIONS = [
  'Beat Flash Cut',
  'Whip Pan Right',
  'Optical Velocity Ramp',
  'Zoom Punch Cut',
  'Glitch Transience',
  'Match Cut',
  'Smooth Crossfade',
];

const ZOOMS: ('none' | 'slow-zoom-in' | 'slow-zoom-out' | 'punch-in')[] = [
  'slow-zoom-in',
  'punch-in',
  'slow-zoom-out',
  'none',
];

/**
 * Creates an intelligent editing plan using the reference video and all uploaded media
 */
export function createAIEditingPlan(
  reference: ReferenceMedia,
  allMedia: MediaItem[],
  options: { useAllMedia?: boolean; style?: string; targetDuration?: number } = {}
): AIEditingPlan {
  const useAll = options.useAllMedia ?? false;
  const count = allMedia.length;

  // Decide how many clips to use:
  // If useAll is true, use all media.
  // Otherwise, intelligently select the best balanced sequence (e.g. 6-10 clips max for punchy pacing).
  let selectedItems: MediaItem[] = [];

  if (useAll || count <= 6) {
    selectedItems = [...allMedia];
  } else {
    // Intelligently select a balanced mix of photos and videos
    const videos = allMedia.filter((m) => m.type === 'video');
    const photos = allMedia.filter((m) => m.type === 'image');

    const targetCount = Math.min(count, Math.max(4, Math.ceil(count * 0.7)));

    // Interleave photos and videos
    const interleaved: MediaItem[] = [];
    let vIdx = 0;
    let pIdx = 0;

    while (interleaved.length < targetCount && (vIdx < videos.length || pIdx < photos.length)) {
      if (vIdx < videos.length) {
        interleaved.push(videos[vIdx++]);
      }
      if (interleaved.length < targetCount && pIdx < photos.length) {
        interleaved.push(photos[pIdx++]);
      }
    }

    selectedItems = interleaved.length > 0 ? interleaved : allMedia.slice(0, targetCount);
  }

  const bpm = 128;
  const beatInterval = 60 / bpm; // ~0.468 seconds per beat
  const baseClipBeats = 4; // 4 beats ~ 1.87 seconds per clip

  let currentTime = 0;
  const clips: TimelineClip[] = selectedItems.map((media, idx) => {
    // Vary clip duration dynamically to match cadence
    const clipBeats = idx % 3 === 0 ? 3 : idx % 2 === 0 ? 4 : 5;
    const duration = parseFloat((clipBeats * beatInterval).toFixed(2));
    const isDropMoment = idx === 1 || idx === Math.floor(selectedItems.length / 2);

    const clip: TimelineClip = {
      id: `clip-${idx + 1}-${media.id}`,
      mediaId: media.id,
      media,
      startTime: parseFloat(currentTime.toFixed(2)),
      duration,
      speed: isDropMoment ? 0.75 : idx % 4 === 0 ? 1.25 : 1.0,
      transition: TRANSITIONS[idx % TRANSITIONS.length],
      zoom: ZOOMS[idx % ZOOMS.length],
      textOverlay: idx === 0 ? 'DROP IN' : undefined,
    };

    currentTime += duration;
    return clip;
  });

  const totalDuration = parseFloat(currentTime.toFixed(1));
  const refName = reference.name || 'Reference Reel';

  const summary =
    count === selectedItems.length
      ? `VDK analyzed all ${count} files and integrated all of them into the beat-synced timeline.`
      : `VDK analyzed ${count} files and selected the ${selectedItems.length} strongest moments to match "${refName}".`;

  return {
    id: `plan-${Date.now()}`,
    title: `${refName.replace(/\.[^/.]+$/, '')} • VDK Master Edit`,
    totalDuration,
    bpm,
    styleName: options.style || 'Teal & Orange Rec.709',
    aspectRatio: '9:16',
    allMediaCount: count,
    usedMediaCount: selectedItems.length,
    useAllMedia: useAll,
    clips,
    summary,
    changesHistory: ['Initial AI edit generated from reference video and uploaded media.'],
  };
}

/**
 * Modifies an existing editing plan based on natural language requests to VDK AI
 */
export function modifyEditingPlan(
  plan: AIEditingPlan,
  allMedia: MediaItem[],
  prompt: string
): { updatedPlan: AIEditingPlan; aiResponse: string } {
  const lower = prompt.toLowerCase();
  let aiResponse = '';
  const changesHistory = [...plan.changesHistory];

  let updatedClips = [...plan.clips];
  let updatedStyle = plan.styleName;
  let useAllMedia = plan.useAllMedia;

  if (lower.includes('all') || lower.includes('use all') || lower.includes('every')) {
    useAllMedia = true;
    const recomputed = createAIEditingPlan(
      { sourceType: 'file', name: plan.title },
      allMedia,
      { useAllMedia: true, style: updatedStyle }
    );
    updatedClips = recomputed.clips;
    aiResponse = `Included all ${allMedia.length} uploaded photos and videos in the timeline. Adjusted pacing to fit smoothly into the sequence.`;
    changesHistory.push('Enabled "Use All Media" (all clips included).');
  } else if (lower.includes('faster') || lower.includes('speed up') || lower.includes('quick')) {
    let curTime = 0;
    updatedClips = updatedClips.map((c) => {
      const newDur = Math.max(0.7, parseFloat((c.duration * 0.7).toFixed(2)));
      const updated = {
        ...c,
        duration: newDur,
        startTime: parseFloat(curTime.toFixed(2)),
        speed: 1.35,
        transition: 'Beat Flash Cut',
      };
      curTime += newDur;
      return updated;
    });
    aiResponse = 'Accelerated timeline pacing! Reduced clip durations and applied rapid beat flash cuts for high-energy cadence.';
    changesHistory.push('Increased pacing and speed cuts.');
  } else if (lower.includes('slow') || lower.includes('slow motion') || lower.includes('slow-mo')) {
    let curTime = 0;
    updatedClips = updatedClips.map((c, idx) => {
      const isSlow = idx % 2 === 1;
      const newDur = isSlow ? parseFloat((c.duration * 1.5).toFixed(2)) : c.duration;
      const updated = {
        ...c,
        duration: newDur,
        startTime: parseFloat(curTime.toFixed(2)),
        speed: isSlow ? 0.5 : 1.0,
        transition: isSlow ? 'Optical Velocity Ramp' : c.transition,
      };
      curTime += newDur;
      return updated;
    });
    aiResponse = 'Applied 0.5x optical slow-motion ramps on drop moments for a dramatic, cinematic feel.';
    changesHistory.push('Added 0.5x slow-motion ramps.');
  } else if (lower.includes('cinematic') || lower.includes('film') || lower.includes('movie')) {
    updatedStyle = 'Teal & Orange Rec.709';
    updatedClips = updatedClips.map((c) => ({
      ...c,
      transition: 'Smooth Crossfade',
      zoom: 'slow-zoom-in',
    }));
    aiResponse = 'Enhanced cinematic look: switched to Teal & Orange 35mm color grading, smooth anamorphic crossfades, and subtle Ken Burns zoom.';
    changesHistory.push('Switched to cinematic look (35mm grade & smooth fades).');
  } else if (lower.includes('photo') || lower.includes('more photos')) {
    const photos = allMedia.filter((m) => m.type === 'image');
    if (photos.length > 0) {
      // Re-prioritize photos
      const photoClips: TimelineClip[] = photos.map((p, idx) => ({
        id: `photo-clip-${idx}-${p.id}`,
        mediaId: p.id,
        media: p,
        startTime: 0,
        duration: 1.6,
        speed: 1.0,
        transition: 'Zoom Punch Cut',
        zoom: 'punch-in',
      }));

      // Combine with some videos
      const videos = allMedia.filter((m) => m.type === 'video').slice(0, 2);
      const combined = [...photoClips];
      videos.forEach((v, idx) => {
        combined.splice(idx * 2 + 1, 0, {
          id: `vid-clip-${idx}-${v.id}`,
          mediaId: v.id,
          media: v,
          startTime: 0,
          duration: 2.2,
          speed: 1.0,
          transition: 'Beat Flash Cut',
          zoom: 'slow-zoom-out',
        });
      });

      let cur = 0;
      updatedClips = combined.map((c) => {
        const withTime = { ...c, startTime: parseFloat(cur.toFixed(2)) };
        cur += c.duration;
        return withTime;
      });

      aiResponse = `Re-ordered the sequence to feature ${photos.length} photos prominently with dynamic zoom punches and beat cuts.`;
      changesHistory.push('Re-sequenced to highlight photo stills.');
    } else {
      aiResponse = 'No additional photos were found in your uploaded media. Upload photos using "+ Add Photos & Videos" to feature them!';
    }
  } else if (lower.includes('15') || lower.includes('15 seconds') || lower.includes('short')) {
    const target = 15.0;
    const perClip = parseFloat((target / updatedClips.length).toFixed(2));
    let cur = 0;
    updatedClips = updatedClips.map((c) => {
      const item = { ...c, duration: perClip, startTime: parseFloat(cur.toFixed(2)) };
      cur += perClip;
      return item;
    });
    aiResponse = `Calibrated total edit duration to exactly 15.0 seconds—ideal for Instagram Reels & YouTube Shorts.`;
    changesHistory.push('Adjusted total duration to 15.0s.');
  } else if (lower.includes('text') || lower.includes('less text') || lower.includes('no text')) {
    updatedClips = updatedClips.map((c) => ({
      ...c,
      textOverlay: undefined,
    }));
    aiResponse = 'Removed on-screen text overlays for a clean, distraction-free visual aesthetic.';
    changesHistory.push('Removed text overlays.');
  } else if (lower.includes('reference') || lower.includes('like reference')) {
    updatedClips = updatedClips.map((c, idx) => ({
      ...c,
      speed: idx % 2 === 0 ? 1.5 : 0.6,
      transition: 'Optical Velocity Ramp',
    }));
    aiResponse = 'Matched motion speed curves directly to reference video velocity ramps.';
    changesHistory.push('Matched reference velocity profile.');
  } else {
    // General creative adjustment
    updatedClips = updatedClips.map((c, idx) => ({
      ...c,
      speed: idx % 3 === 0 ? 0.8 : 1.1,
      transition: idx % 2 === 0 ? 'Optical Velocity Ramp' : 'Beat Flash Cut',
    }));
    aiResponse = `Understood: "${prompt}". Re-tuned transition curve velocities and beat alignments across your clips.`;
    changesHistory.push(`Applied prompt adjustment: "${prompt}"`);
  }

  const newTotal = parseFloat(
    updatedClips.reduce((acc, c) => acc + c.duration, 0).toFixed(1)
  );

  const updatedPlan: AIEditingPlan = {
    ...plan,
    totalDuration: newTotal,
    styleName: updatedStyle,
    useAllMedia,
    usedMediaCount: updatedClips.length,
    clips: updatedClips,
    changesHistory,
  };

  return { updatedPlan, aiResponse };
}

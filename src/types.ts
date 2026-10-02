export type TabType = 'all' | 'exports' | 'drafts' | 'trash';
export type NavScreen = 'studio-home' | 'ai-recreate-and-edit' | 'style-matrix' | 'my-projects';

export type Resolution = '720p' | '1080p' | '4k';
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
export type PlatformPreset = 'instagram-reel' | 'tiktok' | 'youtube-short' | 'youtube-4k' | 'instagram-post';

export interface Project {
  id: string;
  title: string;
  category: string;
  duration: string;
  durationSeconds: number;
  createdAt: string;
  spec: string;
  imageUrl: string;
  videoUrl?: string;
  status: 'exported' | 'draft' | 'trashed';
  aspectRatio: AspectRatio;
  resolution: Resolution;
  bpm?: number;
  gpuLatency?: string;
  fileSize?: string;
  isFaceShielded?: boolean;
}

export interface ShareTarget {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'whatsapp' | 'link';
  title: string;
  subtitle: string;
  icon: string;
}

export interface MediaItem {
  id: string;
  file: File;
  name: string;
  size: number;
  sizeFormatted: string;
  type: 'image' | 'video';
  mimeType: string;
  previewUrl: string;
  duration?: number;
  durationFormatted?: string;
  uploadedAt: Date;
  uploadProgress?: number;
}

export interface ReferenceMedia {
  sourceType: 'file' | 'url';
  file?: File;
  url?: string;
  previewUrl?: string;
  name?: string;
  size?: number;
  sizeFormatted?: string;
  duration?: number;
  durationFormatted?: string;
}

export interface TimelineClip {
  id: string;
  mediaId: string;
  media: MediaItem;
  startTime: number;
  duration: number;
  speed: number;
  transition: string;
  zoom: 'none' | 'slow-zoom-in' | 'slow-zoom-out' | 'punch-in';
  textOverlay?: string;
}

export interface AIEditingPlan {
  id: string;
  title: string;
  totalDuration: number;
  bpm: number;
  styleName: string;
  aspectRatio: AspectRatio;
  allMediaCount: number;
  usedMediaCount: number;
  useAllMedia: boolean;
  clips: TimelineClip[];
  summary: string;
  changesHistory: string[];
}

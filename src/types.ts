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

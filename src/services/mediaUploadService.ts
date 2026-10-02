/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MediaItem } from '../types';

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm',
  'video/x-m4v',
  'video/m4v',
];

export const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

/**
 * Format bytes into human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format seconds into mm:ss
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Validate a user selected media file
 */
export function validateMediaFile(file: File): {
  valid: boolean;
  type: 'image' | 'video' | 'unsupported';
  error?: string;
} {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  const isImage =
    SUPPORTED_IMAGE_TYPES.includes(mime) ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp') ||
    name.endsWith('.heic') ||
    name.endsWith('.heif');

  const isVideo =
    SUPPORTED_VIDEO_TYPES.includes(mime) ||
    name.endsWith('.mp4') ||
    name.endsWith('.mov') ||
    name.endsWith('.webm') ||
    name.endsWith('.m4v');

  if (!isImage && !isVideo) {
    return {
      valid: false,
      type: 'unsupported',
      error: "This file type isn't supported. Please upload an image or video.",
    };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      type: 'image',
      error: `This image is too large (${formatBytes(file.size)}). Max allowed is ${formatBytes(MAX_IMAGE_SIZE)}.`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      type: 'video',
      error: `This video is too large (${formatBytes(file.size)}). Max allowed is ${formatBytes(MAX_VIDEO_SIZE)}.`,
    };
  }

  return {
    valid: true,
    type: isVideo ? 'video' : 'image',
  };
}

/**
 * Extracts duration from video file asynchronously
 */
export function extractVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration || 0);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };

      video.src = url;
    } catch {
      resolve(0);
    }
  });
}

export interface UploadResult {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

/**
 * Upload service abstraction ready for POST /api/media/upload
 * For local prototype, wraps the File object and returns local metadata.
 */
export async function uploadMedia(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  // Simulate network/upload stages if onProgress is provided
  if (onProgress) {
    for (let p = 15; p <= 100; p += 25) {
      await new Promise((r) => setTimeout(r, 60));
      onProgress(p);
    }
  }

  const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const previewUrl = URL.createObjectURL(file);

  return {
    id,
    name: file.name,
    url: previewUrl,
    size: file.size,
    mimeType: file.type,
  };
}

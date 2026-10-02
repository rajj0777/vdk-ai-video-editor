/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MediaItem, ReferenceMedia } from '../types';
import {
  validateMediaFile,
  formatBytes,
  formatDuration,
  extractVideoDuration,
} from '../services/mediaUploadService';

interface MediaContextType {
  userMedia: MediaItem[];
  referenceMedia: ReferenceMedia | null;
  addFiles: (files: FileList | File[]) => Promise<{ addedCount: number; errors: string[] }>;
  removeFile: (id: string) => void;
  clearAllUserMedia: () => void;
  setReferenceFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  setReferenceUrl: (url: string) => void;
  clearReference: () => void;
  hasReference: boolean;
  hasUserMedia: boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMedia, setUserMedia] = useState<MediaItem[]>([]);
  const [referenceMedia, setReferenceMedia] = useState<ReferenceMedia | null>(null);

  // Add multiple user files (photos/videos) with validation
  const addFiles = useCallback(
    async (files: FileList | File[]): Promise<{ addedCount: number; errors: string[] }> => {
      const fileArray = Array.from(files);
      const errors: string[] = [];
      const newItems: MediaItem[] = [];

      for (const file of fileArray) {
        // Validate file
        const validation = validateMediaFile(file);
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }

        // Avoid adding duplicate file with identical name and size
        const isDuplicate = userMedia.some(
          (m) => m.name === file.name && m.size === file.size
        );
        if (isDuplicate) {
          errors.push(`"${file.name}" is already in your media gallery.`);
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        let duration = 0;
        let durationFormatted = undefined;

        if (validation.type === 'video') {
          try {
            duration = await extractVideoDuration(file);
            durationFormatted = formatDuration(duration);
          } catch {
            duration = 0;
            durationFormatted = '00:00';
          }
        }

        newItems.push({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          sizeFormatted: formatBytes(file.size),
          type: validation.type as 'image' | 'video',
          mimeType: file.type || (validation.type === 'video' ? 'video/mp4' : 'image/jpeg'),
          previewUrl,
          duration: duration > 0 ? duration : undefined,
          durationFormatted,
          uploadedAt: new Date(),
        });
      }

      if (newItems.length > 0) {
        setUserMedia((prev) => [...prev, ...newItems]);
      }

      return { addedCount: newItems.length, errors };
    },
    [userMedia]
  );

  // Remove a specific media item and revoke object URL
  const removeFile = useCallback((id: string) => {
    setUserMedia((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target && target.previewUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(target.previewUrl);
        } catch {
          // Ignore
        }
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  // Clear all user media and revoke object URLs
  const clearAllUserMedia = useCallback(() => {
    setUserMedia((prev) => {
      prev.forEach((m) => {
        if (m.previewUrl.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(m.previewUrl);
          } catch {
            // Ignore
          }
        }
      });
      return [];
    });
  }, []);

  // Set reference video file
  const setReferenceFile = useCallback(
    async (file: File): Promise<{ success: boolean; error?: string }> => {
      const validation = validateMediaFile(file);
      if (!validation.valid || validation.type !== 'video') {
        return {
          success: false,
          error: "Please upload a valid video file (MP4, MOV, WEBM, M4V).",
        };
      }

      // Revoke previous reference file URL if any
      if (referenceMedia?.previewUrl && referenceMedia.previewUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(referenceMedia.previewUrl);
        } catch {
          // Ignore
        }
      }

      const previewUrl = URL.createObjectURL(file);
      let duration = 0;
      let durationFormatted = '00:00';
      try {
        duration = await extractVideoDuration(file);
        durationFormatted = formatDuration(duration);
      } catch {
        // Fallback
      }

      setReferenceMedia({
        sourceType: 'file',
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        sizeFormatted: formatBytes(file.size),
        duration: duration > 0 ? duration : undefined,
        durationFormatted,
      });

      return { success: true };
    },
    [referenceMedia]
  );

  // Set reference URL (e.g. Instagram reel, TikTok)
  const setReferenceUrl = useCallback(
    (url: string) => {
      if (referenceMedia?.previewUrl && referenceMedia.previewUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(referenceMedia.previewUrl);
        } catch {
          // Ignore
        }
      }

      setReferenceMedia({
        sourceType: 'url',
        url,
        name: url ? new URL(url).hostname || 'Web Reel' : undefined,
      });
    },
    [referenceMedia]
  );

  // Clear reference
  const clearReference = useCallback(() => {
    if (referenceMedia?.previewUrl && referenceMedia.previewUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(referenceMedia.previewUrl);
      } catch {
        // Ignore
      }
    }
    setReferenceMedia(null);
  }, [referenceMedia]);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      userMedia.forEach((m) => {
        if (m.previewUrl.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(m.previewUrl);
          } catch {
            // Ignore
          }
        }
      });
      if (referenceMedia?.previewUrl && referenceMedia.previewUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(referenceMedia.previewUrl);
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const hasReference =
    !!referenceMedia &&
    ((referenceMedia.sourceType === 'file' && !!referenceMedia.file) ||
      (referenceMedia.sourceType === 'url' && !!referenceMedia.url?.trim()));

  const hasUserMedia = userMedia.length > 0;

  return (
    <MediaContext.Provider
      value={{
        userMedia,
        referenceMedia,
        addFiles,
        removeFile,
        clearAllUserMedia,
        setReferenceFile,
        setReferenceUrl,
        clearReference,
        hasReference,
        hasUserMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMedia } from '../../context/MediaContext';
import { AIEditingPlan, Project } from '../../types';
import { ReferenceVideoUploader } from '../ReferenceVideoUploader';
import { MediaUploader } from '../MediaUploader';
import { EditResultView } from '../EditResultView';
import { createAIEditingPlan } from '../../services/aiEditingEngine';

interface AIRecreateScreenProps {
  onAddNewProject: (project: Project) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToProjects: () => void;
}

export const AIRecreateScreen: React.FC<AIRecreateScreenProps> = ({
  onAddNewProject,
  onShowToast,
  onNavigateToProjects,
}) => {
  const { userMedia, referenceMedia, hasReference, hasUserMedia } = useMedia();

  // Multi-stage upload and processing state (Section 10 requirement)
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState<string>('');
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [generatedPlan, setGeneratedPlan] = useState<AIEditingPlan | null>(null);

  const canCreate = hasReference && hasUserMedia && referenceMedia?.sourceType === 'file';

  const handleCreateMyEdit = () => {
    if (!canCreate) {
      if (!hasReference) {
        onShowToast('Please upload a reference video in Step 1 to continue.', 'error');
      } else if (!hasUserMedia) {
        onShowToast('Please add at least one photo or video in Step 2 to continue.', 'error');
      }
      return;
    }

    setIsProcessing(true);
    setUploadPercent(15);
    setProcessStage('Uploading media...');

    setTimeout(() => {
      setUploadPercent(65);
      setProcessStage('Uploading media...');
    }, 600);

    setTimeout(() => {
      setUploadPercent(100);
      setProcessStage('Analyzing reference video...');
    }, 1200);

    setTimeout(() => {
      setProcessStage('Preparing AI edit...');
    }, 2000);

    setTimeout(() => {
      setProcessStage('Creating timeline...');
    }, 2800);

    setTimeout(() => {
      setIsProcessing(false);

      if (referenceMedia) {
        const plan = createAIEditingPlan(referenceMedia, userMedia);
        setGeneratedPlan(plan);
        onShowToast(
          `VDK AI generated your edit with ${plan.clips.length} cuts from your footage!`,
          'success'
        );
      }
    }, 3600);
  };

  const handleSavePlanToProjects = (project: Project) => {
    onAddNewProject(project);
    onNavigateToProjects();
  };

  // If edit result is generated, show the EditResultView with the interactive VDK AI Assistant!
  if (generatedPlan && referenceMedia) {
    return (
      <div className="w-full px-4 md:px-6 max-w-[1720px] mx-auto py-6">
        <EditResultView
          initialPlan={generatedPlan}
          allUserMedia={userMedia}
          referenceMedia={referenceMedia}
          onSaveProject={handleSavePlanToProjects}
          onMakeAnotherEdit={() => setGeneratedPlan(null)}
          onShowToast={onShowToast}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 max-w-[1400px] mx-auto py-6 flex flex-col gap-8">
      {/* Simple Header */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#4cd7f6] tracking-wider font-semibold">
            VDK Studio
          </span>
          <span className="text-[#908fa0] text-[10px]">•</span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
            AI Video Editor
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-[26px] sm:text-[32px] md:text-[38px] font-semibold text-[#e1e1f1] tracking-tight">
          Create your edit automatically.
        </h1>
        <p className="text-xs sm:text-sm text-[#c7c4d7] max-w-xl">
          Follow the 3 simple steps below: Upload 1 reference Reel or video, add multiple personal photos and videos, and click Create My Edit.
        </p>
      </div>

      {/* 3 Simple Steps Container */}
      <div className="flex flex-col gap-6">
        {/* STEP 1: Upload Reference Video */}
        <div className="flex flex-col gap-2">
          <ReferenceVideoUploader onShowToast={onShowToast} />
        </div>

        {/* STEP 2: Add Your Media (Multiple Photos & Videos) */}
        <div className="p-5 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#c0c1ff]/20 text-[#c0c1ff] font-mono text-[10px] font-bold uppercase tracking-wider">
              Step 2
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e1f1]">
              Add Your Media
            </h3>
          </div>

          <MediaUploader
            onShowToast={onShowToast}
            title="Upload your videos and photos"
            subtitle="Select multiple photos and videos from your device. You can click '+ Add Photos & Videos' multiple times to keep adding."
          />
        </div>

        {/* STEP 3: CREATE MY EDIT */}
        <div className="p-6 rounded-2xl bg-[#191b26] border border-[#272935] shadow-xl flex flex-col items-center justify-center text-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#4cd7f6]/30">
              Step 3
            </span>
            <h3 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e1f1]">
              Generate Your VDK Edit
            </h3>
            <p className="text-xs text-[#c7c4d7] max-w-md">
              VDK AI analyzes your reference video's pacing, cuts, and cadence, and synthesizes an edit incorporating all {userMedia.length} of your uploaded media items.
            </p>
          </div>

          {/* Processing / Progress State */}
          {isProcessing ? (
            <div className="w-full max-w-md p-4 rounded-xl bg-[#0b0e18] border border-[#4cd7f6] flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#4cd7f6] font-semibold">
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  <span>{processStage}</span>
                </div>
                <span className="font-mono text-[#4cd7f6] font-bold">
                  {processStage === 'Uploading media...' ? `${uploadPercent}%` : 'Processing'}
                </span>
              </div>

              <div className="w-full h-2 bg-[#272935] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] transition-all duration-300 rounded-full"
                  style={{
                    width:
                      processStage === 'Uploading media...'
                        ? `${uploadPercent}%`
                        : processStage === 'Analyzing reference video...'
                        ? '60%'
                        : processStage === 'Preparing AI edit...'
                        ? '85%'
                        : '95%',
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#908fa0]">
                <span className={processStage === 'Uploading media...' ? 'text-[#4cd7f6] font-bold' : ''}>
                  Uploading
                </span>
                <span className={processStage === 'Analyzing reference video...' ? 'text-[#4cd7f6] font-bold' : ''}>
                  Analyzing Reference
                </span>
                <span className={processStage === 'Preparing AI edit...' ? 'text-[#4cd7f6] font-bold' : ''}>
                  Selecting Moments
                </span>
                <span className={processStage === 'Creating timeline...' ? 'text-[#4cd7f6] font-bold' : ''}>
                  Building Timeline
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 w-full max-w-md">
              <button
                type="button"
                onClick={handleCreateMyEdit}
                disabled={!canCreate}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  canCreate
                    ? 'bg-gradient-to-r from-[#8083ff] via-[#4cd7f6] to-[#8083ff] text-[#001f26] hover:brightness-110 active:scale-98 shadow-[0_0_25px_rgba(76,215,246,0.35)]'
                    : 'bg-[#272935] text-[#908fa0] cursor-not-allowed border border-[#373845]'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {canCreate ? 'auto_fix_high' : 'lock'}
                </span>
                <span>CREATE MY EDIT</span>
              </button>

              {/* Requirement reminder if not fulfilled */}
              {!canCreate && (
                <div className="text-xs text-[#ffb4ab] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>
                    {!hasReference
                      ? 'Upload a reference video in Step 1 to enable.'
                      : 'Add at least one photo or video in Step 2 to enable.'}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-[#908fa0] pt-2 border-t border-[#272935] w-full">
            <span>✓ Uses All Uploaded Media</span>
            <span>✓ Preserves Original Faces</span>
            <span>✓ Beat-Synced Timeline</span>
            <span>✓ Customizable with VDK AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

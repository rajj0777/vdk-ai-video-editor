import React, { useState } from 'react';
import { Project, TabType } from '../../types';
import { FlightDeck } from '../FlightDeck';
import { ProjectsList } from '../ProjectsList';
import { UserSafeguardsSidebar } from '../UserSafeguardsSidebar';

interface MyProjectsScreenProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  onDuplicateProject: (p: Project) => void;
  onOpenRenameModal: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onReExportProject: (p: Project) => void;
  onOpenShareModal: (platform: 'instagram' | 'tiktok' | 'youtube' | 'whatsapp') => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onUpdateActiveProject: (updated: Partial<Project>) => void;
  onOpenFaceShield: () => void;
}

export const MyProjectsScreen: React.FC<MyProjectsScreenProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onDuplicateProject,
  onOpenRenameModal,
  onDeleteProject,
  onReExportProject,
  onOpenShareModal,
  onShowToast,
  onUpdateActiveProject,
  onOpenFaceShield,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Filter projects by active tab
  const getFilteredProjects = () => {
    switch (activeTab) {
      case 'exports':
        return projects.filter((p) => p.status === 'exported');
      case 'drafts':
        return projects.filter((p) => p.status === 'draft');
      case 'trash':
        return projects.filter((p) => p.status === 'trashed');
      default:
        return projects.filter((p) => p.status !== 'trashed');
    }
  };

  const currentList = getFilteredProjects();

  const totalCount = projects.filter((p) => p.status !== 'trashed').length;
  const exportCount = projects.filter((p) => p.status === 'exported').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="w-full px-4 md:px-6 max-w-[1720px] mx-auto py-6 flex flex-col gap-8">
      {/* DASHBOARD SUB-NAV & TAB SUITE */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] uppercase text-[#4cd7f6] tracking-wider font-semibold">
              Workspace Pipeline
            </span>
            <span className="text-[#908fa0] text-[10px]">/</span>
            <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] text-[#c7c4d7] uppercase truncate">
              Deliverables & Repositories
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-[22px] sm:text-[26px] md:text-[30px] font-semibold text-[#e1e1f1] tracking-tight">
            My Projects & Exports
          </h1>
        </div>

        {/* Segmented Navigation Pills - Horizontally scrollable on mobile */}
        <div className="w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 flex items-center gap-1 bg-[#191b26] p-1 sm:p-1.5 rounded-xl border border-[#272935] shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-lg font-['Geist'] text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#272935] text-[#e1e1f1] shadow-sm border border-[#373845]'
                : 'text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#1d1f2a]'
            }`}
          >
            All Projects{' '}
            <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] ml-1 opacity-70">
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exports')}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-lg font-['Geist'] text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === 'exports'
                ? 'bg-[#272935] text-[#e1e1f1] shadow-sm border border-[#373845]'
                : 'text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#1d1f2a]'
            }`}
          >
            Completed Exports{' '}
            <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] ml-1 opacity-70">
              {exportCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drafts')}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-lg font-['Geist'] text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === 'drafts'
                ? 'bg-[#272935] text-[#e1e1f1] shadow-sm border border-[#373845]'
                : 'text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#1d1f2a]'
            }`}
          >
            Drafts & Recreations{' '}
            <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] ml-1 opacity-70">
              {draftCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trash')}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-lg font-['Geist'] text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === 'trash'
                ? 'bg-[#272935] text-[#e1e1f1] shadow-sm border border-[#373845]'
                : 'text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#1d1f2a]'
            }`}
          >
            Trash & Auto-Saved
          </button>
        </div>
      </div>

      {/* HERO ACTIVE EXPORT FLIGHT-DECK & SOCIAL SHARE CONSOLE */}
      <FlightDeck
        project={activeProject}
        onOpenShareModal={onOpenShareModal}
        onShowToast={onShowToast}
        onUpdateProject={onUpdateActiveProject}
      />

      {/* MAIN TWO-COLUMN WORKBENCH: PROJECT REPOSITORY & PRIVACY METRICS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Project Library Grid: 8 Columns */}
        <div className="xl:col-span-8 flex flex-col gap-5">
          <ProjectsList
            projects={currentList}
            activeProjectId={activeProject.id}
            onSelectProject={onSelectProject}
            onDuplicateProject={onDuplicateProject}
            onOpenRenameModal={onOpenRenameModal}
            onDeleteProject={onDeleteProject}
            onReExportProject={onReExportProject}
          />
        </div>

        {/* User Profile & Privacy Safeguards Panel: 4 Columns */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <UserSafeguardsSidebar
            onShowToast={onShowToast}
            onOpenFaceShield={onOpenFaceShield}
          />
        </div>
      </div>
    </div>
  );
};

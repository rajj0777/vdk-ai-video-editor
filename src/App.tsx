/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavScreen, Project } from './types';
import { INITIAL_FEATURED_PROJECT, INITIAL_PROJECTS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MyProjectsScreen } from './components/screens/MyProjectsScreen';
import { AIRecreateScreen } from './components/screens/AIRecreateScreen';
import { StyleMatrixScreen } from './components/screens/StyleMatrixScreen';
import { StudioHomeScreen } from './components/screens/StudioHomeScreen';
import { QuickCreateModal } from './components/QuickCreateModal';
import { ShareModal } from './components/ShareModal';
import { RenameModal } from './components/RenameModal';
import { FaceShieldModal } from './components/FaceShieldModal';
import { Toast, ToastMessage } from './components/Toast';
import { MediaProvider } from './context/MediaContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('ai-recreate-and-edit');
  const [projects, setProjects] = useState<Project[]>([
    INITIAL_FEATURED_PROJECT,
    ...INITIAL_PROJECTS,
  ]);
  const [activeProject, setActiveProject] = useState<Project>(INITIAL_FEATURED_PROJECT);

  // Modals state
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [shareModalConfig, setShareModalConfig] = useState<{
    isOpen: boolean;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'whatsapp';
  }>({
    isOpen: false,
    platform: 'instagram',
  });
  const [renameTargetProject, setRenameTargetProject] = useState<Project | null>(null);
  const [isFaceShieldOpen, setIsFaceShieldOpen] = useState(false);

  // Toast system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Select project to load in Flight-Deck
  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded "${project.title}" into active Flight-Deck console.`, 'info');
  };

  // Duplicate project
  const handleDuplicateProject = (project: Project) => {
    const duplicate: Project = {
      ...project,
      id: `EXP-${Math.floor(10000 + Math.random() * 90000)}-COPY`,
      title: `${project.title} (Copy)`,
      createdAt: 'Just now',
    };
    setProjects((prev) => [duplicate, ...prev]);
    showToast(`Duplicated "${project.title}" successfully.`, 'success');
  };

  // Rename project
  const handleSaveRename = (projectId: string, newTitle: string, newSpec: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, title: newTitle, spec: newSpec } : p
      )
    );
    if (activeProject.id === projectId) {
      setActiveProject((prev) => ({ ...prev, title: newTitle, spec: newSpec }));
    }
    showToast('Project metadata updated successfully.', 'success');
  };

  // Delete project (move to trash)
  const handleDeleteProject = (projectId: string) => {
    const toDelete = projects.find((p) => p.id === projectId);
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'trashed' } : p))
    );
    showToast(
      `Moved "${toDelete?.title || 'Project'}" to Trash & Auto-Saved.`,
      'info'
    );
  };

  // Re-export project
  const handleReExport = (project: Project) => {
    showToast(`Triggered GPU lossless neural re-export for "${project.title}"...`, 'info');
    setTimeout(() => {
      setActiveProject(project);
      showToast(`Re-export finished in 7.9s lossless NVENC!`, 'success');
    }, 1200);
  };

  // Add newly synthesized project
  const handleAddNewProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    showToast(`"${newProject.title}" synthesized with zero render queue!`, 'success');
  };

  // Update active project parameters (resolution, aspect ratio)
  const handleUpdateActiveProject = (updated: Partial<Project>) => {
    setActiveProject((prev) => ({ ...prev, ...updated }));
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, ...updated } : p))
    );
  };

  // Apply style matrix preset to active project
  const handleApplyStyleToProject = (styleTitle: string, lut: string) => {
    handleUpdateActiveProject({
      category: styleTitle.toUpperCase(),
      spec: `Graded with ${lut}. High-cadence beat-sync ramping and zero watermark.`,
    });
  };

  return (
    <MediaProvider>
      <div className="min-h-screen bg-[#0b0e18] text-[#e1e1f1] flex flex-col font-['Geist'] selection:bg-[#c0c1ff] selection:text-[#1000a9]">
        {/* Top Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenQuickCreate={() => setIsQuickCreateOpen(true)}
          onOpenFaceShield={() => setIsFaceShieldOpen(true)}
        />

        {/* Main Content Area */}
        <main className="w-full pt-16 pb-28 xl:pb-8 flex-1 flex flex-col">
          {currentScreen === 'my-projects' && (
            <MyProjectsScreen
              projects={projects}
              activeProject={activeProject}
              onSelectProject={handleSelectProject}
              onDuplicateProject={handleDuplicateProject}
              onOpenRenameModal={(p) => setRenameTargetProject(p)}
              onDeleteProject={handleDeleteProject}
              onReExportProject={handleReExport}
              onOpenShareModal={(platform) =>
                setShareModalConfig({ isOpen: true, platform })
              }
              onShowToast={showToast}
              onUpdateActiveProject={handleUpdateActiveProject}
              onOpenFaceShield={() => setIsFaceShieldOpen(true)}
            />
          )}

          {currentScreen === 'ai-recreate-and-edit' && (
            <AIRecreateScreen
              onAddNewProject={handleAddNewProject}
              onShowToast={showToast}
              onNavigateToProjects={() => setCurrentScreen('my-projects')}
            />
          )}

          {currentScreen === 'style-matrix' && (
            <StyleMatrixScreen
              activeProject={activeProject}
              onApplyStyleToProject={handleApplyStyleToProject}
              onShowToast={showToast}
              onNavigateToProjects={() => setCurrentScreen('my-projects')}
            />
          )}

          {currentScreen === 'studio-home' && (
            <StudioHomeScreen
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenQuickCreate={() => setIsQuickCreateOpen(true)}
              recentProjects={projects}
              onSelectProject={handleSelectProject}
            />
          )}
        </main>

        {/* Footer */}
        <Footer />

        {/* Quick Create Modal */}
        <QuickCreateModal
          isOpen={isQuickCreateOpen}
          onClose={() => setIsQuickCreateOpen(false)}
          onCreateProject={(proj) => {
            handleAddNewProject(proj);
            setCurrentScreen('my-projects');
          }}
        />

        {/* Social Media Share Modal */}
        <ShareModal
          isOpen={shareModalConfig.isOpen}
          platform={shareModalConfig.platform}
          project={activeProject}
          onClose={() =>
            setShareModalConfig((prev) => ({ ...prev, isOpen: false }))
          }
          onSuccess={(msg) => showToast(msg, 'success')}
        />

        {/* Rename Modal */}
        <RenameModal
          isOpen={!!renameTargetProject}
          project={renameTargetProject}
          onClose={() => setRenameTargetProject(null)}
          onSave={handleSaveRename}
        />

        {/* Face & ID Shield Modal */}
        <FaceShieldModal
          isOpen={isFaceShieldOpen}
          onClose={() => setIsFaceShieldOpen(false)}
          onShowToast={showToast}
        />

        {/* Toast Notifications */}
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    </MediaProvider>
  );
}

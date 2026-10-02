import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectsListProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (project: Project) => void;
  onDuplicateProject: (project: Project) => void;
  onOpenRenameModal: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onReExportProject: (project: Project) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onDuplicateProject,
  onOpenRenameModal,
  onDeleteProject,
  onReExportProject,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.spec.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="font-['Space_Grotesk'] text-[20px] font-semibold text-[#e1e1f1] tracking-tight">
            Recent Projects
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-[#272935] text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px] border border-[#373845]">
            {filteredProjects.length} Active
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {showSearch && (
            <input
              type="text"
              placeholder="Search edits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#191b26] border border-[#272935] text-[#e1e1f1] focus:outline-none focus:border-[#4cd7f6] w-40"
              autoFocus
            />
          )}
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-colors cursor-pointer border ${
              showSearch
                ? 'bg-[#272935] text-[#4cd7f6] border-[#4cd7f6]/40'
                : 'bg-[#191b26] hover:bg-[#272935] text-[#c7c4d7] hover:text-[#e1e1f1] border-[#272935]'
            }`}
            title="Filter and search list"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg bg-[#191b26] hover:bg-[#272935] text-[#c7c4d7] hover:text-[#e1e1f1] transition-colors cursor-pointer border border-[#272935]"
            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {viewMode === 'grid' ? 'view_list' : 'grid_view'}
            </span>
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#191b26] border border-[#272935]">
          <span className="material-symbols-outlined text-[36px] text-[#908fa0] mb-2">
            video_library
          </span>
          <p className="text-[#c7c4d7] text-sm">No matching projects found</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* 4 Bespoke Project Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredProjects.map((proj, idx) => {
            const isSelected = activeProjectId === proj.id;
            return (
              <div
                key={proj.id}
                className={`flex flex-col rounded-xl bg-[#191b26] hover:bg-[#1d1f2a] transition-all shadow-md group overflow-hidden border ${
                  isSelected ? 'border-[#4cd7f6]/60 shadow-[0_0_15px_rgba(76,215,246,0.15)]' : 'border-[#272935]'
                }`}
              >
                <div
                  className="relative w-full aspect-video bg-[#0b0e18] overflow-hidden cursor-pointer"
                  onClick={() => onSelectProject(proj)}
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={proj.title}
                    src={proj.imageUrl}
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0b0e18]/80 backdrop-blur font-['JetBrains_Mono'] text-[12px] text-[#e1e1f1] border border-[#272935]">
                    {proj.duration}
                  </span>
                  <span
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded backdrop-blur font-['JetBrains_Mono'] text-[10px] font-semibold border ${
                      idx % 3 === 0
                        ? 'bg-[#c0c1ff]/20 text-[#c0c1ff] border-[#c0c1ff]/30'
                        : idx % 3 === 1
                        ? 'bg-[#d0bcff]/20 text-[#d0bcff] border-[#d0bcff]/30'
                        : 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/30'
                    }`}
                  >
                    {proj.category}
                  </span>
                  {isSelected && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#4cd7f6] text-[#001f26] font-['JetBrains_Mono'] text-[9px] font-bold">
                      ACTIVE IN FLIGHT-DECK
                    </span>
                  )}
                </div>

                <div className="p-3.5 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex flex-col min-w-0 cursor-pointer"
                      onClick={() => onSelectProject(proj)}
                    >
                      <h4 className="font-['Geist'] text-[15px] font-semibold text-[#e1e1f1] truncate group-hover:text-[#4cd7f6] transition-colors">
                        {proj.title}
                      </h4>
                      <span className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                        {proj.createdAt} • {proj.spec.split('•')[0] || 'Lossless'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenRenameModal(proj)}
                      aria-label="Project actions"
                      className="text-[#c7c4d7] hover:text-[#e1e1f1] p-1 rounded hover:bg-[#272935] transition-colors cursor-pointer"
                      title="Edit project details"
                    >
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </div>

                  {/* Quick action bar */}
                  <div className="flex items-center justify-between pt-1 mt-auto border-t border-[#272935]/60">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectProject(proj)}
                        className="px-2.5 py-1 rounded bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-['JetBrains_Mono'] text-[10px] transition-colors flex items-center gap-1 cursor-pointer border border-[#373845]"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Open
                      </button>

                      {idx % 2 === 0 ? (
                        <button
                          type="button"
                          onClick={() => onDuplicateProject(proj)}
                          className="px-2.5 py-1 rounded bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-['JetBrains_Mono'] text-[10px] transition-colors flex items-center gap-1 cursor-pointer border border-[#373845]"
                        >
                          <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          Duplicate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenRenameModal(proj)}
                          className="px-2.5 py-1 rounded bg-[#272935] hover:bg-[#373845] text-[#e1e1f1] font-['JetBrains_Mono'] text-[10px] transition-colors flex items-center gap-1 cursor-pointer border border-[#373845]"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            drive_file_rename_outline
                          </span>
                          Rename
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteProject(proj.id)}
                        className="px-2 py-1 rounded hover:bg-[#ffb4ab]/20 text-[#c7c4d7] hover:text-[#ffb4ab] font-['JetBrains_Mono'] text-[10px] transition-colors cursor-pointer"
                        title="Delete edit"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onReExportProject(proj)}
                      className="text-[#4cd7f6] hover:underline font-['JetBrains_Mono'] text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Re-export
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Streamlined List View */
        <div className="flex flex-col gap-2">
          {filteredProjects.map((proj) => {
            const isSelected = activeProjectId === proj.id;
            return (
              <div
                key={proj.id}
                className={`flex items-center justify-between p-3 rounded-xl bg-[#191b26] hover:bg-[#1d1f2a] transition-all border ${
                  isSelected ? 'border-[#4cd7f6] bg-[#1d1f2a]' : 'border-[#272935]'
                }`}
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                  onClick={() => onSelectProject(proj)}
                >
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-16 h-10 object-cover rounded-lg shrink-0 border border-[#272935]"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[#e1e1f1] truncate">
                      {proj.title}
                    </span>
                    <span className="text-[11px] text-[#c7c4d7]">
                      {proj.category} • {proj.duration} • {proj.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="px-2.5 py-1 text-xs rounded bg-[#272935] hover:bg-[#373845] text-[#e1e1f1]"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => onDuplicateProject(proj)}
                    className="px-2.5 py-1 text-xs rounded bg-[#272935] hover:bg-[#373845] text-[#e1e1f1]"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => onReExportProject(proj)}
                    className="px-2.5 py-1 text-xs rounded text-[#4cd7f6] hover:bg-[#4cd7f6]/10"
                  >
                    Re-export
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

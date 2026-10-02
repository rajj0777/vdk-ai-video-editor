import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface RenameModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (projectId: string, newTitle: string, newSpec: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
}) => {
  if (!isOpen || !project) return null;

  const [title, setTitle] = useState(project.title);
  const [spec, setSpec] = useState(project.spec);

  useEffect(() => {
    setTitle(project.title);
    setSpec(project.spec);
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(project.id, title.trim(), spec.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#191b26] border border-[#272935] shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#272935]">
          <h3 className="text-base font-semibold text-[#e1e1f1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              drive_file_rename_outline
            </span>
            Edit Project Metadata
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#c7c4d7] hover:text-[#e1e1f1] hover:bg-[#272935]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-[#c7c4d7] uppercase">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#11131e] border border-[#272935] text-[#e1e1f1] focus:outline-none focus:border-[#4cd7f6]"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-[#c7c4d7] uppercase">
              Technical Description & Specs
            </label>
            <textarea
              rows={3}
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#11131e] border border-[#272935] text-[#e1e1f1] focus:outline-none focus:border-[#4cd7f6] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#272935]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#272935] text-[#c7c4d7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#4cd7f6] text-[#001f26] hover:brightness-110"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

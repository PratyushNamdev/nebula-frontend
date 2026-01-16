// components/FolderTree.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";

interface TreeNode {
  _id: string;
  name: string;
  path: string;
  children: TreeNode[];
}

interface FolderTreeProps {
  folders: TreeNode[];
  currentPath: string;
}

// Persistent state management
const openFoldersState = new Set<string>();

function FolderNode({
  folder,
  currentPath,
}: {
  folder: TreeNode;
  currentPath: string;
}) {
  const [isOpen, setIsOpen] = useState(openFoldersState.has(folder._id));
  const hasChildren = folder.children.length > 0;
  const isActive = currentPath === folder.path;

  useEffect(() => {
    // Auto-open parent folders of active path
    if (currentPath.startsWith(folder.path) && folder.path !== currentPath) {
      setIsOpen(true);
      openFoldersState.add(folder._id);
    }
  }, [currentPath, folder.path, folder._id]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      openFoldersState.add(folder._id);
    } else {
      openFoldersState.delete(folder._id);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all group ${
          isActive
            ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/20"
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        {hasChildren && (
          <button
            onClick={toggleOpen}
            className="text-white/60 hover:text-cyan-400 transition-colors"
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        <Folder
          className={`w-4 h-4 ${
            isActive ? "text-cyan-400" : "text-white/60 group-hover:text-cyan-400"
          } transition-colors`}
        />
        <Link
          href={`/drive${folder.path === "/" ? "" : folder.path}`}
          className="flex-1 text-sm"
        >
          {folder.name}
        </Link>
      </div>

      {isOpen && hasChildren && (
        <div className="ml-4 border-l border-white/10">
          {folder.children.map((child) => (
            <FolderNode
              key={child._id}
              folder={child}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree({ folders, currentPath }: FolderTreeProps) {
  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <FolderNode
          key={folder._id}
          folder={folder}
          currentPath={currentPath}
        />
      ))}
    </div>
  );
}
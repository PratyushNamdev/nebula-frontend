// app/drive/[[...path]]/page.tsx
"use client";
import { use } from "react";
import { useGetProfile } from "@/services/profile";
import { useGetFolderByPath, useGetSubfolders } from "@/services/folders";
import { TopBar } from "./partials/Topbar";
import { FolderGrid } from "./partials/FolderGrid";
import { useFiles } from "@/services/files/hooks/useFiles";
import { FileGrid } from "./partials/FileGrid";

export default function DrivePage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const resolvedParams = use(params);
  const currentPath = resolvedParams.path
    ? `/${resolvedParams.path.join("/")}`
    : "/";

  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: folderData, isLoading: foldersLoading } = useGetFolderByPath(currentPath);
  const { data: subfolders, isLoading: subfoldersLoading } = useGetSubfolders(currentPath);

  // Get current folder ID, default to "root" if at root level
  const currentFolderId = folderData?._id || "root";
  
  // Fetch files for the current folder
  const { data: filesData, isLoading: filesLoading } = useFiles({
    folderId: currentFolderId,
  });

  const isLoading = profileLoading || foldersLoading || subfoldersLoading || filesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  const hasContent = 
    (subfolders?.folders?.length ?? 0) > 0 || 
    (filesData?.files?.length ?? 0) > 0;

  return (
    <div className="h-full flex flex-col bg-white/2 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex-1">
        <TopBar />

        <div className="space-y-8 mt-6 h-full">
          {/* Folders Grid */}
          {subfolders?.folders && subfolders.folders.length > 0 && (
            <FolderGrid folders={subfolders.folders} />
          )}

          {/* Files Grid */}
          {filesData?.files && filesData.files.length > 0 && (
            <FileGrid files={filesData.files} />
          )}
        </div>

        {/* Empty State */}
        {!isLoading && !hasContent && (
          <div className="flex flex-col items-center justify-center h-96 text-white/40">
            <p className="text-lg">This folder is empty</p>
            <p className="text-sm">
              Create a new folder or upload files to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
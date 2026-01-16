"use client";
import Image from "next/image";
import {
  FileText,
  Film,
  Music,
  FileImage,
  File as FileIcon,
  Star,
} from "lucide-react";
import { FileDto } from "@/services/files";
interface FileGridProps {
  files: FileDto[];
}

// Helper to get file icon based on mime type
function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <FileImage className="h-8 w-8" />;
  if (mimeType.startsWith("video/")) return <Film className="h-8 w-8" />;
  if (mimeType.startsWith("audio/")) return <Music className="h-8 w-8" />;
  if (mimeType.includes("pdf") || mimeType.includes("document"))
    return <FileText className="h-8 w-8" />;
  return <FileIcon className="h-8 w-8" />;
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

export function FileGrid({ files }: FileGridProps) {
  if (files.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">Files</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {files.map((file) => (
          <div
            key={file._id}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl"
          >
            {/* Decorative glow on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-blue-400/0 via-purple-400/0 to-pink-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />

            {/* Thumbnail/Preview */}
            <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
              {file.thumbnail ? (
                <Image
                  src={file.thumbnail}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  {getFileIcon(file.mimeType)}
                </div>
              )}

              {/* File Type Badge */}
              <div className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm">
                {getFileIcon(file.mimeType)}
              </div>

              {/* Star Icon */}
              {file.starred && (
                <div className="absolute left-2 top-2 rounded-md bg-yellow-400/90 p-1.5 shadow-sm backdrop-blur-sm">
                  <Star className="h-4 w-4 fill-white text-white" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex flex-col gap-1 p-3">
              <p className="truncate text-sm font-medium text-gray-800">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

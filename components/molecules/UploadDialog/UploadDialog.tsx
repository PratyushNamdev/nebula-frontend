// components/molecules/UploadDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useUpload } from "@/services/upload/hooks";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  folderPath: string;
  userId: string;
}

export function UploadDialog({
  open,
  onOpenChange,
  folderId,
  folderPath,
  userId,
}: UploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { uploadFile, isUploading, progress, currentFile } = useUpload({
    folderId,
    folderPath,
    userId,
    onSuccess: () => {
      // Clear selected files after successful upload
      setSelectedFiles([]);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      await uploadFile(file);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 bg-slate-900/95 border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Files
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select files to upload to {folderPath || "/"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          {!isUploading && (
            <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-12 h-12 text-cyan-400" />
                <p className="text-sm text-slate-300">
                  Click to select files or drag and drop
                </p>
                <p className="text-xs text-slate-500">Maximum file size: 5GB</p>
              </label>
            </div>
          )}

          {/* Selected Files List */}
          {selectedFiles.length > 0 && !isUploading && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">
                {selectedFiles.length} file(s) selected
              </p>
              <div className="max-h-50 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileIcon className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-200 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && progress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">
                  Uploading: {currentFile}
                </p>
                <p className="text-sm text-cyan-400">{progress.progress}%</p>
              </div>
              <Progress value={progress.progress} className="h-2" />
              <p className="text-xs text-slate-500">{progress.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
              className="border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

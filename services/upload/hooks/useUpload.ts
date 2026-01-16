// services/upload/hooks/useUpload.ts
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileUploadService,
  UploadProgress,
  UploadResult,
} from "../upload-service";
import { toast } from "sonner";

interface UseUploadOptions {
  folderId: string;
  folderPath: string;
  userId: string;
  onSuccess?: (file: any) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: UploadProgress | null;
  currentFile: string | null;
}

export function useUpload(options: UseUploadOptions) {
  const { folderId, folderPath, userId, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: null,
    currentFile: null,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadState({
        isUploading: true,
        progress: {
          stage: "preparing",
          progress: 0,
          message: "Starting upload...",
        },
        currentFile: file.name,
      });

      const uploadService = new FileUploadService((progress) => {
        setUploadState((prev) => ({
          ...prev,
          progress,
        }));
      });

      const result = await uploadService.uploadFile(
        file,
        folderId,
        folderPath,
        userId
      );

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      return result.file;
    },
    onSuccess: (data) => {
      // Invalidate queries to refetch files and storage data
      queryClient.invalidateQueries({ queryKey: ["files", folderId] });
      queryClient.invalidateQueries({ queryKey: ["storage", userId] });

      toast.success(
        `${uploadState.currentFile} has been uploaded successfully.`
      );

      setUploadState({
        isUploading: false,
        progress: null,
        currentFile: null,
      });

      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload file. Please try again.");

      setUploadState({
        isUploading: false,
        progress: null,
        currentFile: null,
      });

      onError?.(error.message);
    },
  });

  // Upload single file
  const uploadFile = (file: File) => {
    // Validate file
    const uploadService = new FileUploadService();

    if (!uploadService.validateFileSize(file)) {
      toast.warning("File size exceeds the maximum allowed limit.");
      return;
    }

    uploadMutation.mutate(file);
  };

  // Upload multiple files sequentially
  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      await uploadMutation.mutateAsync(file);
    }
  };

  // Cancel upload (note: this won't stop the actual upload to B2, just the UI state)
  const cancelUpload = () => {
    setUploadState({
      isUploading: false,
      progress: null,
      currentFile: null,
    });
  };

  return {
    // State
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    currentFile: uploadState.currentFile,

    // Actions
    uploadFile,
    uploadFiles,
    cancelUpload,

    // Mutation state
    isError: uploadMutation.isError,
    error: uploadMutation.error,
  };
}

// Hook for batch uploads with queue management
export function useBatchUpload(options: UseUploadOptions) {
  const { folderId, folderPath, userId } = options;
  const queryClient = useQueryClient();

  const [queue, setQueue] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedUploads, setCompletedUploads] = useState<string[]>([]);
  const [failedUploads, setFailedUploads] = useState<
    { name: string; error: string }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: null,
    currentFile: null,
  });

  // Add files to queue
  const addToQueue = (files: File[]) => {
    setQueue((prev) => [...prev, ...files]);
  };

  // Clear queue
  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
    setCompletedUploads([]);
    setFailedUploads([]);
    setIsProcessing(false);
  };

  // Process queue
  const processQueue = async () => {
    if (queue.length === 0 || isProcessing) return;

    setIsProcessing(true);

    for (let i = currentIndex; i < queue.length; i++) {
      const file = queue[i];
      setCurrentIndex(i);
      setUploadState({
        isUploading: true,
        progress: {
          stage: "preparing",
          progress: 0,
          message: "Starting upload...",
        },
        currentFile: file.name,
      });

      try {
        const uploadService = new FileUploadService((progress) => {
          setUploadState((prev) => ({
            ...prev,
            progress,
          }));
        });

        const result = await uploadService.uploadFile(
          file,
          folderId,
          folderPath,
          userId
        );

        if (result.success) {
          setCompletedUploads((prev) => [...prev, file.name]);
        } else {
          setFailedUploads((prev) => [
            ...prev,
            { name: file.name, error: result.error || "Unknown error" },
          ]);
        }
      } catch (error: any) {
        setFailedUploads((prev) => [
          ...prev,
          { name: file.name, error: error.message || "Upload failed" },
        ]);
      }
    }

    // All done
    setUploadState({
      isUploading: false,
      progress: null,
      currentFile: null,
    });
    setIsProcessing(false);

    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ["files", folderId] });
    queryClient.invalidateQueries({ queryKey: ["storage", userId] });

    // Show summary toast
    toast.success(
      `${completedUploads.length} file(s) uploaded successfully. ${failedUploads.length} failed.`
    );
  };

  return {
    // Queue state
    queue,
    currentIndex,
    totalFiles: queue.length,
    completedUploads,
    failedUploads,
    isProcessing,

    // Current upload state
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    currentFile: uploadState.currentFile,

    // Actions
    addToQueue,
    clearQueue,
    processQueue,
  };
}

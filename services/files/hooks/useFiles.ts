// services/files/hooks/useFiles.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import filesService from "../files"; // ✅ Fixed: Changed from '../files.service' to '../files'
import { toast } from "sonner";
import {
  GetFilesDto,
  GetFileByIdDto,
  UpdateFileDto,
  DeleteFileDto,
  GetRecentFilesDto,
} from "../dto/req/get-files.dto";

/**
 * Get files in a folder
 */
export function useFiles(params: GetFilesDto) {
  return useQuery({
    queryKey: ["files", params.folderId],
    queryFn: () => filesService.getFiles(params),
    enabled: !!params.folderId,
  });
}

/**
 * Get a specific file by ID
 */
export function useFile(params: GetFileByIdDto) {
  return useQuery({
    queryKey: ["file", params.id],
    queryFn: () => filesService.getFileById(params),
    enabled: !!params.id,
  });
}

/**
 * Get starred files
 */
export function useStarredFiles() {
  return useQuery({
    queryKey: ["files", "starred"],
    queryFn: () => filesService.getStarredFiles(),
  });
}

/**
 * Get recent files
 */
export function useRecentFiles(params?: GetRecentFilesDto) {
  return useQuery({
    queryKey: ["files", "recent", params?.limit],
    queryFn: () => filesService.getRecentFiles(params),
  });
}

/**
 * Get trash files
 */
export function useTrashFiles() {
  return useQuery({
    queryKey: ["files", "trash"],
    queryFn: () => filesService.getTrashFiles(),
  });
}

/**
 * Update file (rename, move)
 */
export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateFileDto) => filesService.updateFile(params),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["file", data._id] });
      toast.success("File updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update file");
    },
  });
}

/**
 * Toggle star status
 */
export function useToggleStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => filesService.toggleStar(fileId),
    onSuccess: (data, fileId) => {
      // Invalidate file queries
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["file", fileId] });
      
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle star");
    },
  });
}

/**
 * Delete file
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteFileDto) => filesService.deleteFile(params),
    onSuccess: (data, params) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["file", params.id] });
      
      if (params.permanent) {
        queryClient.invalidateQueries({ queryKey: ["files", "trash"] });
      }
      
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete file");
    },
  });
}

/**
 * Restore file
 */
export function useRestoreFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => filesService.restoreFile(fileId),
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["files", "trash"] });
      
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restore file");
    },
  });
}
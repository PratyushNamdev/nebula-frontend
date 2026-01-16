// services/files/files.service.ts
import API from "../instance";
import { UploadFileDto } from "./dto/req/upload-file.dto";
import {
  GetFilesDto,
  GetFileByIdDto,
  UpdateFileDto,
  DeleteFileDto,
  GetRecentFilesDto,
} from "./dto/req/get-files.dto";
import {
  FilesListResponseDto,
  FileDto,
  UploadFileResponseDto,
  FileActionResponseDto,
} from "./dto/res/file.dto";

class FilesService {
  /**
   * Upload file metadata to backend
   * POST /api/files
   */
  async uploadFile(payload: UploadFileDto): Promise<UploadFileResponseDto> {
    const { data } = await API.post("/files", {
      name: payload.name,
      originalName: payload.originalName,
      path: payload.path,
      size: payload.size,
      mimeType: payload.mimeType,
      extension: payload.extension,
      folderId: payload.folderId,
      backblazeKey: payload.backblazeKey,
      backblazeFileId: payload.backblazeFileId,
      backblazeUrl: payload.backblazeUrl,
      thumbnail: payload.preview || null,
      metadata: payload.metadata || {},
    });
    return data;
  }

  /**
   * Get all files in a folder
   * GET /api/files?folderId=xyz
   */
  async getFiles(params: GetFilesDto): Promise<FilesListResponseDto> {
    const { data } = await API.get("/files", {
      params: { folderId: params.folderId },
    });
    return data;
  }

  /**
   * Get a specific file by ID
   * GET /api/files/:id
   */
  async getFileById(params: GetFileByIdDto): Promise<FileDto> {
    const { data } = await API.get(`/files/${params.id}`);
    return data;
  }

  /**
   * Get all starred files
   * GET /api/files/starred
   */
  async getStarredFiles(): Promise<FilesListResponseDto> {
    const { data } = await API.get("/files/starred");
    return data;
  }

  /**
   * Get recent files
   * GET /api/files/recent
   */
  async getRecentFiles(
    params?: GetRecentFilesDto
  ): Promise<FilesListResponseDto> {
    const { data } = await API.get("/files/recent", {
      params: { limit: params?.limit },
    });
    return data;
  }

  /**
   * Get trash files
   * GET /api/files/trash
   */
  async getTrashFiles(): Promise<FilesListResponseDto> {
    const { data } = await API.get("/files/trash");
    return data;
  }

  /**
   * Update file (rename, move)
   * PUT /api/files/:id
   */
  async updateFile(params: UpdateFileDto): Promise<FileDto> {
    const { id, ...payload } = params;
    const { data } = await API.put(`/files/${id}`, payload);
    return data;
  }

  /**
   * Toggle star status
   * PATCH /api/files/:id/star
   */
  async toggleStar(fileId: string): Promise<FileActionResponseDto> {
    const { data } = await API.patch(`/files/${fileId}/star`);
    return data;
  }

  /**
   * Delete file (soft or permanent)
   * DELETE /api/files/:id
   */
  async deleteFile(params: DeleteFileDto): Promise<FileActionResponseDto> {
    const { id, permanent = false } = params;
    const { data } = await API.delete(`/files/${id}`, {
      params: { permanent },
    });
    return data;
  }

  /**
   * Restore deleted file
   * POST /api/files/:id/restore
   */
  async restoreFile(fileId: string): Promise<FileActionResponseDto> {
    const { data } = await API.post(`/files/${fileId}/restore`);
    return data;
  }
}

export default new FilesService();
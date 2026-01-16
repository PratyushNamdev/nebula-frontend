// services/files/dto/req/get-files.dto.ts

export interface GetFilesDto {
  folderId: string;
}

export interface GetFileByIdDto {
  id: string;
}

export interface UpdateFileDto {
  id: string;
  name?: string;
  folderId?: string;
}

export interface DeleteFileDto {
  id: string;
  permanent?: boolean;
}

export interface GetRecentFilesDto {
  limit?: number;
}

// services/files/dto/res/file.dto.ts

export interface FileMetadataDto {
  width?: number;
  height?: number;
  duration?: number;
  pageCount?: number;
  thumbnail?: string;
}

export interface FileDto {
  _id: string;
  name: string;
  originalName: string;
  path: string;
  folderId: string;
  userId: string;
  backblazeKey: string;
  backblazeFileId: string;
  backblazeUrl: string;
  size: number;
  mimeType: string;
  extension: string;
  metadata?: FileMetadataDto;
  starred: boolean;
  shared: boolean;
  shareLink: string | null;
  preview: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface FilesListResponseDto {
  files: FileDto[];
  count: number;
}

export interface UploadFileResponseDto extends FileDto {}

export interface FileActionResponseDto {
  message: string;
  starred?: boolean;
  file?: FileDto;
}

// services/files/dto/req/upload-file.dto.ts
export interface UploadFileDto {
  name: string;
  originalName: string;
  path: string;
  folderId: string;
  backblazeKey: string;
  backblazeFileId: string;
  backblazeUrl: string;
  size: number;
  mimeType: string;
  extension: string;
  preview?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pageCount?: number;
  };
}

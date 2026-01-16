export interface GetPresignedUrlRequestDTO {
  fileName: string;
  fileSize: number;
  contentType: string;
  userId: string;
  folderPath: string;
}

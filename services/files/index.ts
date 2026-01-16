// services/files/index.ts

// Export service
export { default as filesService } from "./files";

// Export DTOs
export type { UploadFileDto } from "./dto/req/upload-file.dto";
export type { FileDto, UploadFileResponseDto } from "./dto/res/file.dto";

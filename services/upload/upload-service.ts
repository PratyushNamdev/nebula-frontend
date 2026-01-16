// services/upload/upload-service.ts
import { extractFileMetadata } from "@/lib/metadata-extractor";
import { generateVideoThumbnail } from "@/lib/video-thumbnail";
import { uploadViaBackend } from "@/lib/b2/upload-via-backend";
import filesService from "../files/files";

// Export interfaces
export interface UploadProgress {
  stage: "preparing" | "uploading" | "processing" | "saving" | "complete";
  progress: number;
  message: string;
}

export interface UploadResult {
  success: boolean;
  file?: any;
  error?: string;
}

export class FileUploadService {
  private onProgressCallback?: (progress: UploadProgress) => void;

  constructor(onProgress?: (progress: UploadProgress) => void) {
    this.onProgressCallback = onProgress;
  }

  private updateProgress(
    stage: UploadProgress["stage"],
    progress: number,
    message: string
  ) {
    if (this.onProgressCallback) {
      this.onProgressCallback({ stage, progress, message });
    }
  }

  /**
   * Main upload function
   */
  async uploadFile(
    file: File,
    folderId: string,
    folderPath: string,
    userId: string
  ): Promise<UploadResult> {
    try {
      // Stage 1: Preparing
      this.updateProgress("preparing", 10, "Preparing file...");

      // Validate file
      if (!file || file.size === 0) {
        throw new Error("Invalid file");
      }

      // Extract file info
      const extension = this.extractExtension(file.name);
      const fileType = this.getFileType(file.type);

      // Stage 2: Extract metadata
      this.updateProgress("preparing", 30, "Extracting metadata...");
      const metadata = await extractFileMetadata(file);

      // Stage 3: Upload to Backblaze via backend
      this.updateProgress("uploading", 0, "Uploading to cloud...");

      const uploadResult = await uploadViaBackend({
        file,
        folderPath,
        onProgress: (uploadProgress) => {
          this.updateProgress(
            "uploading",
            uploadProgress,
            `Uploading... ${uploadProgress}%`
          );
        },
      });

      // Stage 4: Process and save metadata
      this.updateProgress("processing", 90, "Processing file...");

      // Prepare data to send to backend
      const fileData = {
        name: file.name,
        originalName: file.name, // ✅ Added - same as name initially
        path: folderPath, // ✅ This is the folder path like "/projects/nebula"
        folderId,
        backblazeKey: uploadResult.backblazeKey, // ✅ This comes from backend
        backblazeFileId: uploadResult.fileId, // ✅ This comes from backend
        backblazeUrl: uploadResult.downloadUrl, // ✅ This comes from backend
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        extension,
        metadata,
        fileType,
      };

      // Stage 5: Save file metadata to database
      this.updateProgress("saving", 95, "Saving file information...");

      let savedFile;
      if (fileType === "image") {
        // For images, use the Backblaze URL as preview
        savedFile = await this.saveFile({
          ...fileData,
          preview: uploadResult.downloadUrl,
        });
      } else {
        // For other files, no preview needed (can be added later)
        savedFile = await this.saveFile(fileData);
      }

      // Stage 6: Complete
      this.updateProgress("complete", 100, "Upload complete!");

      return {
        success: true,
        file: savedFile,
      };
    } catch (error: any) {
      console.error("Upload failed:", error);
      return {
        success: false,
        error: error.message || "Upload failed",
      };
    }
  }

  /**
   * Save file metadata to backend
   */
  private async saveFile(fileData: any) {
    return await filesService.uploadFile(fileData);
  }

  /**
   * Extract file extension
   */
  private extractExtension(fileName: string): string {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  }

  /**
   * Get file type category based on MIME type
   */
  private getFileType(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType === "application/pdf") return "pdf";
    if (
      mimeType.includes("document") ||
      mimeType.includes("word") ||
      mimeType.includes("text")
    ) {
      return "document";
    }
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      return "spreadsheet";
    }
    if (
      mimeType.includes("zip") ||
      mimeType.includes("rar") ||
      mimeType.includes("7z")
    ) {
      return "archive";
    }
    return "other";
  }

  /**
   * Validate file size (optional)
   */
  validateFileSize(
    file: File,
    maxSize: number = 5 * 1024 * 1024 * 1024
  ): boolean {
    // Default 5GB limit
    return file.size <= maxSize;
  }

  /**
   * Validate file type (optional)
   */
  validateFileType(file: File, allowedTypes?: string[]): boolean {
    if (!allowedTypes || allowedTypes.length === 0) return true;
    return allowedTypes.some((type) => file.type.startsWith(type));
  }
}

/**
 * Convenience function for single file upload
 */
export async function uploadFile(
  file: File,
  folderId: string,
  folderPath: string,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const uploadService = new FileUploadService(onProgress);
  return uploadService.uploadFile(file, folderId, folderPath, userId);
}

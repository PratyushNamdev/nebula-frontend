// lib/b2/presigned-upload.ts
import axios from "axios";
import API from "@/services/instance";

interface PresignedUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
  backblazeKey: string;
  downloadUrl: string;
}

interface UploadResult {
  fileId: string;
  fileName: string;
  downloadUrl: string;
}

/**
 * Get presigned upload URL from backend
 */
export async function getPresignedUploadUrl(
  fileName: string,
  fileSize: number,
  contentType: string,
  userId: string,
  folderPath: string
): Promise<PresignedUrlResponse> {
  try {
    const { data } = await API.post<PresignedUrlResponse>(
      "/upload/get-presigned-url",
      {
        fileName,
        fileSize,
        contentType,
        userId,
        folderPath,
      }
    );

    return data;
  } catch (error) {
    console.error("Failed to get presigned URL:", error);
    throw new Error("Failed to get upload URL from server");
  }
}

/**
 * Upload file directly to B2 using presigned URL
 */
export async function uploadWithPresignedUrl(
  file: File,
  presignedData: PresignedUrlResponse,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    const response = await axios.post(presignedData.uploadUrl, file, {
      headers: {
        Authorization: presignedData.authorizationToken,
        "X-Bz-File-Name": encodeURIComponent(presignedData.backblazeKey),
        "Content-Type": file.type || "application/octet-stream",
        "X-Bz-Content-Sha1": "do_not_verify",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return {
      fileId: response.data.fileId,
      fileName: presignedData.backblazeKey,
      downloadUrl: presignedData.downloadUrl,
    };
  } catch (error) {
    console.error("Upload to B2 failed:", error);
    throw new Error("Failed to upload file to storage");
  }
}

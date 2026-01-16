// lib/b2/upload-to-b2.ts
import axios from "axios";

interface B2UploadParams {
  file: File;
  uploadUrl: string;
  authToken: string;
  backblazeKey: string;
  onProgress?: (progress: number) => void;
}

interface B2UploadResult {
  fileId: string;
  fileName: string;
}

/**
 * Upload file to B2 using Native API
 */
export async function uploadToB2(
  params: B2UploadParams
): Promise<B2UploadResult> {
  const { file, uploadUrl, authToken, backblazeKey, onProgress } = params;

  try {
    const response = await axios.post(uploadUrl, file, {
      headers: {
        Authorization: authToken,
        "X-Bz-File-Name": encodeURIComponent(backblazeKey),
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
      fileName: backblazeKey,
    };
  } catch (error: any) {
    console.error("Upload to B2 failed:", error.response?.data || error);
    throw new Error("Failed to upload file to storage");
  }
}

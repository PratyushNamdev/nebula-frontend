// lib/b2/upload-via-backend.ts
import API from "@/services/instance";

interface UploadViaBackendParams {
  file: File;
  folderPath: string;
  onProgress?: (progress: number) => void;
}

interface UploadViaBackendResult {
  fileId: string;
  backblazeKey: string;
  downloadUrl: string;
}

export async function uploadViaBackend(
  params: UploadViaBackendParams
): Promise<UploadViaBackendResult> {
  const { file, folderPath, onProgress } = params;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderPath", folderPath);
  formData.append("fileName", file.name);
  formData.append("contentType", file.type || "application/octet-stream");

  const { data } = await API.post("/upload/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
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

  return data;
}

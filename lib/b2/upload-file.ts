import axios from 'axios';
import { getB2UploadUrl } from './get-upload-url';
import { B2_CONFIG } from '../b2-config';
import { authorizeB2 } from './authorize';

interface B2UploadResult {
  fileId: string;
  fileName: string;
  downloadUrl: string;
}

export async function uploadToB2(
  file: File,
  backblazeKey: string,
  onProgress?: (progress: number) => void
): Promise<B2UploadResult> {
  try {
    // Get upload URL and token
    const { uploadUrl, authorizationToken } = await getB2UploadUrl();

    // Get auth for download URL
    const auth = await authorizeB2();

    // Upload file
    const response = await axios.post(uploadUrl, file, {
      headers: {
        Authorization: authorizationToken,
        'X-Bz-File-Name': encodeURIComponent(backblazeKey),
        'Content-Type': file.type || 'application/octet-stream',
        'X-Bz-Content-Sha1': 'do_not_verify', // Skip SHA1 verification for speed
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

    const fileId = response.data.fileId;
    const downloadUrl = `${auth.downloadUrl}/file/${B2_CONFIG.bucketName}/${backblazeKey}`;

    return {
      fileId,
      fileName: backblazeKey,
      downloadUrl,
    };
  } catch (error) {
    console.error('Failed to upload to B2:', error);
    throw new Error('Failed to upload file to Backblaze B2');
  }
}
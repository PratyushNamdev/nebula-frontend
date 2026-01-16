import axios from "axios";
import { authorizeB2 } from "./authorize";
import { B2_CONFIG } from "../b2-config";

interface B2UploadUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
}

export async function getB2UploadUrl(): Promise<B2UploadUrlResponse> {
  try {
    // First authorize
    const auth = await authorizeB2();

    // Get upload URL
    const response = await axios.post(
      `${auth.apiUrl}/b2api/v2/b2_get_upload_url`,
      {
        bucketId: B2_CONFIG.bucketId,
      },
      {
        headers: {
          Authorization: auth.authorizationToken,
        },
      }
    );

    return {
      uploadUrl: response.data.uploadUrl,
      authorizationToken: response.data.authorizationToken,
    };
  } catch (error) {
    console.error("Failed to get B2 upload URL:", error);
    throw new Error("Failed to get upload URL from Backblaze B2");
  }
}

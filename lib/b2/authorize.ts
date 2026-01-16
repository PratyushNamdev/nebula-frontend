// lib/b2/authorize.ts
import axios from "axios";
import { B2_CONFIG } from "../b2-config";

interface B2AuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
  recommendedPartSize: number;
}

let cachedAuth: B2AuthResponse | null = null;
let authExpiry: number = 0;

export async function authorizeB2(): Promise<B2AuthResponse> {
  // Return cached auth if still valid (expires after 23 hours, we cache for 22)
  if (cachedAuth && Date.now() < authExpiry) {
    return cachedAuth;
  }

  try {
    const response = await axios.get(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {
        auth: {
          username: B2_CONFIG.applicationKeyId,
          password: B2_CONFIG.applicationKey,
        },
      }
    );

    cachedAuth = {
      authorizationToken: response.data.authorizationToken,
      apiUrl: response.data.apiUrl,
      downloadUrl: response.data.downloadUrl,
      recommendedPartSize: response.data.recommendedPartSize,
    };

    // Cache for 22 hours (token valid for 24 hours)
    authExpiry = Date.now() + 22 * 60 * 60 * 1000;

    return cachedAuth;
  } catch (error) {
    console.error("Backblaze authorization failed:", error);
    throw new Error("Failed to authorize with Backblaze B2");
  }
}

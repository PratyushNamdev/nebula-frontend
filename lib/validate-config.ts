import { B2_CONFIG } from "./b2-config";

export function validateB2Config() {
  const required = [
    "applicationKeyId",
    "applicationKey",
    "bucketId",
    "bucketName",
  ];

  const missing = required.filter(
    (key) => !B2_CONFIG[key as keyof typeof B2_CONFIG]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required Backblaze B2 configuration: ${missing.join(", ")}`
    );
  }

  console.log("✅ Backblaze B2 configuration is valid");
  return true;
}

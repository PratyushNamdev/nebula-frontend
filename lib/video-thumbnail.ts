// lib/video-thumbnail.ts

export async function generateVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    video.preload = "metadata";

    video.onloadedmetadata = () => {
      // Seek to 1 second or 10% of video duration
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      // Set canvas size (max 800px width, maintain aspect ratio)
      const maxWidth = 800;
      const scale = maxWidth / video.videoWidth;
      canvas.width = video.videoWidth > maxWidth ? maxWidth : video.videoWidth;
      canvas.height =
        video.videoHeight * (video.videoWidth > maxWidth ? scale : 1);

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to generate thumbnail"));
          }
          URL.revokeObjectURL(video.src);
        },
        "image/jpeg",
        0.8 // Quality
      );
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Failed to load video"));
    };

    video.src = URL.createObjectURL(file);
  });
}

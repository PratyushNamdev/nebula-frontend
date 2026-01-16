interface ImageMetadata {
  width: number;
  height: number;
}

interface VideoMetadata {
  duration: number;
  width?: number;
  height?: number;
}

interface AudioMetadata {
  duration: number;
}

interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  pageCount?: number;
}

export async function extractFileMetadata(file: File): Promise<FileMetadata> {
  const metadata: FileMetadata = {};

  try {
    if (file.type.startsWith('image/')) {
      const imageData = await extractImageMetadata(file);
      metadata.width = imageData.width;
      metadata.height = imageData.height;
    } else if (file.type.startsWith('video/')) {
      const videoData = await extractVideoMetadata(file);
      metadata.duration = videoData.duration;
      metadata.width = videoData.width;
      metadata.height = videoData.height;
    } else if (file.type.startsWith('audio/')) {
      const audioData = await extractAudioMetadata(file);
      metadata.duration = audioData.duration;
    }
    // For PDFs and documents, we'll extract pageCount on backend
    // For other files (zip, etc), no metadata needed
  } catch (error) {
    console.warn('Failed to extract metadata:', error);
    // Return empty metadata instead of failing
  }

  return metadata;
}

async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      resolve({
        duration: Math.round(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
      });
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video'));
    };

    video.src = URL.createObjectURL(file);
  });
}

async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      resolve({
        duration: Math.round(audio.duration),
      });
      URL.revokeObjectURL(audio.src);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      reject(new Error('Failed to load audio'));
    };

    audio.src = URL.createObjectURL(file);
  });
}
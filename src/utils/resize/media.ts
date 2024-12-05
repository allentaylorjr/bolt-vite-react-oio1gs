import { getDocumentHeight } from './dimensions';
import { sendResizeMessage } from './messaging';
import { RESIZE_DEBOUNCE_MS } from './constants';

export function setupMediaListeners(): () => void {
  let timeout: number;
  const mediaElements: Array<HTMLImageElement | HTMLVideoElement> = [];

  const handleMediaLoad = () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      const height = getDocumentHeight();
      sendResizeMessage(height);
    }, RESIZE_DEBOUNCE_MS);
  };

  // Handle images
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', handleMediaLoad);
      mediaElements.push(img);
    }
  });

  // Handle videos
  document.querySelectorAll('video').forEach(video => {
    if (!video.readyState >= 1) {
      video.addEventListener('loadedmetadata', handleMediaLoad);
      mediaElements.push(video);
    }
  });

  // Return cleanup function
  return () => {
    window.clearTimeout(timeout);
    mediaElements.forEach(element => {
      if (element instanceof HTMLImageElement) {
        element.removeEventListener('load', handleMediaLoad);
      } else if (element instanceof HTMLVideoElement) {
        element.removeEventListener('loadedmetadata', handleMediaLoad);
      }
    });
  };
}
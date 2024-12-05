import { getDocumentHeight } from './dimensions';
import { sendResizeMessage } from './messaging';
import { RESIZE_DEBOUNCE_MS } from './constants';

export function createResizeObserver(): ResizeObserver {
  let timeout: number;

  return new ResizeObserver((entries) => {
    // Check if size actually changed
    const hasHeightChange = entries.some(entry => {
      const previousHeight = entry.target.clientHeight;
      const currentHeight = entry.contentRect.height;
      return Math.abs(previousHeight - currentHeight) > 1;
    });

    if (!hasHeightChange) return;

    // Debounce resize events
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      const height = getDocumentHeight();
      sendResizeMessage(height);
    }, RESIZE_DEBOUNCE_MS);
  });
}
import { getDocumentHeight } from './dimensions';
import { sendResizeMessage } from './messaging';
import { RESIZE_DEBOUNCE_MS } from './constants';

export function createMutationObserver(): MutationObserver {
  let timeout: number;

  return new MutationObserver(() => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      const height = getDocumentHeight();
      sendResizeMessage(height);
    }, RESIZE_DEBOUNCE_MS);
  });
}
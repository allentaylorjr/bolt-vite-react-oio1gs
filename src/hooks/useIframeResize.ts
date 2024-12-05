import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createResizeObserver } from '../utils/resize/observer';
import { createMutationObserver } from '../utils/resize/mutation';
import { setupMediaListeners } from '../utils/resize/media';
import { getDocumentHeight } from '../utils/resize/dimensions';
import { sendResizeMessage } from '../utils/resize/messaging';
import { INITIAL_RESIZE_DELAY_MS } from '../utils/resize/constants';

export function useIframeResize() {
  const location = useLocation();

  useEffect(() => {
    // Create observers
    const resizeObserver = createResizeObserver();
    const mutationObserver = createMutationObserver();

    // Observe document elements
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    // Observe DOM changes
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    // Setup media listeners
    const cleanupMediaListeners = setupMediaListeners();

    // Send initial height after a small delay to ensure content is rendered
    setTimeout(() => {
      const height = getDocumentHeight();
      sendResizeMessage(height);
    }, INITIAL_RESIZE_DELAY_MS);

    // Handle route changes
    if (location.pathname) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        const height = getDocumentHeight();
        sendResizeMessage(height);
      }, INITIAL_RESIZE_DELAY_MS);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      cleanupMediaListeners();
    };
  }, [location.pathname]);
}
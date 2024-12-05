import { isResizeMessage } from './resize/messaging';
import { setIframeHeight } from './resize/dimensions';

export function initializeIframeResizer(iframeSelector: string): () => void {
  const handleResize = (event: MessageEvent) => {
    if (!isResizeMessage(event)) return;

    const iframe = document.querySelector(iframeSelector) as HTMLIFrameElement;
    if (!iframe) return;

    setIframeHeight(iframe, event.data.height);
  };

  window.addEventListener('message', handleResize);

  return () => {
    window.removeEventListener('message', handleResize);
    const iframe = document.querySelector(iframeSelector) as HTMLIFrameElement;
    if (iframe) {
      iframe.style.cssText = '';
    }
  };
}
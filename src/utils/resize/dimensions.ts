export function getDocumentHeight(): number {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}

export function setIframeHeight(iframe: HTMLIFrameElement, height: number) {
  Object.assign(iframe.style, {
    width: '100%',
    height: `${height}px`,
    border: 'none',
    overflow: 'hidden'
  });
}
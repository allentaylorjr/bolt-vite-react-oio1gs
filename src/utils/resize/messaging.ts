import { RESIZE_MESSAGE_TYPE } from './constants';

export function sendResizeMessage(height: number) {
  window.parent.postMessage(
    { type: RESIZE_MESSAGE_TYPE, height },
    '*'
  );
}

export function isResizeMessage(event: MessageEvent): boolean {
  return event.data?.type === RESIZE_MESSAGE_TYPE;
}
import { IFrameComponent } from 'iframe-resizer';

export const iframeResizerConfig: IFrameComponent['props'] = {
  log: false,
  checkOrigin: false,
  heightCalculationMethod: 'documentElementOffset',
  scrolling: false,
  sizeWidth: false
};
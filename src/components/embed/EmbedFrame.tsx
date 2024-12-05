import React, { useEffect, useRef } from 'react';
import { iframeResizer } from 'iframe-resizer';
import { iframeResizerConfig } from '../../utils/iframe/config';

interface EmbedFrameProps {
  src: string;
  title: string;
  className?: string;
}

const EmbedFrame: React.FC<EmbedFrameProps> = ({ src, title, className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const cleanupFn = iframeResizer({
        ...iframeResizerConfig
      }, iframeRef.current)[0].iFrameResizer.removeListeners;

      return () => {
        if (cleanupFn) cleanupFn();
      };
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      width="100%"
      style={{ border: 0, minHeight: 0 }}
      className={className}
      title={title}
      scrolling="no"
    />
  );
};

export default EmbedFrame;
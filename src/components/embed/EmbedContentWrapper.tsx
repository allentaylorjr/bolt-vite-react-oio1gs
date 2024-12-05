import React, { useEffect } from 'react';
import 'iframe-resizer/js/iframeResizer.contentWindow';

interface EmbedContentWrapperProps {
  children: React.ReactNode;
}

const EmbedContentWrapper: React.FC<EmbedContentWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Force a resize calculation after initial render and route changes
    if (window.parentIFrame) {
      window.parentIFrame.size();
    }
  }, []);

  return <div className="min-h-screen">{children}</div>;
};

export default EmbedContentWrapper;
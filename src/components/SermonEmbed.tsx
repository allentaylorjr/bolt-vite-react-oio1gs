import React from 'react';
import EmbedFrame from './embed/EmbedFrame';

interface SermonEmbedProps {
  churchId: string;
  sermonId?: string;
  className?: string;
}

const SermonEmbed: React.FC<SermonEmbedProps> = ({ churchId, sermonId, className = '' }) => {
  const embedUrl = sermonId
    ? `/embed/${churchId}/sermon/${sermonId}`
    : `/embed/${churchId}/collection`;

  return (
    <EmbedFrame
      src={embedUrl}
      title={sermonId ? "Sermon Embed" : "Sermon Collection Embed"}
      className={className}
    />
  );
};

export default SermonEmbed;
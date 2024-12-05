import React, { useRef } from 'react';
import { Speaker } from '../../types/speaker';
import { Sermon } from '../../types/sermon';
import SpeakerHeader from './SpeakerHeader';
import ScrollControls from './ScrollControls';
import SermonCard from './SermonCard';

interface SpeakerCarouselProps {
  speaker: Speaker;
  sermons: Sermon[];
  onSermonClick: (sermon: Sermon) => void;
}

const SpeakerCarousel: React.FC<SpeakerCarouselProps> = ({ speaker, sermons, onSermonClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="bg-[#F2F2F2] rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <SpeakerHeader speaker={speaker} />
        <ScrollControls onScroll={handleScroll} />
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {sermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              sermon={sermon}
              onClick={() => onSermonClick(sermon)}
              variant="carousel"
            />
          ))}
        </div>
        <div 
          className="absolute top-0 bottom-0 pointer-events-none bg-gradient-to-l from-[#f2f2f2] to-transparent z-10"
          style={{ right: '-10px', width: '192px' }}
        />
      </div>
    </div>
  );
};

export default SpeakerCarousel;
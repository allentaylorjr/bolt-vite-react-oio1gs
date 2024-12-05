import React from 'react';

interface CirclePlayProps {
  className?: string;
  size?: number;
}

const CirclePlay: React.FC<CirclePlayProps> = ({ className = '', size = 24 }) => {
  return (
    <img
      src="https://link.storjshare.io/raw/jw7c2q2pi4iqqzntij4cfhzt7mcq/assets/play_13820683.svg"
      width={size}
      height={size}
      className={className}
      alt="Play"
    />
  );
};

export default CirclePlay;
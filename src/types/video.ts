export interface VideoEmbedConfig {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  [key: string]: boolean | string | undefined;
}

export interface VideoPlayerProps {
  url: string;
  title: string;
  config?: VideoEmbedConfig;
  onError?: (error: string) => void;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}
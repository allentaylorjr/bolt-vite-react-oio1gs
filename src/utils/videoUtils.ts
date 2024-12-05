import { storageConfig } from '../services/storage/config';

type VideoProvider = 'youtube' | 'vimeo' | 'direct' | null;

export function getVideoProvider(url: string): VideoProvider {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'youtube';
    }
    
    if (hostname.includes('vimeo.com')) {
      return 'vimeo';
    }

    if (hostname.includes('storjshare.io') || hostname.includes('gateway.storjshare.io')) {
      return 'direct';
    }

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.MOV'];
    const path = urlObj.pathname.toLowerCase();
    if (videoExtensions.some(ext => path.endsWith(ext))) {
      return 'direct';
    }
  } catch (error) {
    console.error('Invalid URL:', error);
  }
  
  return null;
}

export function extractVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('youtube.com')) {
      const searchParams = new URLSearchParams(urlObj.search);
      return searchParams.get('v');
    }

    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }

    if (urlObj.hostname.includes('vimeo.com')) {
      const matches = urlObj.pathname.match(/\/(\d+)(?:\/|\?|$)/);
      return matches ? matches[1] : null;
    }
  } catch (error) {
    console.error('Error parsing video URL:', error);
  }

  return null;
}

export function normalizeStorjUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'link.storjshare.io' && 
        urlObj.pathname.includes(storageConfig.linkShareKeys.videos)) {
      return url;
    }

    const parts = urlObj.pathname.split('/').filter(Boolean);
    let bucket, key;

    if (urlObj.hostname === 'gateway.storjshare.io') {
      [bucket, ...key] = parts;
    } else if (urlObj.hostname === 'link.storjshare.io') {
      // Skip the 'raw' part and any existing share key
      if (parts[0] === 'raw') parts.shift();
      if (parts[0] && parts[0].length === 32) parts.shift();
      [bucket, ...key] = parts;
    }

    if (!bucket || key.length === 0) {
      throw new Error('Invalid Storj URL format');
    }

    return `https://link.storjshare.io/raw/${storageConfig.linkShareKeys.videos}/${bucket}/${key.join('/')}`;
  } catch (error) {
    console.error('Error normalizing Storj URL:', error);
    return url;
  }
}
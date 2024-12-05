import { storageConfig } from '../storage/config';

export function getVideoType(url: string): 'youtube' | 'vimeo' | 'direct' | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      return 'youtube';
    }
    
    if (urlObj.hostname.includes('vimeo.com') || urlObj.hostname.includes('player.vimeo.com')) {
      return 'vimeo';
    }
    
    if (urlObj.hostname.includes('storjshare.io') || 
        urlObj.hostname.includes('gateway.storjshare.io') ||
        urlObj.hostname.includes('link.storjshare.io')) {
      return 'direct';
    }
    
    return null;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

export function getStorjVideoUrl(url: string): string {
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
      if (parts[0] === 'raw') parts.shift();
      if (parts[0] && parts[0].length === 32) parts.shift();
      [bucket, ...key] = parts;
    }
    
    if (!bucket || key.length === 0) {
      throw new Error('Invalid Storj URL format');
    }
    
    return `https://link.storjshare.io/raw/${storageConfig.linkShareKeys.videos}/${bucket}/${key.join('/')}`;
  } catch (error) {
    console.error('Error processing Storj URL:', error);
    return url;
  }
}
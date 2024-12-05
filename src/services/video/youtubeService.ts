export function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('youtube.com')) {
      return new URLSearchParams(urlObj.search).get('v');
    }
    
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }
    
    return null;
  } catch {
    return null;
  }
}
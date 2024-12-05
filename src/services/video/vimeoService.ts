/**
 * Extracts the video ID and hash from a Vimeo URL
 */
export function parseVimeoUrl(url: string): { videoId: string | null; hash: string | null } {
  try {
    const urlObj = new URL(url);
    
    // Handle standard Vimeo URLs
    const pathMatch = urlObj.pathname.match(/\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
    if (!pathMatch) return { videoId: null, hash: null };

    const videoId = pathMatch[1];
    let hash = pathMatch[2] || null;

    // Check for hash in query parameters
    if (!hash) {
      const params = new URLSearchParams(urlObj.search);
      const hParam = params.get('h');
      if (hParam) hash = hParam;
    }

    return { videoId, hash };
  } catch {
    return { videoId: null, hash: null };
  }
}

/**
 * Creates a properly formatted Vimeo embed URL
 */
export function createVimeoEmbedUrl(url: string): string | null {
  const { videoId, hash } = parseVimeoUrl(url);
  
  if (!videoId) return null;

  let embedUrl = `https://player.vimeo.com/video/${videoId}`;
  if (hash) embedUrl += `?h=${hash}`;

  // Add additional parameters
  const separator = hash ? '&' : '?';
  embedUrl += `${separator}api=1&autopause=0&player_id=0`;

  return embedUrl;
}
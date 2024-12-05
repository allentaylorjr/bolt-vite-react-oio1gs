export const storageConfig = {
  endpoint: 'https://gateway.storjshare.io',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'jx33ixog5iw6ar4du6trc6qbpgwq',
    secretAccessKey: import.meta.env.VITE_STORJ_SECRET_KEY
  },
  buckets: {
    sermonVideos: 'sermon-videos',
    sermonThumbnails: 'sermon-thumbnails',
    speakerProfiles: 'speaker-profiles',
    churchLogos: 'church-logos',
    seriesThumbnails: 'series-thumbnails'
  }
};
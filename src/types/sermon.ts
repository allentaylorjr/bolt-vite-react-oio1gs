export interface Sermon {
  id: string;
  church_id: string;
  title: string;
  description: string | null;
  speaker: {
    id: string;
    name: string;
  } | null;
  series: {
    id: string;
    name: string;
  } | null;
  video_url: string | null;
  thumbnail_url: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface SermonFormData {
  title: string;
  description?: string;
  speaker_id?: string;
  series_id?: string;
  date: string;
  videoFile?: File;
  videoUrl?: string;
  thumbnailFile?: File;
  thumbnail_url?: string;
}

export interface SermonError {
  code: string;
  message: string;
}
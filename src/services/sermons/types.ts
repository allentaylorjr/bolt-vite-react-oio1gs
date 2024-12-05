export interface SermonUpdateData {
  title?: string;
  description?: string;
  date?: string;
  speaker_id?: string | null;
  series_id?: string | null;
  video_url?: string;
  thumbnail_url?: string;
  updated_at?: string;
}

export interface SermonCreateData {
  church_id: string;
  title: string;
  description?: string;
  speaker_id?: string | null;
  series_id?: string | null;
  date: string;
  video_url?: string;
  thumbnail_url?: string;
}
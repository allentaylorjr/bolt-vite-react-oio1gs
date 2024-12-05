export interface Series {
  id: string;
  church_id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface SeriesFormData {
  name: string;
  description?: string;
  thumbnail_url?: string;
  thumbnailFile?: File;
}
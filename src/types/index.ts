export interface Sermon {
  id: string;
  church_id: string;
  title: string;
  description: string | null;
  speaker: string;
  series: string;
  video_url: string | null;
  date: string;
  created_at: string;
}

export interface Series {
  id: string;
  church_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Speaker {
  id: string;
  church_id: string;
  name: string;
  title: string | null;
  bio: string | null;
  created_at: string;
}

export interface Church {
  id: string;
  name: string;
  subdomain: string;
  logo_url: string | null;
  created_at: string;
}
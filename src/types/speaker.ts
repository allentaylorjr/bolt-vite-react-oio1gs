export interface Speaker {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  profile_picture_url?: string;
  church_id: string;
  created_at: string;
}

export interface SpeakerFormData {
  name: string;
  title?: string;
  bio?: string;
  profilePicture?: File;
  profile_picture_url?: string;
}
export interface Church {
  id: string;
  name: string;
  subdomain: string;
  logo_url?: string;
  description?: string;
  website?: string;
  primary_color?: string;
  button_text_color?: string;
  accent_color?: string;
  font_family?: string;
  created_at: string;
  updated_at: string;
}

export interface ChurchSettings {
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  primary_color: string;
  button_text_color: string;
  accent_color: string;
  font_family: string;
}
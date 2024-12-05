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

export interface SettingsUpdateResponse {
  success: boolean;
  error?: string;
}
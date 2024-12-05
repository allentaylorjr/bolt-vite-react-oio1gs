export interface RegistrationData {
  email: string;
  password: string;
  churchName: string;
  slug: string;
}

export interface ChurchData {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  primary_color: string;
  button_text_color: string;
  accent_color: string;
  font_family: string;
}
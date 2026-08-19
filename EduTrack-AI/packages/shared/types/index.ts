export interface User {
  id: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  createdAt: string;
}

export interface Profile {
  id: string;
  photo_url?: string;
  cover_image_url?: string;
  biography?: string;
  skills?: string[];
  achievements?: string[];
  interests?: string[];
  custom_preferences: Record<string, any>;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeSettings {
  user_id: string;
  mode: 'light' | 'dark' | 'system';
  accent_color: string;
  use_custom_fonts: boolean;
  reduce_animations: boolean;
}

export interface PrivacySettings {
  user_id: string;
  show_online_status: boolean;
  show_email: boolean;
  allow_data_collection: boolean;
  share_results_with_advisors: boolean;
}

export interface Device {
  id: string;
  user_id: string;
  device_name: string;
  device_type: string;
  browser?: string;
  ip_address?: string;
  last_active: string;
  is_trusted: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface OTPLog {
  id: string;
  user_id: string;
  contact_method: 'email' | 'sms';
  contact_value: string;
  code_hash: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

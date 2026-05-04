export interface TwitchUser {
  id: string;                // unique twitch user ID (not the same as username)
  login: string;             // username (lowercase)
  display_name: string;      // user's name as it appears on twitch
  profile_image_url: string; // for showing user's profile pic
  description?: string;
  type?: string;             // "staff", "admin", "global_mod", or ""
  broadcaster_type?: string; // "partner", "affiliate", or ""
  view_count?: number;
  created_at?: string;
}
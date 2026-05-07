export interface TwitchUser {
    id: string;                // unique twitch user ID (not the same as username)
    display_name: string;      // user's name as it appears on twitch
    profile_image_url: string; // for showing user's profile pic
    isAuthorized: boolean; // whether the user is authorized to use the app
    moderatedChannels: any[]; // list of channels the user moderates (fetched from Twitch API)
    

    // additional fields from Twitch API (not currently used)
    // login: string;             // username (lowercase)
    // description?: string;
    // broadcaster_type?: string; // "partner", "affiliate", or ""
    // view_count?: number;
    // created_at?: string;
}
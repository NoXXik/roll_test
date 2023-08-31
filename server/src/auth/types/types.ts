export interface GoogleUserDetails {
  email: string;
  displayName: string;
  google_id: string;
}
export interface SteamUserDetails {
  displayName: string;
  steam_id: string;
  avatar: string
}
export interface SteamProfile {
  provider: string;
  _json: {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    commentpermission: number;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: number;
    realname: string;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
  };
  id: string;
  displayName: string;
}

export interface SteamAuthData {
  identifier: string;
  profile: SteamProfile;
}



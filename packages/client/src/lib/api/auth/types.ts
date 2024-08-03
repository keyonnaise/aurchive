export interface IAccount {
  id: string;
  role: 'user' | 'admin';
  email: string;
  displayName: string;
  photoUrl: string | null;
  dateJoined: number;
  lastLogin: number;
  membership: {
    level: number;
    name: string;
  };
  profile: {
    bio: string | null;
    about: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    instagramUrl: string | null;
    twitterUrl: string | null;
  };
  setting: Record<string, never>;
  emailVerified: boolean;
  isAgreeToTerms: boolean;
}

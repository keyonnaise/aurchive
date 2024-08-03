export interface IUser {
  id: string;
  role: 'user' | 'admin';
  email: string;
  displayName: string;
  photoUrl: string | null;
  profile: {
    bio: string | null;
    about: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    instagramUrl: string | null;
    twitterUrl: string | null;
  };
}

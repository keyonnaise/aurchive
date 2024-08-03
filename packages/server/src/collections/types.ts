type CamelToSnakeCase<C extends string> = C extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : C;
export type CamelToSnakeCaseNested<T> = T extends object
  ? {
      [K in keyof T as CamelToSnakeCase<K & string>]: CamelToSnakeCaseNested<T[K]>;
    }
  : T;

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type SnakeToCamelCaseNested<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>;
    }
  : T;

export interface IUser {
  id: string;
  role: 'user' | 'admin';
  email: string;
  display_name: string;
  photo_url: string | null;
  date_joined: number;
  last_login: number;
  membership: {
    level: number;
    name: string;
  };
  profile: {
    bio: string | null;
    about: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
  };
  setting: Record<string, never>;
  email_verified: boolean;
  is_agree_to_terms: boolean;
}

export interface IStory {
  id: string;
  author: string;
  updated_at: number;
  created_at: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface IPost {
  id: string;
  author: string;
  published_at: number | null;
  updated_at: number | null;
  title: string;
  tags: string[];
  story: string | null;
  cover: string | null;
  thumbnail: string | null;
  body: string;
  last_history: PostHistory | null;
  is_private: boolean;
  is_published: boolean;
}

interface PostHistory {
  saved_at: number;
  title: string;
  tags: string[];
  story: string | null;
  cover: string | null;
  thumbnail: string | null;
  body: string;
}

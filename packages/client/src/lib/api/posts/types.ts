interface PostHistory {
  savedAt: number;
  title: string;
  tags: string[];
  story: string | null;
  cover: string | null;
  thumbnail: string | null;
  body: string;
}

export interface IPost {
  id: string;
  author: string;
  publishedAt: number;
  updatedAt: number;
  title: string;
  tags: string[];
  story: string | null;
  cover: string | null;
  thumbnail: string | null;
  body: string;
  lastHistory: PostHistory;
  isPrivate: boolean;
  isPublished: boolean;
}

interface User {
  email: string;
  followers: number;
  following: number;
  id: string;
  name: string;
  password: string;
}

interface DetectionResult {
  deepfakeScore: number;
  genaiScore: number;
  message: string;
}

interface Post {
  comments: [];
  content: string;
  id: number;
  likesCount: number;
  mediaUrl: string;
  title: string;
  trustedScore: string;
  isSafe: boolean;
  user: User;
  userId?: number;
}

export type { User, Post, DetectionResult };

export interface Post {
  _id: string;
  title: string;
  content: string;
  upvotes: number;
  user: string;
  dungeon: string;
  createdAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  gems: number;
}
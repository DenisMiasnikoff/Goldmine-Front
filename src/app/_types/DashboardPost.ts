export interface PopulatedDungeon {
  _id: string;
  name: string;
}

export interface PopulatedUser {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  upvotes: string[];
  user: PopulatedUser;
  dungeon: PopulatedDungeon;
  createdAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  gems: number;
}

export interface IComment {
  _id: string;
  text: string;
  user: PopulatedUser;
  post: string;
  upvotes: string[];
  createdAt: string;
}

export interface Dungeon {
  _id: string;
  name: string;
  description?: string;
  dungPicture: string;
  dungBanner: string;
  moderators: string[];
  createdAt: string;
}
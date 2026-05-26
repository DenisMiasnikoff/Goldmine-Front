'use client';
import AppLayout from '../_components/AppLayout/AppLayout';
import MainContent from '../_components/MainContent/MainContent';
import { Post } from '../_types/DashboardPost';
import { User } from '../_types/DashboardPost';

interface DashboardClientProps {
  posts: Post[];
  dungeonId: string;
  token: string | null;
  currentUser: User | null;
}

export default function DashboardClient({ posts, token, currentUser }: DashboardClientProps) {
  return (
    <AppLayout currentUser={currentUser}>
      <MainContent
        posts={posts}
       
        token={token}
      />
    </AppLayout>
  );
}
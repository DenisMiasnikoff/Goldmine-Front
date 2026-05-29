'use client';
import { Post, User } from '@/app/_types/DashboardPost';
import AppLayout from '@/app/_components/AppLayout/AppLayout';
import PostCard from '@/app/_components/PostCard/PostCard';
import styles from './Popular.module.scss';
import { Flame } from 'lucide-react';

interface PopularClientProps {
  posts: Post[];
  token: string | null;
  currentUser: User | null;
}

export default function PopularClient({ posts, token, currentUser }: PopularClientProps) {
  return (
    <AppLayout currentUser={currentUser}>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flame color="#663300" size={24} />
          <h1>Popular</h1>
        </div>
        <p className={styles.subtitle}>Most upvoted posts across all dungeons</p>

        <div className={styles.feed}>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                token={token}
              />
            ))
          ) : (
            <div className={styles.empty}>
              <p>⛏️ No posts yet across any dungeon.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
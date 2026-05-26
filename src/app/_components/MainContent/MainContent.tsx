"use client";

import styles from './MainContent.module.scss';
import PostCard from '../PostCard/PostCard';
import { Post } from '../../_types/DashboardPost';


interface MainContentProps {
  posts: Post[];
  
  token: string | null;
}

export default function MainContent({ posts, token }: MainContentProps) {
  return (
    <main className={styles.main}>
      <section className={styles.feedZone}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} token={token} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.icon}>⛏️</div>
            <h2>The mines run silent</h2>
            <p>No one posted in this Dungeon yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}
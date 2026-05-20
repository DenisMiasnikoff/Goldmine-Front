"use client";
import { useState } from 'react';
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import styles from './MainContent.module.scss';
import PostCard from "../PostCard/PostCard";
import { Post } from "../../_types/DashboardPost"
import { ImagePlus, Link } from 'lucide-react';

interface MainContentProps {
  posts: Post[];
  dungeonId: string;
  token: string | null;
}

export default function MainContent({ posts, dungeonId, token }: MainContentProps) {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <main className={styles.main}>
      <section className={styles.inputZone}>
        {!isFormOpen ? (
          <div className={styles.fakeInputBar} onClick={() => setIsFormOpen(true)}>
            <div className={styles.avatarCircle} />
            <div className={styles.innerBar}>Create Post</div>
            <div className={styles.iconButtons}>
             <ImagePlus color="#663300" />
             <Link color="#663300" />
            </div>
          </div>
        ) : (
          <div className={styles.realFormCard}>
            <header>
              <h3>Make a post</h3>
              <button onClick={() => setIsFormOpen(false)}>✕</button>
            </header>
            <CreatePostForm dungeonId={dungeonId} token={token} />
          </div>
        )}
      </section>

      <section className={styles.feedZone}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} token={token} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.icon}>⛏️</div>
            <h2>The mines run silent</h2>
            <p>No one posted in this Dungeon yet.</p>
            <button
              className={styles.ctaBtn}
              onClick={() => setIsFormOpen(true)}
            >
              Create post
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
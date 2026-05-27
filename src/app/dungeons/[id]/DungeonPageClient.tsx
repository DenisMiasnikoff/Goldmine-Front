'use client';
import { useState } from 'react';
import { Dungeon, Post, User } from '@/app/_types/DashboardPost';
import AppLayout from '@/app/_components/AppLayout/AppLayout';
import PostCard from '@/app/_components/PostCard/PostCard';
import CreatePostForm from '@/app/_components/CreatePostForm/CreatePostForm';
import styles from './DungeonPage.module.scss';
import { Plus, X } from 'lucide-react';

interface DungeonPageClientProps {
  dungeon: Dungeon;
  posts: Post[];
  token: string | null;
  currentUser: User | null;
}

export default function DungeonPageClient({ dungeon, posts, token, currentUser }: DungeonPageClientProps) {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <AppLayout currentUser={currentUser}>
      <div className={styles.page}>

        {/* Banner */}
        <div
          className={styles.banner}
          style={{ backgroundColor: '#8c7851' }}
        />

        {/* Dungeon Header */}
        <div className={styles.dungeonHeader}>
          <div className={styles.dungeonInfo}>
            <h1 className={styles.dungeonName}>d/{dungeon.name}</h1>
          </div>
          <button
            className={styles.createPostBtn}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? <X size={16} /> : <Plus size={16} />}
            {isFormOpen ? 'Cancel' : 'Create Post'}
          </button>
        </div>

        {/* Main layout */}
        <div className={styles.layout}>

          {/* Left — feed */}
          <div className={styles.feed}>

            {/* Create post form */}
            {isFormOpen && (
              <div className={styles.formCard}>
                <h3>Create a Post</h3>
                <CreatePostForm
                  dungeonId={dungeon._id}
                  token={token}
                />
              </div>
            )}

            {/* Posts */}
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
                <p> No posts yet. Be first!</p>
              </div>
            )}
          </div>

          {/* Right — sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.aboutCard}>
              <h3 className={styles.aboutTitle}>About d/{dungeon.name}</h3>
              <p className={styles.aboutDesc}>
                {dungeon.description || 'A mysterious dungeon awaits...'}
              </p>
              <div className={styles.aboutMeta}>
                <span>Created {new Date(dungeon.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
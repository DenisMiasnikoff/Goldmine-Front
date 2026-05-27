'use client';
import { useState } from 'react';
import Link from 'next/link';
import { upvotePostAction } from "../../_lib/actions";
import { Post } from "../../_types/DashboardPost";
import { ThumbsUp, MessageSquare } from 'lucide-react';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: Post;
  token: string | null;
}

export default function PostCard({ post, token }: PostCardProps) {
  const initialCount = Array.isArray(post.upvotes)
    ? post.upvotes.length
    : (post.upvotes || 0);

  const [upvoteCount, setUpvoteCount] = useState<number>(initialCount);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) return;

   const message = await upvotePostAction(post._id, token);
    if (message) {
      if (message.includes('removed')) {
        setUpvoteCount(prev => prev - 1);
      } else if (message.includes('Upvoted')) {
        setUpvoteCount(prev => prev + 1);
      }
      if (message.includes('💎')) {
        alert(message);
      }
    }
  };

  return (
    <div className={styles.card}>

      {/* HEADER */}
      <div className={styles.cardHeader}>
        <span className={styles.dungeon}>
          d/{post.dungeon?.name || 'general'}
        </span>
        <span className={styles.dot}>•</span>
        <span className={styles.author}>
          Posted by {post.user?.username || 'Miner'}
        </span>
      </div>

      {/* BODY */}
      <Link href={`/post/${post._id}`} className={styles.cardBody}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </Link>

      {/* FOOTER */}
      <div className={styles.cardFooter}>
        <button onClick={handleUpvote} className={styles.upvoteBtn}>
          <ThumbsUp color="#663300" size={16} />
          {upvoteCount}
        </button>

        <Link href={`/post/${post._id}`} className={styles.commentsBtn}>
          <MessageSquare size={16} />
          Comments
        </Link>
      </div>

    </div>
  );
}
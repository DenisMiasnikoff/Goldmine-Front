'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThumbsUp, MessageSquare, ArrowLeft } from 'lucide-react';
import { Post, IComment, User } from '@/app/_types/DashboardPost';
import { createCommentAction, upvoteCommentAction } from '@/app/_lib/actions';
import styles from './PostPage.module.scss';

interface PostPageClientProps {
  post: Post;
  comments: IComment[];
  token: string | null;
  currentUser:User|null;
}

interface CommentCardProps {
  comment: IComment;
  token: string | null;
  postId: string;
}

function CommentCard({ comment, token, postId }: CommentCardProps) {
  const [upvoteCount, setUpvoteCount] = useState<number>(comment.upvotes.length);

  const handleUpvote = async () => {
    if (!token) return;
    const message = await upvoteCommentAction(comment._id, postId, token);
    if (message?.includes('removed')) {
      setUpvoteCount(prev => prev - 1);
    } else if (message?.includes('Upvoted')) {
      setUpvoteCount(prev => prev + 1);
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>
          {comment.user?.username || 'Miner'}
        </span>
        <span className={styles.commentDate}>
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className={styles.commentText}>{comment.text}</p>
      <button onClick={handleUpvote} className={styles.commentUpvote}>
        <ThumbsUp size={14} color="#663300" />
        {upvoteCount}
      </button>
    </div>
  );
}

export default function PostPageClient({ post, comments, token }: PostPageClientProps) {
  const router = useRouter();
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [localComments, setLocalComments] = useState<   IComment[]>(comments);
  const [error, setError] = useState<string>('');

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !token) return;
    setIsSubmitting(true);
    setError('');

    const result = await createCommentAction(commentText, post._id, token);

    if (result?.error) {
      setError(result.error);
    } else {
      setCommentText('');
      // Refresh page to get new comment
      router.refresh();
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.page}>

      {/* Back button */}
      <button onClick={() => router.back()} className={styles.backBtn}>
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Post */}
      <div className={styles.postCard}>
        <div className={styles.postMeta}>
          <span className={styles.dungeon}>
            d/{post.dungeon?.name || 'general'}
          </span>
          <span className={styles.dot}>•</span>
          <span className={styles.author}>
            Posted by {post.user?.username || 'Miner'}
          </span>
        </div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postContent}>{post.content}</p>
        <div className={styles.postStats}>
          <span className={styles.statItem}>
            <ThumbsUp size={16} color="#663300" />
            {post.upvotes.length} upvotes
          </span>
          <span className={styles.statItem}>
            <MessageSquare size={16} color="#663300" />
            {localComments.length} comments
          </span>
        </div>
      </div>

      {/* Comment Form */}
      <div className={styles.commentForm}>
        <textarea
          className={styles.commentInput}
          placeholder="Share your thoughts..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button
          onClick={handleCommentSubmit}
          disabled={isSubmitting || !commentText.trim()}
          className={styles.submitBtn}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>

      {/* Comments */}
      <div className={styles.commentsList}>
        <h3 className={styles.commentsTitle}>
          {localComments.length} Comments
        </h3>
        {localComments.length > 0 ? (
          localComments.map(comment => (
            <CommentCard
              key={comment._id}
              comment={comment}
              token={token}
              postId={post._id}
            />
          ))
        ) : (
          <div className={styles.emptyComments}>
            <p>No comments yet. Become first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
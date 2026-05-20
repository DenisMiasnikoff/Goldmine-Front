'use client';
import { upvotePostAction } from "../../_lib/actions";
import { Post } from "../../_types/DashboardPost"

interface PostCardProps {
  post: Post;
  token: string | null;
}

export default function PostCard({ post, token }: PostCardProps) {
  const handleUpvote = async () => {
    if (!token) return;
    
    const message = await upvotePostAction(post._id, token);
    
    if (message && message.includes('💎')) {
      alert(message);
    }
  };

  return (
    <div className="card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="stats">
        <button onClick={handleUpvote}>⛏️ {post.upvotes} Upvotes</button>
      </div>
    </div>
  );
}
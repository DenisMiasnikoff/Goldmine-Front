import { redirect } from "next/navigation";
import PostPageClient from "./PostPageClient";
import { cookies } from "next/headers";
import { Post, IComment as IComment, User } from '@/app/_types/DashboardPost';

interface PostApiResponse {
  data?: { post?: Post };
}

interface CommentsApiResponse {
  data?: { comments?: IComment[] };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  // 👇 await params first
  const { id } = await params;
  
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  const postRes = await fetch(`${API_BASE}/posts/${id}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!postRes.ok) redirect('/dashboard');

  const postData: PostApiResponse = await postRes.json();
  const post = postData.data?.post;

  if (!post) redirect('/dashboard');

  const commentsRes = await fetch(`${API_BASE}/posts/${id}/comments`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let comments: IComment[] = [];
  if (commentsRes.ok) {
    const commentsData: CommentsApiResponse = await commentsRes.json();
    comments = commentsData.data?.comments || [];
  }

  const userRes = await fetch(`${API_BASE}/users/me`, {
  cache: 'no-store',
  headers: { Authorization: `Bearer ${token}` }
});

interface UserApiResponse {
  data?: { user?: User };
}

let currentUser: User | null = null;
if (userRes.ok) {
  const userData: UserApiResponse = await userRes.json();
  currentUser = userData.data?.user || null;
}

  return (
    <PostPageClient
      post={post}
      comments={comments}
      token={token}
      currentUser={currentUser}
    />
  );
}
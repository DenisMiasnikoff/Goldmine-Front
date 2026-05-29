import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Post, User } from '@/app/_types/DashboardPost';
import PopularClient from "./PopularClient";

interface PostsApiResponse {
  data?: { posts?: Post[] };
}

interface UserApiResponse {
  data?: { user?: User };
}

export default async function PopularPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  // Fetch posts sorted by popularity
  const postsRes = await fetch(`${API_BASE}/posts?sort=popular`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let posts: Post[] = [];
  if (postsRes.ok) {
    const data: PostsApiResponse = await postsRes.json();
    posts = data.data?.posts || [];
  }

  // Fetch current user
  const userRes = await fetch(`${API_BASE}/users/me`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let currentUser: User | null = null;
  if (userRes.ok) {
    const userData: UserApiResponse = await userRes.json();
    currentUser = userData.data?.user || null;
  }

  return (
    <PopularClient
      posts={posts}
      token={token}
      currentUser={currentUser}
    />
  );
}
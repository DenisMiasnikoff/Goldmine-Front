import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Dungeon, Post, User } from '@/app/_types/DashboardPost';
import DungeonPageClient from './DungeonPageClient';

interface DungeonApiResponse {
  data?: { dungeon?: Dungeon };
}

interface PostsApiResponse {
  data?: { posts?: Post[] };
}

interface UserApiResponse {
  data?: { user?: User };
}

export default async function DungeonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  // Fetch dungeon info
  const dungeonRes = await fetch(`${API_BASE}/dungeons/${id}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!dungeonRes.ok) redirect('/dungeons');

  const dungeonData: DungeonApiResponse = await dungeonRes.json();
  const dungeon = dungeonData.data?.dungeon;
  if (!dungeon) redirect('/dungeons');

  // Fetch dungeon posts
  const postsRes = await fetch(`${API_BASE}/dungeons/${id}/posts`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let posts: Post[] = [];
  if (postsRes.ok) {
    const postsData: PostsApiResponse = await postsRes.json();
    posts = postsData.data?.posts || [];
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
    <DungeonPageClient
      dungeon={dungeon}
      posts={posts}
      token={token}
      currentUser={currentUser}
    />
  );
}
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { Post, User } from "../_types/DashboardPost"

interface ApiResponse {
  data?: {
    posts?: Post[];
  };
}

interface UserApiResponse {
  data?: {
    user?: User;
  };
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("jwt");
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) {
    redirect('/login');
  }

  const REAL_DUNGEON_ID = '69f77476c742faaab1610988';

  // Fetch posts
  const res = await fetch(`http://localhost:5000/api/v1/dungeons/${REAL_DUNGEON_ID}/posts`, {
    cache: 'no-store'
  });

  let posts: Post[] = [];
  if (res.ok) {
    const data: ApiResponse = await res.json();
    posts = data.data?.posts || [];
  }

  // Fetch current user
  const userRes = await fetch(`http://localhost:5000/api/v1/users/me`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  let currentUser: User | null = null;
  if (userRes.ok) {
    const userData: UserApiResponse = await userRes.json();
    currentUser = userData.data?.user || null;
  }

  return (
    <DashboardClient
      posts={posts}
      dungeonId={REAL_DUNGEON_ID}
      token={token}
      currentUser={currentUser}
    />
  );
}
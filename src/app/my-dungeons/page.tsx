import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Dungeon, User } from '@/app/_types/DashboardPost';
import MyDungeonsClient from './MyDungeonsClient';

interface MyDungeonsApiResponse {
  data?: { dungeons?: Dungeon[] };
}

interface UserApiResponse {
  data?: { user?: User };
}

export default async function MyDungeonsPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  // Fetch user's dungeons
  const dungeonsRes = await fetch(`${API_BASE}/dungeons/my-dungeons`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let dungeons: Dungeon[] = [];
  if (dungeonsRes.ok) {
    const data: MyDungeonsApiResponse = await dungeonsRes.json();
    dungeons = data.data?.dungeons || [];
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
    <MyDungeonsClient
      dungeons={dungeons}
      token={token}
      currentUser={currentUser}
    />
  );
}
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Dungeon, User } from '@/app/_types/DashboardPost';
import DungeonsClient from "./DungeonsClient";

interface DungeonsApiResponse {
  data?: { dungeons?: Dungeon[] };
}

interface UserApiResponse {
  data?: { 
    user?: User & { subscriptions: string[] }
  };
}

export default async function DungeonsPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  const dungeonsRes = await fetch(`${API_BASE}/dungeons`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let dungeons: Dungeon[] = [];
  if (dungeonsRes.ok) {
    const data: DungeonsApiResponse = await dungeonsRes.json();
    dungeons = data.data?.dungeons || [];
  }

  const userRes = await fetch(`${API_BASE}/users/me`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let currentUser: User | null = null;
  let subscriptions: string[] = [];

  if (userRes.ok) {
    const userData: UserApiResponse = await userRes.json();
    currentUser = userData.data?.user || null;
    subscriptions = userData.data?.user?.subscriptions || [];
  }

  return (
    <DungeonsClient
      dungeons={dungeons}
      subscriptions={subscriptions}
      token={token}
      currentUser={currentUser}
    />
  );
}
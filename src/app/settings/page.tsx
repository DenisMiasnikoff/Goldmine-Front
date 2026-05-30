import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/app/_types/DashboardPost';
import SettingsClient from "./SettingsClient";

interface UserApiResponse {
  data?: { user?: User };
}

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  const userRes = await fetch(`${API_BASE}/users/me`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let currentUser: User | null = null;
  if (userRes.ok) {
    const userData: UserApiResponse = await userRes.json();
    currentUser = userData.data?.user || null;
  }

  if (!currentUser) redirect('/login');

  return (
    <SettingsClient
      currentUser={currentUser}
      token={token}
    />
  );
}
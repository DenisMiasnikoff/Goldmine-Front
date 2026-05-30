import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Item } from '@/app/_types/DashboardPost';
import ProfileClient from './ProfileClient';

interface ProfileApiResponse {
  data?: {
    user?: User & {
      inventory: Item[];
      createdAt: string;
      role: string;
    };
  };
}

interface CurrentUserApiResponse {
  data?: { user?: User };
}

export default async function ProfilePage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params;

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  // Fetch profile user by username
  const profileRes = await fetch(`${API_BASE}/users/profile/${username}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!profileRes.ok) redirect('/dashboard');

  const profileData: ProfileApiResponse = await profileRes.json();
  const profileUser = profileData.data?.user;

  if (!profileUser) redirect('/dashboard');

  // Fetch current logged in user
  const userRes = await fetch(`${API_BASE}/users/me`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let currentUser: User | null = null;
  if (userRes.ok) {
    const userData: CurrentUserApiResponse = await userRes.json();
    currentUser = userData.data?.user || null;
  }

  const isOwnProfile = currentUser?.username === username;

  return (
    <ProfileClient
      profileUser={profileUser}
      currentUser={currentUser}
      isOwnProfile={isOwnProfile}
      token={token}
    />
  );
}
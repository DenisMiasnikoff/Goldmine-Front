import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Item } from '@/app/_types/DashboardPost';
import ShopClient from './ShopClient';

interface ItemsApiResponse {
  data?: { items?: Item[] };
}

interface UserApiResponse {
  data?: { user?: User & { inventory: Item[] } };
}

export default async function ShopPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

  // Fetch all items
  const itemsRes = await fetch(`${API_BASE}/items`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let items: Item[] = [];
  if (itemsRes.ok) {
    const data: ItemsApiResponse = await itemsRes.json();
    items = data.data?.items || [];
  }

  // Fetch current user with inventory
  const userRes = await fetch(`${API_BASE}/users/me`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }
  });

  let currentUser: User | null = null;
  let ownedItemIds: string[] = [];

  if (userRes.ok) {
    const userData: UserApiResponse = await userRes.json();
    currentUser = userData.data?.user || null;
    ownedItemIds = userData.data?.user?.inventory?.map(
      (item: Item) => item._id
    ) || [];
  }

  return (
    <ShopClient
      items={items}
      currentUser={currentUser}
      ownedItemIds={ownedItemIds}
      token={token}
    />
  );
}
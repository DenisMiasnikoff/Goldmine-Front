import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Post, User } from '@/app/_types/DashboardPost';
import AppLayout from '../_components/AppLayout/AppLayout';
import PostCard from '../_components/PostCard/PostCard';
import { searchPostsAction } from '../_lib/actions';

interface UserApiResponse {
  data?: { user?: User };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('jwt');
  const token: string | null = tokenCookie ? tokenCookie.value : null;

  if (!token) redirect('/login');

  const API_BASE = 'http://localhost:5000/api/v1';

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

  let posts: Post[] = [];
  let error: string | null = null;

  if (q) {
    const response = await searchPostsAction(q, token);
    if (response.error) {
      error = response.error;
    } else {
      posts = response.data?.posts || [];
    }
  }

  return (
    <AppLayout currentUser={currentUser}>
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '24px 16px' }}>
        <h2 style={{ marginBottom: '8px' }}>
          Search results for: &quot;{q}&quot;
        </h2>
        <p style={{ color: '#716040', marginBottom: '24px' }}>
          Found {posts.length} results
        </p>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!error && posts.length === 0 && q && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#716040' }}>
            <h3>No posts found</h3>
            <p>Try searching for different keywords.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map((post: Post) => (
            <PostCard
              key={post._id}
              post={post}
              token={token}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
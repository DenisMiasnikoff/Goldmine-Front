'use server'

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { login } from "../../services/apiAuth"
import { revalidatePath } from "next/cache";

const API_BASE = 'http://localhost:5000/api/v1';

interface PostData {
  title: string;
  content: string;
}

interface DungeonData {
  name: string;
  description: string;
}

interface ActionState {
  error: string;
}

interface ApiResponse {
  status: string;
  message?: string;
  token?: string;
  data?: {
    post?: { _id: string };
    message?: string;
  };
}

// 1. CREATE A POST
export async function createPost(
  formData: FormData,
  dungeonId: string,
  token: string
): Promise<ActionState | void> {

  const rawData: PostData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
  };

  const res = await fetch(`${API_BASE}/dungeons/${dungeonId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(rawData),
  });

  const data: ApiResponse = await res.json();

  if (!res.ok) {
    console.error("❌ Backend Error:", data.message);
    return { error: data.message ?? 'Something went wrong' };
  }

  console.log("✅ Post Created Successfully:", data.data?.post?._id);
  revalidatePath('/dashboard');
}


export async function upvotePostAction(
  postId: string,
  token: string
): Promise<string | undefined> {

  const res = await fetch(`${API_BASE}/posts/${postId}/upvote`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data: ApiResponse = await res.json();

  if (data.status === 'success') {
    revalidatePath('/dashboard');
    return data.data?.message;
  }
}

// 3. CREATE A DUNGEON (FORGE)
export async function forgeDungeon(
  formData: FormData,
  token: string
): Promise<void> {

  const rawData: DungeonData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  };

  const res = await fetch(`${API_BASE}/dungeons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(rawData),
  });

  if (res.ok) revalidatePath('/dashboard');
}

// 4. LOGIN
export async function loginAction(
  prevData: ActionState | null,
  formData: FormData
): Promise<ActionState | null> {

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const data = await login({ email, password });

    const cookieStore = await cookies();
    cookieStore.set("jwt", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch(err) {
    const error = err as Error;
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
  redirect('/login');
}

export async function createCommentAction(
  text: string,
  postId: string,
  token: string
): Promise<{ error: string } | void> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.message ?? 'Could not post comment' };
  }

  revalidatePath(`/post/${postId}`);
}

export async function upvoteCommentAction(
  commentId: string,
  postId: string,
  token: string
): Promise<string | undefined> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}/upvote`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (data.status === 'success') {
    revalidatePath(`/post/${postId}`);
    return data.data?.message;
  }
}
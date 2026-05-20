const BASE_URL = 'http://localhost:5000/api/v1/users';

// What you send to signup
interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}

// What you send to login
interface LoginCredentials {
  email: string;
  password: string;
}

// What your backend sends back
interface AuthResponse {
  status: string;
  token: string;
  data?: {
    user?: {
      _id: string;
      username: string;
      email: string;
    };
  };
  message?: string;
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not create account');
  }

  return data;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Invalid credentials');
  }

  return data;
}
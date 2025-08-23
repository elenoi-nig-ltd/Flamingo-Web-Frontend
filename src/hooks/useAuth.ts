// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { BASEURL } from '@/config/api/contants';



interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // On initial load, check if token and user exist in localStorage/cookies
  useEffect(() => {
    const initializeUser = async () => {
      const token = getCookie('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        localStorage.removeItem('user'); // Clear stale user data
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser)); // Load user from localStorage
          setLoading(false);
          return;
        } catch (err) {
          console.error('Error parsing stored user:', err);
        }
      }

      try {
        const res = await fetch(`${BASEURL}/auth/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!res.ok) {
          deleteCookie('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        setUser(null);
        deleteCookie('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASEURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data: AuthResponse = await response.json();
      setUser(data.user);
      setCookie('token', data.token, { maxAge: 60 * 60 * 24 });
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'staff') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASEURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data: AuthResponse = await response.json();
      setUser(data.user);
      setCookie('token', data.token, { maxAge: 60 * 60 * 24 });
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    deleteCookie('token');
    localStorage.removeItem('user'); // Clear user from localStorage
    setUser(null);
    router.push('/admin/login');
  };

  return { user, loading, error, login, register, logout };
};
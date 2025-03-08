'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
require('dotenv').config()

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Move localStorage check inside useEffect to ensure it only runs on client side
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          setUser({ token });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/admin/login`, 
        {
          email: email,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`
          }
        }
      );
      
      console.log(response);
      
      if (response.status === 200 && response.data.success) {
        const data = await response.data;
        localStorage.setItem('authToken', data.token);
        setUser({ token: data.token });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
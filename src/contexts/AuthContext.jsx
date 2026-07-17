import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'harvesthub_user';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mock login — in production this would hit an API endpoint.
   * Returns { success, error }
   */
  const login = async ({ email, password }) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    // Hardcoded demo account for portfolio demo
    if (email === 'demo@harvesthub.com' && password === 'demo1234') {
      const userData = {
        id: 'usr_001',
        name: 'Alex Johnson',
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        role: 'consumer',
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  /**
   * Mock register — in production this would POST to /api/auth/register.
   */
  const register = async ({ name, email, password }) => {
    await new Promise((r) => setTimeout(r, 800));
    // Prevent duplicate demo account
    if (email === 'demo@harvesthub.com') {
      return { success: false, error: 'Email already in use.' };
    }
    const userData = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2d6a4f&color=fff`,
      role: 'consumer',
    };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

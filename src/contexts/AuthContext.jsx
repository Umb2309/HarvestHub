/**
 * AuthContext (mock)
 * -------------------
 * Fakes sign-in and registration with localStorage so the UI flows work
 * without a backend. Swap login/register for real API calls later; the
 * components only depend on { user, login, register, logout }.
 *
 * ⚠️ Demo only: passwords are kept in localStorage in plain text.
 * Never do this with real users.
 */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'harvesthub_user';
const ACCOUNTS_KEY = 'harvesthub_accounts';

export const DEMO_ACCOUNT = { email: 'demo@harvesthub.ng', password: 'demo1234' };

const DEMO_USER = {
  id: 'usr_001',
  name: 'Tolu Adebayo',
  email: DEMO_ACCOUNT.email,
  phone: '+2348025550147',
  state: 'Lagos',
  role: 'buyer',
  avatar: null, // falls back to initials
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function AuthProvider({ children }) {
  // Lazy initial state: read the saved session once, before the first render,
  // so pages never flash a "signed out" state on refresh.
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null));

  const startSession = (u) => {
    setUser(u);
    writeJSON(SESSION_KEY, u);
  };

  /** Returns { success, error } */
  const login = async ({ email, password }) => {
    await wait(700); // pretend network latency
    const e = email.trim().toLowerCase();

    if (e === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      startSession(DEMO_USER);
      return { success: true };
    }

    const account = readJSON(ACCOUNTS_KEY, []).find((a) => a.email === e);
    if (account && account.password === password) {
      const { password: _pw, ...profile } = account;
      startSession(profile);
      return { success: true };
    }

    return { success: false, error: 'That email and password don\'t match an account.' };
  };

  /** Returns { success, error } */
  const register = async ({ name, email, phone, state, role, password }) => {
    await wait(800);
    const e = email.trim().toLowerCase();
    const accounts = readJSON(ACCOUNTS_KEY, []);

    if (e === DEMO_ACCOUNT.email || accounts.some((a) => a.email === e)) {
      return { success: false, error: 'An account with this email already exists. Try signing in.' };
    }

    const profile = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: e,
      phone,
      state,
      role,
      avatar: null,
    };
    writeJSON(ACCOUNTS_KEY, [...accounts, { ...profile, password }]);
    startSession(profile);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

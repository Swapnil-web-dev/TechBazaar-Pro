import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'vendor' | 'admin';
  avatar?: string;
  mobile?: string;
  joinDate?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'student' | 'vendor' | 'admin', mobile: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── localStorage helpers (used when Supabase is not configured) ──────────────
const LS_ALL_USERS = 'tb_all_users';
const LS_USER      = 'tb_user';

function lsGetUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(LS_ALL_USERS) || '[]'); }
  catch { return []; }
}
function lsSaveUsers(users: User[]) {
  localStorage.setItem(LS_ALL_USERS, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LS_USER);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── Login ─────────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {

    // Admin hardcoded login — never goes to DB
    if (email.toLowerCase() === 'swapnil' && password === 'swap@1522') {
      const adminUser: User = {
        id: 'admin-1', name: 'Swapnil',
        email: 'swapnil@techbazaar.com', role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem(LS_USER, JSON.stringify(adminUser));
      return true;
    }

    if (isSupabaseConfigured && supabase) {
      // ✅ Supabase path — queries cloud database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) return false;

      const loggedIn: User = {
        id: data.id, name: data.name, email: data.email,
        role: data.role, joinDate: data.join_date, status: data.status,
      };
      setUser(loggedIn);
      localStorage.setItem(LS_USER, JSON.stringify(loggedIn));
      return true;
    } else {
      // ⚠️ localStorage fallback — same browser only
      const existingUser = lsGetUsers().find((u) => u.email === email);
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem(LS_USER, JSON.stringify(existingUser));
        return true;
      }
      return false;
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────────
  const register = async (
    name: string, email: string, _password: string,
    role: 'student' | 'vendor' | 'admin',
    mobile: string
  ): Promise<boolean> => {
    if (!name || !email) return false;

    const joinDate = new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured && supabase) {
      // ✅ Supabase path — saves to cloud, instantly visible in admin panel
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, role, join_date: joinDate, status: 'Active', mobile }])
        .select()
        .single();

      if (error) {
        // Duplicate email: log and fall through
        if (error.code === '23505') {
          console.warn('[Supabase] Email already registered:', email);
        } else {
          console.warn('[Supabase] Register error (falling back locally):', error.message);
        }
      }

      const newUser: User = {
        id: data?.id || Math.random().toString(36).slice(2),
        name, email, role, joinDate, status: 'Active', mobile
      };
      
      try {
        const allUsers = lsGetUsers();
        if (!allUsers.find((u) => u.email === email)) {
          allUsers.push(newUser);
          lsSaveUsers(allUsers);
        }
      } catch {}

      setUser(newUser);
      localStorage.setItem(LS_USER, JSON.stringify(newUser));
      return true;
    } else {
      // ⚠️ localStorage fallback
      const newUser: User = {
        id: Math.random().toString(36).slice(2),
        name, email, role, joinDate, status: 'Active', mobile
      };
      const allUsers = lsGetUsers();
      if (!allUsers.find((u) => u.email === email)) {
        allUsers.push(newUser);
        lsSaveUsers(allUsers);
      }
      setUser(newUser);
      localStorage.setItem(LS_USER, JSON.stringify(newUser));
      return true;
    }
  };

  // ── Update Profile ────────────────────────────────────────────────────────────
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    const updatedUser = { ...user, ...updates };
    
    const saveLocally = () => {
      setUser(updatedUser);
      localStorage.setItem(LS_USER, JSON.stringify(updatedUser));
      const allUsers = lsGetUsers();
      const updatedAllUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
      lsSaveUsers(updatedAllUsers);
      window.dispatchEvent(new Event('storage'));
    };

    if (isSupabaseConfigured && supabase) {
      // We map local fields to DB columns
      const dbUpdates: any = {
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        avatar: updatedUser.avatar
      };

      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.warn('[Supabase] Profile update error (falling back locally):', error.message);
        saveLocally();
      } else {
        saveLocally();
      }
      return true;
    } else {
      saveLocally();
      return true;
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_USER);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'vendor' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'student' | 'vendor' | 'admin') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('tb_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock auth — accept any valid-looking credentials
    if (!email || !password || password.length < 4) return false;

    // Admin login check
    if (email.toLowerCase() === 'swapnil' && password === 'swap@1522') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Swapnil',
        email: 'swapnil@techbazaar.com',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('tb_user', JSON.stringify(adminUser));
      return true;
    }

    const mockUser: User = {
      id: Math.random().toString(36).slice(2),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: email.includes('vendor') ? 'vendor' : 'student',
    };
    setUser(mockUser);
    localStorage.setItem('tb_user', JSON.stringify(mockUser));
    return true;
  };

  const register = async (name: string, email: string, _password: string, role: 'student' | 'vendor' | 'admin'): Promise<boolean> => {
    if (!name || !email) return false;
    const newUser: User = {
      id: Math.random().toString(36).slice(2),
      name,
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem('tb_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tb_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

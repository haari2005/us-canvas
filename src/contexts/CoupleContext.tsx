import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, hasSupabaseConfig } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Couple {
  id: string;
  name: string;
  memberA: User;
  memberB: User;
  anniversary?: string;
  createdAt: string;
  inviteCode?: string;
}

interface CoupleContextType {
  currentUser: User | null;
  couple: Couple | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  createCouple: (coupleName: string, anniversary?: string) => Promise<string>;
  joinCouple: (inviteCode: string) => Promise<void>;
  updateCoupleProfile: (updates: Partial<Couple>) => void;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const useCoupleContext = () => {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCoupleContext must be used within CoupleProvider');
  }
  return context;
};

interface CoupleProviderProps {
  children: ReactNode;
}

export const CoupleProvider: React.FC<CoupleProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);

  useEffect(() => {
    // Load user and couple from localStorage on mount
    const savedUser = localStorage.getItem('lovable_user');
    const savedCouple = localStorage.getItem('lovable_couple');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedCouple) {
      setCouple(JSON.parse(savedCouple));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();
    if (!hasSupabaseConfig) {
      // Local fallback (original behavior)
      const users = JSON.parse(localStorage.getItem('lovable_users') || '[]');
      const user = users.find((u: any) => (u.email || '').toLowerCase() === inputEmail && (u.password || '').trim() === inputPassword);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const userWithoutPassword = { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('lovable_user', JSON.stringify(userWithoutPassword));
      const couples = JSON.parse(localStorage.getItem('lovable_couples') || '[]');
      const userCouple = couples.find((c: Couple) => c.memberA.id === user.id || c.memberB.id === user.id);
      if (userCouple) {
        setCouple(userCouple);
        localStorage.setItem('lovable_couple', JSON.stringify(userCouple));
      }
      return;
    }
    // Static accounts validation via environment
    // Authenticate against Supabase users table
    const { data: existingUsers, error: fetchErr } = await (supabase as any)
      .from('users')
      .select('id,email,name,avatar,password_hash')
      .eq('email', inputEmail)
      .limit(1);
    if (fetchErr) {
      throw new Error(`Auth fetch failed: ${fetchErr.message}`);
    }

    let dbUser = existingUsers && existingUsers[0];
    if (!dbUser || !dbUser.password_hash) {
      throw new Error('Invalid credentials');
    }
    const ok = await bcrypt.compare(inputPassword, dbUser.password_hash);
    if (!ok) {
      throw new Error('Invalid credentials');
    }

    const userWithoutPassword = { id: dbUser.id, email: dbUser.email, name: dbUser.name, avatar: dbUser.avatar };
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('lovable_user', JSON.stringify(userWithoutPassword));

    // Load couple if exists in DB
    const { data: couples, error: coupleErr } = await (supabase as any)
      .from('couples')
      .select('*')
      .or(`member_a_id.eq.${dbUser.id},member_b_id.eq.${dbUser.id}`)
      .limit(1);
    if (!coupleErr && couples && couples[0]) {
      const dbCouple = couples[0];
      const formatted: Couple = {
        id: dbCouple.id,
        name: dbCouple.name,
        memberA: { id: dbCouple.member_a_id, email: '', name: 'Partner A' },
        memberB: { id: dbCouple.member_b_id || '', email: '', name: dbCouple.member_b_id ? 'Partner B' : 'Waiting...' },
        anniversary: dbCouple.anniversary || undefined,
        createdAt: dbCouple.created_at,
        inviteCode: dbCouple.invite_code || undefined,
      };
      setCouple(formatted);
      localStorage.setItem('lovable_couple', JSON.stringify(formatted));
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // Disabled: we only allow two static users
    throw new Error('Signup is disabled. This app uses two static accounts only.');
  };

  const logout = () => {
    setCurrentUser(null);
    setCouple(null);
    localStorage.removeItem('lovable_user');
    localStorage.removeItem('lovable_couple');
  };

  const createCouple = async (coupleName: string, anniversary?: string): Promise<string> => {
    if (!currentUser) throw new Error('Must be logged in');

    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    if (!hasSupabaseConfig) {
      // Local fallback
      const newCouple: Couple = {
        id: crypto.randomUUID(),
        name: coupleName,
        memberA: currentUser,
        memberB: { id: '', email: '', name: 'Waiting...' },
        anniversary,
        createdAt: new Date().toISOString(),
        inviteCode,
      };
      const couples = JSON.parse(localStorage.getItem('lovable_couples') || '[]');
      couples.push(newCouple);
      localStorage.setItem('lovable_couples', JSON.stringify(couples));
      setCouple(newCouple);
      localStorage.setItem('lovable_couple', JSON.stringify(newCouple));
      return inviteCode;
    }

    const { data, error } = await (supabase as any)
      .from('couples')
      .insert({
        id: crypto.randomUUID(),
        name: coupleName,
        member_a_id: currentUser.id,
        member_b_id: '',
        anniversary,
        created_at: new Date().toISOString(),
        invite_code: inviteCode,
      })
      .select('*')
      .limit(1);
    if (error) {
      throw new Error(`Create couple failed: ${error.message}`);
    }
    const dbCouple = data && data[0];
    const newCouple: Couple = {
      id: dbCouple.id,
      name: dbCouple.name,
      memberA: { id: dbCouple.member_a_id, email: '', name: 'Partner A' },
      memberB: { id: '', email: '', name: 'Waiting...' },
      anniversary: dbCouple.anniversary || undefined,
      createdAt: dbCouple.created_at,
      inviteCode: dbCouple.invite_code || undefined,
    };

    setCouple(newCouple);
    localStorage.setItem('lovable_couple', JSON.stringify(newCouple));

    return inviteCode;
  };

  const joinCouple = async (inviteCode: string) => {
    if (!currentUser) throw new Error('Must be logged in');
    if (!hasSupabaseConfig) {
      // Local fallback
      const couples = JSON.parse(localStorage.getItem('lovable_couples') || '[]');
      const coupleIndex = couples.findIndex((c: Couple) => c.inviteCode === inviteCode);
      if (coupleIndex === -1) {
        throw new Error('Invalid invite code');
      }
      const foundCouple = couples[coupleIndex];
      foundCouple.memberB = currentUser;
      foundCouple.inviteCode = undefined;
      couples[coupleIndex] = foundCouple;
      localStorage.setItem('lovable_couples', JSON.stringify(couples));
      setCouple(foundCouple);
      localStorage.setItem('lovable_couple', JSON.stringify(foundCouple));
      return;
    }

    const { data: couples, error: fetchErr } = await (supabase as any)
      .from('couples')
      .select('*')
      .eq('invite_code', inviteCode)
      .limit(1);
    if (fetchErr) {
      throw new Error(`Join lookup failed: ${fetchErr.message}`);
    }
    if (!couples || !couples[0]) {
      throw new Error('Invalid invite code');
    }
    const foundCouple = couples[0];

    const { data: updated, error: updateErr } = await (supabase as any)
      .from('couples')
      .update({ member_b_id: currentUser.id, invite_code: null })
      .eq('id', foundCouple.id)
      .select('*')
      .limit(1);
    if (updateErr) {
      throw new Error(`Join update failed: ${updateErr.message}`);
    }
    const updatedCouple = updated && updated[0];
    const formatted: Couple = {
      id: updatedCouple.id,
      name: updatedCouple.name,
      memberA: { id: updatedCouple.member_a_id, email: '', name: 'Partner A' },
      memberB: { id: updatedCouple.member_b_id || '', email: '', name: updatedCouple.member_b_id ? 'Partner B' : 'Waiting...' },
      anniversary: updatedCouple.anniversary || undefined,
      createdAt: updatedCouple.created_at,
      inviteCode: undefined,
    };
    setCouple(formatted);
    localStorage.setItem('lovable_couple', JSON.stringify(formatted));
  };

  const updateCoupleProfile = (updates: Partial<Couple>) => {
    if (!couple) return;

    const updatedCouple = { ...couple, ...updates };
    setCouple(updatedCouple);
    localStorage.setItem('lovable_couple', JSON.stringify(updatedCouple));

    // Best-effort update in Supabase
    const supabaseUpdates: any = {};
    if (updates.name) supabaseUpdates.name = updates.name;
    if (updates.anniversary) supabaseUpdates.anniversary = updates.anniversary;
    supabase
      .from('couples')
      .update(supabaseUpdates)
      .eq('id', couple.id)
      .then(() => void 0)
      .catch(() => void 0);
  };

  return (
    <CoupleContext.Provider
      value={{
        currentUser,
        couple,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        createCouple,
        joinCouple,
        updateCoupleProfile
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
};

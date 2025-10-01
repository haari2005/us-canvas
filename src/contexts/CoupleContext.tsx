import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    const users = JSON.parse(localStorage.getItem('lovable_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const userWithoutPassword = { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('lovable_user', JSON.stringify(userWithoutPassword));

    // Load couple if exists
    const couples = JSON.parse(localStorage.getItem('lovable_couples') || '[]');
    const userCouple = couples.find((c: Couple) => 
      c.memberA.id === user.id || c.memberB.id === user.id
    );
    
    if (userCouple) {
      setCouple(userCouple);
      localStorage.setItem('lovable_couple', JSON.stringify(userCouple));
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const users = JSON.parse(localStorage.getItem('lovable_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('lovable_users', JSON.stringify(users));

    const userWithoutPassword = { id: newUser.id, email: newUser.email, name: newUser.name };
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('lovable_user', JSON.stringify(userWithoutPassword));
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
    
    const newCouple: Couple = {
      id: crypto.randomUUID(),
      name: coupleName,
      memberA: currentUser,
      memberB: { id: '', email: '', name: 'Waiting...' }, // Placeholder
      anniversary,
      createdAt: new Date().toISOString(),
      inviteCode
    };

    const couples = JSON.parse(localStorage.getItem('lovable_couples') || '[]');
    couples.push(newCouple);
    localStorage.setItem('lovable_couples', JSON.stringify(couples));
    
    setCouple(newCouple);
    localStorage.setItem('lovable_couple', JSON.stringify(newCouple));

    return inviteCode;
  };

  const joinCouple = async (inviteCode: string) => {
    if (!currentUser) throw new Error('Must be logged in');

    const couples = JSON.parse(localStorage.getItem('lovable_couples') || '[]');
    const coupleIndex = couples.findIndex((c: Couple) => c.inviteCode === inviteCode);
    
    if (coupleIndex === -1) {
      throw new Error('Invalid invite code');
    }

    const foundCouple = couples[coupleIndex];
    
    // Update memberB with current user
    foundCouple.memberB = currentUser;
    foundCouple.inviteCode = undefined; // Remove invite code once used
    
    couples[coupleIndex] = foundCouple;
    localStorage.setItem('lovable_couples', JSON.stringify(couples));
    
    setCouple(foundCouple);
    localStorage.setItem('lovable_couple', JSON.stringify(foundCouple));
  };

  const updateCoupleProfile = (updates: Partial<Couple>) => {
    if (!couple) return;

    const updatedCouple = { ...couple, ...updates };
    setCouple(updatedCouple);
    localStorage.setItem('lovable_couple', JSON.stringify(updatedCouple));

    // Update in couples array
    const couples = JSON.parse(localStorage.getItem('lovable_couples') || '[]');
    const index = couples.findIndex((c: Couple) => c.id === couple.id);
    if (index !== -1) {
      couples[index] = updatedCouple;
      localStorage.setItem('lovable_couples', JSON.stringify(couples));
    }
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

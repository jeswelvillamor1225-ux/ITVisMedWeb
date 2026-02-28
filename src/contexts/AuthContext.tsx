import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from '../firebase';

interface UserRoles {
  isAdmin: boolean;
  modules: string[];
}

interface AuthContextType {
  user: User | null;
  userRoles: UserRoles | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, isAdmin: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUserModules: (modules: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserRoles | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user roles storage (in production, use Firestore or custom claims)
  const getUserRoles = async (uid: string): Promise<UserRoles> => {
    const storedRoles = localStorage.getItem(`userRoles_${uid}`);
    if (storedRoles) {
      return JSON.parse(storedRoles);
    }
    
    // Check if this is the predefined admin account
    const storedAdminUid = localStorage.getItem('predefined-admin-uid');
    
    // Default roles for new users
    let defaultRoles: UserRoles;
    
    // Predefined admin account
    if (uid === storedAdminUid || uid === 'predefined-admin-uid') {
      defaultRoles = {
        isAdmin: true,
        modules: ['admin', 'user-management', 'system-settings', 'reports', 'basic', 'support', 'billing', 'inventory', 'analytics']
      };
    } else {
      defaultRoles = {
        isAdmin: uid === 'admin-user-uid', // Replace with actual admin UID
        modules: ['basic', 'support']
      };
    }
    
    localStorage.setItem(`userRoles_${uid}`, JSON.stringify(defaultRoles));
    return defaultRoles;
  };

  const setUserRolesInStorage = async (uid: string, roles: UserRoles) => {
    localStorage.setItem(`userRoles_${uid}`, JSON.stringify(roles));
    setUserRoles(roles);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        const roles = await getUserRoles(currentUser.uid);
        setUserRoles(roles);
      } else {
        setUserRoles(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, isAdmin: boolean) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Special handling for predefined admin account
      if (email === 'admin@visayasmed.com.ph') {
        const roles: UserRoles = {
          isAdmin: true,
          modules: ['admin', 'user-management', 'system-settings', 'reports', 'basic', 'support', 'billing', 'inventory', 'analytics']
        };
        // Manually set the UID for the predefined admin
        localStorage.setItem('predefined-admin-uid', result.user.uid);
        await setUserRolesInStorage(result.user.uid, roles);
      } else {
        const roles: UserRoles = {
          isAdmin,
          modules: isAdmin ? ['admin', 'user-management', 'system-settings', 'reports', 'basic', 'support'] : ['basic', 'support']
        };
        await setUserRolesInStorage(result.user.uid, roles);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserModules = async (modules: string[]) => {
    if (user && userRoles) {
      const updatedRoles = { ...userRoles, modules };
      await setUserRolesInStorage(user.uid, updatedRoles);
    }
  };

  const value: AuthContextType = {
    user,
    userRoles,
    loading,
    signIn,
    signUp,
    logout,
    updateUserModules
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

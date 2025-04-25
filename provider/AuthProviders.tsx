
import React, { useState, ReactNode, useEffect } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

// Define the user type matching your 'User' table schema
export type User = {
  id: string;
  username: string;
  email?: string;
  name?: string;
  
};

export const AuthContext = React.createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logOut: () => Promise<void>;
  createUser: (username: string) => Promise<boolean>;
}>(null!);

export const useAuth = () => React.useContext(AuthContext);

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  // Insert new profile into 'User' table
  const createUser = async (username: string): Promise<boolean> => {
    if (!session) return false;
    const { user: authUser } = session;
    const newProfile = {
      id: authUser.id,
      username,
      email: authUser.email ?? undefined,
      name: authUser.user_metadata?.name ?? undefined,
    };
    const { data, error } = await supabase
      .from<User>('User')
      .insert(newProfile)
      .select()
      .single();

    if (error || !data) {
      console.error('createUser error:', error);
      return false;
    }
    setUser(data);
    return true;
  };

  // Fetch existing profile from 'User' table
  const fetchUser = async (session: Session) => {
    const userId = session.user.id;
    const { data, error } = await supabase
      .from<User>('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('fetchUser error:', error);
      return null;
    }
    return data;
  };

  // Sign-out helper
  const logOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/(auth)');
  };

  useEffect(() => {
    // Initial session
    supabase.auth.getSession().then(({ data }) => {
      const currentSession = data.session;
      setSession(currentSession);
      if (currentSession) {
        fetchUser(currentSession).then(profile => {
          if (profile) {
            setUser(profile);
            // Redirect based on profile completeness
            router.replace(profile.username ? '/(tabs)' : '/(auth)/username');
          }
        });
      }
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        fetchUser(newSession).then(profile => {
          if (profile) {
            setUser(profile);
            router.replace(profile.username ? '/(tabs)' : '/(auth)/username');
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logOut, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};

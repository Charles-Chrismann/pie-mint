import Api from '@/Api';
import type { TechnicalUser, UserProfile } from '@/declarations';
import { UnauthorizedError } from '@/errors/unauthorized.error';
import { UnexistingError } from '@/errors/unexisting.error';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: {
    technicalUser: TechnicalUser;
    userProfile: UserProfile;
  } | null
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUser() {
      let userData: AuthContextType['user'] = null
      try {
        userData = await Api.authenticatedFetch<AuthContextType['user']>('/me')
      } catch (error: unknown) {
        if(error instanceof UnauthorizedError) {
          await refreshToken()
        }
        else console.error(error)
      }
      setLoading(false);
      setUser(userData)
    }

    const access_token = localStorage.getItem('user');
    if(!access_token) return
    fetchUser()
  }, []);

  const login = async (email: string, password: string) => {
    const { technicalUser, userProfile, access_token } = await Api.login(email, password)
    localStorage.setItem('user', JSON.stringify({
      technicalUser,
      userProfile
    }));
    localStorage.setItem('access_token', access_token);
    setUser({
      technicalUser,
      userProfile
    })
  };

  const refreshToken = async () => {
    console.log('Refreshing access_token...')
    try {
      const { access_token } = await Api.refreshAccessToken()
      localStorage.setItem("access_token", access_token)
    } catch (error: unknown) {
      if(error instanceof UnexistingError) navigate('/auth/login')
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour consommer le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider');
  }
  return context;
};

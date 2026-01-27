import Api from '@/Api';
import type { UserRole } from '@/declarations';
import { UnauthorizedError } from '@/errors/unauthorized.error';
import { UnexistingError } from '@/errors/unexisting.error';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: {
    _id: string,
    firstname: string,
    lastname: string,
    email: string,
    role?: UserRole,
    isPremium?: boolean,
  } | null
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  register: (registerData: {
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    role: UserRole,
  }) => Promise<void>
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
        userData = await Api.getMe()
      } catch (error: unknown) {
        if(error instanceof UnauthorizedError) {
          await refreshToken()
        }
        else console.error(error)
      }
      setLoading(false);
      setUser(userData)
    }

    const access_token = localStorage.getItem('access_token');
    if(!access_token) return
    fetchUser()
  }, []);

  const login = async (email: string, password: string) => {
    const { _id, firstname, lastname, role, technicalUser, access_token } = await Api.login(email, password)
    localStorage.setItem('access_token', access_token);
    setUser({
      _id,
      email: technicalUser.email,
      firstname,
      lastname,
      role
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
    localStorage.removeItem('access_token');
  };

  const register = async ({ email, password, firstname, lastname, role }: {
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    role: UserRole
  }) => {
    const { accessToken, userId } = await Api.register(
      email,
      password,
      firstname,
      lastname,
      role
    )
    localStorage.setItem('access_token', accessToken);
    setUser({
      _id: userId,
      email,
      firstname,
      lastname,
      role
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
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

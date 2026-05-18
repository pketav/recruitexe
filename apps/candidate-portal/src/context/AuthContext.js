'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false); // ✅ New
  const [verification, setVerification] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = [
    '/login',
    '/register',
    '/ConfigSetup',
    '/ForgotPassword',
    '/CareerPage',
    '/ResetPassword',
    '/TermsAndConditions',
    '/PrivacyPolicy',
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      setToken(storedToken);
      setIsTokenChecked(true);
    } else if (isPublicRoute) {
      setIsTokenChecked(true); 
    } else {
      router.replace('/CareerPage');
    }
  }, [pathname]);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    router.push('/Careers');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    router.push('/CareerPage');
  };

  if (!isTokenChecked) return null;

  return (
    <AuthContext.Provider value={{ token, login, logout, setVerification, verification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

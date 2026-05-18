'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState({})
  const router = useRouter();
  const pathname = usePathname();
  const [isTokenChecked, setIsTokenChecked] = useState(false); // ✅ New

  const publicRoutes = ['/login', '/register','/ForgotPassword','/EmployeePasswordReset', "/AI-Interview"]


  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
  
  if (storedToken) {
      setToken(storedToken);
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData)); 
        } catch (err) {
          console.error("Failed to parse userData from localStorage:", err);
        }
      }
      setIsTokenChecked(true);
    } else if (isPublicRoute) {
      setIsTokenChecked(true); 
    } else {
      router.replace('/login'); 
    }
  }, []);
  

  const login = (newToken,data) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userData', JSON.stringify(data)); 
    setToken(newToken);
    setUserData(data)
    data?.role?.includes("new joinee") ? router.push('/joiningForm') : router.push('/home')
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    router.push('/login');
  };

  return (
  <AuthContext.Provider value={{ token, login, logout, userData, isAuthenticated: !!token }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pageloading, setPageLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const verifySession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          setUser(null);
          localStorage.removeItem("userInfo");
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        setUser(null);
        localStorage.removeItem("userInfo");
      } finally {
        setPageLoading(false);
      }
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, pageloading }}>
      {children}
    </AuthContext.Provider>
  );
};

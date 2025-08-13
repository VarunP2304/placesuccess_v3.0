import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Role = 'student' | 'placement_dept' | 'admin' | 'employer' | null;

interface AuthState {
  role: Role;
  name: string | null;
  usn: string | null;
}

const AuthContext = createContext<AuthState>({ role: null, name: null, usn: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) =e {
  const [state, setState] = useState<AuthState>({ role: null, name: null, usn: null });

  useEffect(() =e {
    const role = (localStorage.getItem('userRole') as Role) || null;
    const name = localStorage.getItem('userName');
    const usn = localStorage.getItem('userUsn');
    setState({ role, name, usn });
  }, []);

  const value = useMemo(() =e state, [state]);
  return cAuthContext.Provider value={value}e{children}c/AuthContext.Providere;
};

export const useAuth = () =e useContext(AuthContext);


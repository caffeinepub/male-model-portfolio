import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  login: () => void;
  logout: () => void;
  principalId?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthorizationProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!identity,
      isInitializing,
      isLoggingIn,
      login,
      logout: clear,
      principalId: identity?.getPrincipal().toString(),
    }),
    [identity, isInitializing, isLoggingIn, login, clear],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuthContext must be used within an AuthorizationProvider",
    );
  }
  return ctx;
}

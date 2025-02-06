'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { User } from '../types/user';

/**
 * Interface defining the structure of the user context manager.
 */
interface UserContextManager {
  user: User | null;
  getUserId: () => string | null;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * Create a React context for managing user authentication state.
 * The context is initially undefined and must be used within a provider.
 */
const UserContext = createContext<UserContextManager | undefined>(undefined);

/**
 * UserProvider component that wraps the application and provides user state management.
 *
 * @param {ReactNode} children - The components that should have access to the user context.
 */
export const UserProiver = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * Retrieves the user's shortened address if a user is logged in.
   *
   * @returns {string | null} The shortened address (first 6 characters) or null if no user is logged in.
   */
  const getUserId = () => {
    if (user) {
      return `${user?.address.slice(0, 6)}...`;
    } else {
      return null;
    }
  };

  /**
   * Logs in a user by setting the user state.
   *
   * @param {User} u - The user object to set in context.
   * @throws {Error} If a user is already logged in.
   */
  const login = (u: User) => {
    if (user === null) {
      setUser(u);
    } else {
      throw new Error('User already logged in');
    }
  };

  /**
   * Logs out the current user by resetting the user state.
   *
   * @throws {Error} If no user is currently logged in.
   */
  const logout = () => {
    if (user == null) {
      throw new Error('No user is logged in');
    }
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, getUserId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to use the user context within a component.
 *
 * @returns {UserContextManager} The user context object.
 * @throws {Error} If used outside of a UserProvider.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

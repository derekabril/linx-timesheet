import { useAppContext } from "../context/AppContext";

/**
 * Convenience hook to access current user from AppContext.
 */
export const useCurrentUser = () => {
  const { currentUser, isManager, isAdmin } = useAppContext();
  return { currentUser, isManager, isAdmin };
};

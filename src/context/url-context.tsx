import useFetch from "@/hooks/use-fetch.js";
import { getCurrentUser } from "@/db/apiAuth.js";
import { createContext, useContext, useEffect } from "react";

const UrlContext = createContext();
export const UrlState = () => {
  return useContext(UrlContext);
};

const UrlProvider = ({ children }) => {
  const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);
  let isAuthenticated: boolean = user?.role === "authenticated";

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated }}>
      {children}
    </UrlContext.Provider>
  );
};

export default UrlProvider;

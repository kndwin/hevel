import { rpc } from "@/shared/browser/rpc/client";
import { useQuery } from "@tanstack/react-query";
import { Session, User } from "lucia";
import { createContext } from "react";

type AuthContextProps = {
  user: User;
  session: Session;
};
const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const query = useAuthQuery();
  if (!query.data?.user || !query.data?.session) {
    return null;
  }
  return (
    <AuthContext.Provider
      value={{
        user: query.data?.user,
        session: query.data?.session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuthQuery() {
  return useQuery({
    queryKey: [rpc.auth.me.$url()],
    queryFn: async () => {
      const res = await rpc.auth.me.$get();
      const json = await res.json();
      return json as { session: Session; user: User };
    },
  });
}

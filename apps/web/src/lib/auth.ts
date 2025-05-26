import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "../../../api/src/common/utils/auth";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./query-client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
  });
};

export const signOut = async () => {
  queryClient.invalidateQueries({ queryKey: ["session"] });
  authClient.signOut();
};

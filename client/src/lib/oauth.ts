import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "./queryClient";
import type { User } from "@shared/schema";

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
}
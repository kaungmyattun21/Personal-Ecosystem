import axios from "axios";
import { getSession } from "next-auth/react";
import { NEXT_PUBLIC_API_URL } from "./env";

export const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // Only works on Client Side. For Server Components, we need to pass headers manually from `getServerSession`.
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

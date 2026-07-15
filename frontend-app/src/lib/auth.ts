import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NEXT_PUBLIC_API_URL } from "@/lib/env";

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${text}`);
  }
  return res.json();
}

const parseJwtExp = (token: string): number => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload).exp * 1000;
  } catch {
    return 0;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const data = await authFetch<{
            user: { id: string; name: string; email: string };
            accessToken: string;
            refreshToken: string;
          }>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, accessToken, refreshToken } = data;
          if (user && accessToken && refreshToken) {
            return { id: user.id, name: user.name, email: user.email, accessToken, refreshToken };
          }
          return null;
        } catch (error) {
          console.error("Credentials login failed:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "google") {
          try {
            const data = await authFetch<{
              user: { id: string };
              accessToken: string;
              refreshToken: string;
            }>("/auth/oauth-login", {
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              imageUrl: user.image,
            });

            const { user: backendUser, accessToken, refreshToken } = data;
            if (backendUser && accessToken && refreshToken) {
              token.id = backendUser.id;
              token.accessToken = accessToken;
              token.refreshToken = refreshToken;
              token.accessTokenExpires = parseJwtExp(accessToken);
            }
          } catch (error) {
            console.error("OAuth backend exchange failed:", error);
            token.error = "OAuthExchangeError";
          }
        } else if (account.provider === "credentials") {
          token.id = user.id;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpires = parseJwtExp(user.accessToken as string);
        }
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      try {
        const data = await authFetch<{
          accessToken: string;
          refreshToken?: string;
        }>("/auth/refresh", { refreshToken: token.refreshToken });

        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken ?? token.refreshToken;
        token.accessTokenExpires = parseJwtExp(data.accessToken);
        token.error = undefined;
        return token;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        token.error = "RefreshAccessTokenError";
        return token;
      }
    },
    async session({ session, token }) {
      session.user = { ...session.user, id: token.id as string };
      session.accessToken = token.accessToken as string;
      session.accessTokenExpires = token.accessTokenExpires as number;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
};

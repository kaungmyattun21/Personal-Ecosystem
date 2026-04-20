import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/lib/env";

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
          const res = await axios.post(`${NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, accessToken, refreshToken } = res.data;

          if (user && accessToken && refreshToken) {
            return {
              id: user.id || user.id,
              name: user.name,
              email: user.email,
              accessToken,
              refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error(
            "Credentials login failed:",
            axios.isAxiosError(error)
              ? error.response?.data || error.message
              : error,
          );
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
      // Initial sign-in step
      if (account && user) {
        if (account.provider === "google") {
          try {
            // Exchange Google profile with our backend
            const res = await axios.post(
              `${NEXT_PUBLIC_API_URL}/auth/oauth-login`,
              {
                email: user.email,
                name: user.name,
                googleId: account.providerAccountId,
                imageUrl: user.image,
              },
            );

            const { user: backendUser, accessToken, refreshToken } = res.data;

            if (backendUser && accessToken && refreshToken) {
              token.id = backendUser.id;
              token.accessToken = accessToken;
              token.refreshToken = refreshToken;
              token.accessTokenExpires = parseJwtExp(accessToken);
            }
          } catch (error) {
            console.error(
              "OAuth backend exchange failed:",
              axios.isAxiosError(error)
                ? error.response?.data || error.message
                : error,
            );
            token.error = "OAuthExchangeError";
          }
        } else if (account.provider === "credentials") {
          // Credentials flow already exchanged tokens in authorize callback
          token.id = user.id;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpires = parseJwtExp(user.accessToken as string);
        }
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it using the /refresh endpoint
      try {
        const res = await axios.post(`${NEXT_PUBLIC_API_URL}/auth/refresh`, {
          refreshToken: token.refreshToken,
        });

        const { accessToken, refreshToken } = res.data;

        token.accessToken = accessToken;
        // If the backend returns a new refresh token we use it, otherwise keep the old one
        token.refreshToken = refreshToken ?? token.refreshToken;
        token.accessTokenExpires = parseJwtExp(accessToken);
        token.error = undefined;
        return token;
      } catch (error) {
        console.error(
          "Error refreshing access token",
          axios.isAxiosError(error)
            ? error.response?.data || error.message
            : error,
        );
        token.error = "RefreshAccessTokenError";
        return token;
      }
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
      };
      session.accessToken = token.accessToken as string;
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

import type { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Example user object type
interface CustomUser extends User {
  id: string;
  email: string;
}

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }

  interface User {
    id: string;
  }
}

const credentialsConfig = CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "User Name", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (credentials?.username === "sk" && credentials?.password === "123") {
      // Returning a user object with required fields
      const user: CustomUser = {
        id: "1",
        name: "Vahid",
        email: "vahid@example.com",
      };
      return user;
    }
    return null;
  },
});

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    credentialsConfig,
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Implement your logic to determine if the user should be signed in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Implement your logic to determine the redirect URL
      return baseUrl;
    },
    async session({ session, token }) {
      // Ensure the session.user is defined and includes the id
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add custom fields to the JWT token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(options);


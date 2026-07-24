import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" } // hidden field for quick static login
      },
      async authorize(credentials, req) {
        // Quick static login support
        if (credentials?.role === 'superadmin' || credentials?.email === "superadmin@example.com") {
          return { id: "3", name: "Super Admin", email: "superadmin@example.com", role: "superadmin" };
        }
        if (credentials?.role === 'admin' || credentials?.email === "admin@example.com") {
          return { id: "2", name: "Admin Jane", email: "admin@example.com", role: "admin" };
        }
        if (credentials?.role === 'user' || credentials?.email === "user@example.com") {
          return { id: "1", name: "John Doe", email: "user@example.com", role: "user" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Custom login page
  },
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

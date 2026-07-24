import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import fs from 'fs';
import path from 'path';

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

        // Check dynamic users from data/users.json
        try {
          const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
          if (fs.existsSync(usersFilePath)) {
            const fileData = fs.readFileSync(usersFilePath, 'utf8');
            const users = JSON.parse(fileData);
            
            const userIndex = users.findIndex((u: any) => 
              u.email.toLowerCase() === credentials?.email?.toLowerCase() && 
              (u.password === credentials?.password || !u.password) // Allow if no password set in mock
            );
            
            if (userIndex !== -1) {
              const user = users[userIndex];
              
              if (user.status?.toLowerCase() === 'inactive') {
                throw new Error("Your account has been deactivated.");
              }
              
              // Update lastLogin
              user.lastLogin = new Date().toISOString();
              users[userIndex] = user;
              fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
              
              return { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role.toLowerCase() 
              };
            }
          }
        } catch (error: any) {
          if (error.message === "Your account has been deactivated.") {
            throw error; // Rethrow custom errors to be caught by NextAuth
          }
          console.error("Error authenticating against mock users:", error);
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

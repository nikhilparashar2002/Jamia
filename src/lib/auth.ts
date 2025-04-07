import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

interface Credentials {
  email: string;
  password: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      firstName: string;
      lastName: string;
    }
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    firstName: string;
    lastName: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials | undefined) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error('Please enter an email and password');
          }

          await connectDB();
          console.log("Connected to MongoDB");
          
          const user = await User.findOne({ email: credentials.email });
          console.log("User search result:", user ? "Found" : "Not found");

          if (!user) {
            console.log("No user found with email:", credentials.email);
            throw new Error('No user found with this email');
          }
          
          if (user.role === 'writer' && user.permit === 'Restricted') {
            console.log("Access denied: Writer account is restricted");
            throw new Error('Access denied: Your account is currently restricted');
          }
          
          const isPasswordValid = await user.comparePassword(credentials.password);
          console.log("Password validation:", isPasswordValid ? "Valid" : "Invalid");
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          await user.updateLastLogin();
          console.log("Login successful for user:", user.email);

          // Create the full name from firstName and lastName
          const fullName = `${user.firstName} ${user.lastName}`;

          return {
            id: user._id.toString(),
            email: user.email,
            name: fullName,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};
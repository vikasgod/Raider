import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials, request) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        const { email, password } = credentials;
        await connectDB(); // Ensure the database is connected before proceeding
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB(); // Ensure the database is connected before proceeding
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            role: "user", // Default role for Google sign-ins
          });
        }
        user.id = existingUser?._id.toString() || user.id; // Ensure the user ID is set
        user.role = existingUser?.role || "user"; // Ensure the user role is set
      }
      return true; // Allow sign-in to proceed
    },
    async jwt({ token, user }) {
      if(user){
        token.role = user?.role || token.role; // Add role to the token
        token.id = user?.id || token.id; // Add id to the token
        token.name = user?.name || token.name; // Add name to the token
        token.email = user?.email || token.email; // Add email to the token
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string; // Add role to the session
        session.user.id = token.id as string; // Add id to the session
        session.user.name = token.name as string; // Add name to the session
        session.user.email = token.email as string; // Add email to the session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
  secret: process.env.BETTER_AUTH_SECRET,
});

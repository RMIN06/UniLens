import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/db/mongodb-client";
import { connectMongoose } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export const authConfig: NextAuthConfig = {
  // Adapter persists OAuth accounts/sessions in Mongo.
  // It shares the "users" collection with our Mongoose User model,
  // so custom fields (role, isStudent) survive round-trips.
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: false,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoose();
        const email = String(credentials?.email ?? "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password ?? "");

        if (!email || !password || password.length > 128) return null;

        const user = await User.findOne({ email }).select(
          "+hashedPassword +failedLoginAttempts +lockUntil"
        );
        if (!user) {
          // Constant-time-ish burn to blunt user-enumeration timing attacks
          await bcrypt.compare(
            password,
            "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpQ0mS1VjOZEqB0W6r7zRKkKt3lWi"
          );
          return null;
        }

        if (user.lockUntil && user.lockUntil > new Date()) return null;

        if (!user.hashedPassword) return null;

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) {
          user.failedLoginAttempts += 1;
          if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
            user.failedLoginAttempts = 0;
          }
          await user.save();
          return null;
        }

        if (
          user.failedLoginAttempts > 0 ||
          (user.lockUntil && user.lockUntil <= new Date())
        ) {
          user.failedLoginAttempts = 0;
          user.lockUntil = null;
          user.lastLoginAt = new Date();
          await user.save();
        } else {
          user.lastLoginAt = new Date();
          await user.save();
        }

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Only accept Google accounts with a verified email
        if (profile?.email_verified !== true) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        await connectMongoose();
        token.uid = user.id;
        token.provider = account?.provider ?? "credentials";

        const dbUser = await User.findOne({
          $or: [{ _id: user.id }, { email: user.email! }],
        });
        if (dbUser) {
          token.uid = String(dbUser._id);
          token.role = dbUser.role;
          token.isStudent = dbUser.isStudent;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as string;
        session.user.isStudent = Boolean(token.isStudent);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

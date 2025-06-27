import NextAuth from "next-auth";
import type { AuthOptions, SessionStrategy } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import type { JWT } from "next-auth/jwt";
import type { Session, User as NextAuthUser, Account } from "next-auth";

const sessionStrategy: SessionStrategy = "jwt";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");
        if (!user.emailVerified) throw new Error("Email not verified");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password!
        );
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar || null,
        };
      },
    }),
  ],

  session: {
    strategy: sessionStrategy,
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // @ts-ignore
      session.user = token.user as NextAuthUser;
      return session;
    },
    async signIn({
      user,
      account,
    }: {
      user: NextAuthUser;
      account: Account | null;
    }) {
      await connectToDB();

      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            emailVerified: true,
            avatar: user.image,
            bio: "",
          });
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl + "/"; // Always redirect to homepage after login
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

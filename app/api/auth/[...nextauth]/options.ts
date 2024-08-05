import prisma from "@/prisma/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout duration

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username...",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials, req) => {
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });
        if (!user) {
          throw new Error("Invalid username or password.");
        }

        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
          throw new Error("Account is locked. Try again later.");
        }

        const match = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (match) {
          await prisma.user.update({
            where: { username: credentials!.username },
            data: {
              failedAttempts: 0,
              lockoutUntil: null,
            },
          });

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          };
        } else {
          const failedAttempts = user.failedAttempts + 1;

          if (failedAttempts >= MAX_ATTEMPTS) {
            await prisma.user.update({
              where: { username: credentials!.username },
              data: {
                failedAttempts,
                lockoutUntil: new Date(Date.now() + LOCKOUT_DURATION),
              },
            });
            throw new Error(
              "Account is locked due to too many failed attempts. Try again later."
            );
          } else {
            await prisma.user.update({
              where: { username: credentials!.username },
              data: { failedAttempts },
            });
            throw new Error("Invalid password");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.role = user?.role;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || "USER";
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default options;

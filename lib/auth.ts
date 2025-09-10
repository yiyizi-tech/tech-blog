import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (isValid) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 安全地处理重定向URL
      try {
        // 如果是相对路径，基于baseUrl构造完整URL
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`
        }
        // 如果是完整URL且属于本站，则使用该URL
        if (url.startsWith(baseUrl)) {
          return url
        }
        // 其他情况返回baseUrl
        return baseUrl
      } catch (error) {
        console.error('Redirect callback error:', error)
        return baseUrl
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.email = user.email as string
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      // 添加登录验证逻辑
      if (account?.provider === 'credentials') {
        // 类型检查
        if (!credentials || typeof credentials !== 'object') {
          return false;
        }
        
        const email = (credentials as { email?: string })?.email;
        const password = (credentials as { password?: string })?.password;
        
        if (!email || !password) {
          return false;
        }
        
        // 验证用户存在性
        const dbUser = await prisma.user.findUnique({
          where: { email: email }
        });
        
        if (!dbUser) {
          console.log('Login failed: User not found', { email })
          return false
        }
        
        if (!dbUser.password) {
          console.log('Login failed: User has no password', { email })
          return false
        }
        
        const isValid = await bcrypt.compare(password, dbUser.password);
        
        if (!isValid) {
          console.log('Login failed: Invalid password', { email })
          return false
        }
        
        console.log('Login successful:', { email })
        return true
      }
      
      return true
    }
  },
  // 添加调试信息
  debug: process.env.NODE_ENV === 'development',
};
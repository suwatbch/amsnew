import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { randomBytes } from 'crypto';
import axios from 'axios';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/handler/employee/login`, {
            Userlogin: credentials?.email,
            Password: credentials?.password,
          });

          const { user, token } = response.data;
          
          if (user && token) {
            // returnข้อมูลเพื่อใช้ใน callback
            return {
              id: user.ID,
              name: `${user.Firstname} ${user.Lastname}`,
              token: token,
              role: user?.Role ?? 'admin',
            };
          } else {
            throw new Error('Invalid login credentials');
          }
        } catch (error:any) {
          throw new Error('ไม่สามารถเข้าสู่ระบบได้ กรุณาลองอีกครั้ง');
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'TOPSECRETWELOVEJEAB',
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          token: token.token as string,
          name: token.name as string,
          id: token.id as string,
          role: token.role as string,
        },
      };
    },
    async jwt({ token, user }) {
      // กำหนด token ที่ได้จาก authorize
      if (user) {
        token.token = (user as any).token; 
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
      }
      return token;
    },
  },
  session: {
    maxAge: 24 * 60 * 60,
    generateSessionToken: () => randomBytes(32).toString('hex'),
  },
};

import type { NextAuthConfig } from "next-auth"
import { credentialsProvider } from "@/auth/credentials-provider"

const isProduction = process.env.NODE_ENV === "production"
const sessionCookieName = isProduction ? "__Secure-authjs.session-token" : "authjs.session-token"

export const authOptions: NextAuthConfig = {
  providers: [credentialsProvider],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true" || !isProduction,
  useSecureCookies: isProduction,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: sessionCookieName,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : ""
        session.user.email = typeof token.email === "string" ? token.email : ""
        session.user.name = typeof token.name === "string" ? token.name : ""
        session.user.image = typeof token.picture === "string" ? token.picture : null
      }

      return session
    },
    authorized({ auth, request }) {
      if (!request.nextUrl.pathname.startsWith("/app")) {
        return true
      }

      return !!auth?.user
    },
  },
}

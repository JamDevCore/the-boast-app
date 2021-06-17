import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Providers.Email({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM
      })
  ],
  database: process.env.MONGODBURL, 
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    redirect: async (url, _) => {
      if (url === '/api/auth/signin') {
        return Promise.resolve('/dashboard')
      }
      return Promise.resolve('/api/auth/signin')
    },
    session: async (session, user, sessionToken) => {
        session.user.id = user.sub;
        return Promise.resolve(session, user, sessionToken)
    }}
});
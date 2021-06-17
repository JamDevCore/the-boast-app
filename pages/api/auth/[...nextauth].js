import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: process.env.NEXTAUTH_URL
    }),
    Providers.Email({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM
        // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
      })
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
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
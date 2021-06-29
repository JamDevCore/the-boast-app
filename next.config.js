
module.exports = {
    webpack: config => {
        config.node = {
          fs: 'empty',
          child_process: 'empty',
          net: 'empty',
          dns: 'empty',
          tls: 'empty',
        };
        return config;
      },
    env: {
        MONGODBURL: process.env.MONGODBURL,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        EMAIL_SERVER: process.env.EMAIL_SERVER,
        EMAIL_FROM: process.env.EMAIL_FROM,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        STRIPE_SK: process.env.STRIPE_SK,
        WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
        URL: process.env.URL,
        PRIVATE_STRIPE_KEY: process.env.PRIVATE_STRIPE_KEY
    }
};

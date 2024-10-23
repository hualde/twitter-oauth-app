import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      environment: {
        hasClientId: !!process.env.TWITTER_CLIENT_ID,
        hasClientSecret: !!process.env.TWITTER_CLIENT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        hasURL: !!process.env.URL,
        url: process.env.URL
      }
    }, null, 2)
  };
};
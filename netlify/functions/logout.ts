import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  return {
    statusCode: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': 'twitter_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  };
};
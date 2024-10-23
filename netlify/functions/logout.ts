import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  const clearCookieOptions = 'HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  return {
    statusCode: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': `twitter_access_token=; ${clearCookieOptions}, twitter_refresh_token=; ${clearCookieOptions}`
    },
  };
};
import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  return {
    statusCode: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': 'twitter_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax, twitter_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
    },
  };
};
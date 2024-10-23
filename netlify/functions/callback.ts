import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';
import cookie from 'cookie';

const clientId = process.env.TWITTER_CLIENT_ID!;
const clientSecret = process.env.TWITTER_CLIENT_SECRET!;
const redirectUri = process.env.URL ? `${process.env.URL}/.netlify/functions/callback` : 'http://localhost:8888/.netlify/functions/callback';

export const handler: Handler = async (event) => {
  const { code, state } = event.queryStringParameters || {};
  const cookies = cookie.parse(event.headers.cookie || '');
  
  if (!code || !state || state !== cookies.twitter_oauth_state) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid state' }),
    };
  }

  try {
    const client = new TwitterApi({ clientId, clientSecret });
    const { accessToken, refreshToken } = await client.loginWithOAuth2({
      code,
      codeVerifier: cookies.twitter_oauth_code_verifier,
      redirectUri,
    });

    return {
      statusCode: 302,
      headers: {
        Location: '/',
        'Set-Cookie': [
          `twitter_access_token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`,
          `twitter_refresh_token=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        ].join(', '),
      },
    };
  } catch (error) {
    console.error('OAuth callback error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' }),
    };
  }
};
import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';
import cookie from 'cookie';

export const handler: Handler = async (event) => {
  const { code, state } = event.queryStringParameters || {};
  const cookies = cookie.parse(event.headers.cookie || '');
  
  try {
    const { state: storedState, codeVerifier } = JSON.parse(cookies.twitter_oauth || '{}');

    if (!code || !state || !storedState || !codeVerifier) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    if (state !== storedState) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid state' })
      };
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!
    });

    const { accessToken, refreshToken } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: `${process.env.URL || 'http://localhost:8888'}/.netlify/functions/callback`
    });

    return {
      statusCode: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `twitter_session=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
      }
    };
  } catch (error) {
    console.error('Callback error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
};
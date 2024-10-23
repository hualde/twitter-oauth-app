import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';
import cookie from 'cookie';

const handler: Handler = async (event) => {
  const { code, state } = event.queryStringParameters || {};
  const cookies = cookie.parse(event.headers.cookie || '');
  const storedState = cookies.twitter_oauth_state;
  const codeVerifier = cookies.twitter_oauth_code_verifier;

  if (!code || !state) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing code or state parameter' })
    };
  }

  if (!storedState || !codeVerifier) {
    console.error('Missing cookies:', { 
      hasCookie: !!event.headers.cookie,
      cookieHeader: event.headers.cookie,
      parsedCookies: cookies 
    });
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Missing authentication cookies',
        debug: {
          hasCookie: !!event.headers.cookie,
          storedState: !!storedState,
          codeVerifier: !!codeVerifier,
          cookies: cookies
        }
      })
    };
  }

  if (state !== storedState) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid state parameter' })
    };
  }

  try {
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
        'Set-Cookie': [
          `twitter_access_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`,
          `twitter_refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`,
          'twitter_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
          'twitter_oauth_code_verifier=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        ]
      },
      multiValueHeaders: {
        'Set-Cookie': [
          `twitter_access_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`,
          `twitter_refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`,
          'twitter_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
          'twitter_oauth_code_verifier=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        ]
      }
    };
  } catch (error) {
    console.error('OAuth callback error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler };
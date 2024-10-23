import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';

export const handler: Handler = async () => {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/callback`;

  if (!clientId || !clientSecret) {
    console.error('Missing required environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Configuration Error',
        message: 'Missing required Twitter credentials'
      })
    };
  }

  try {
    const client = new TwitterApi({
      clientId,
      clientSecret
    });

    const { url, codeVerifier, state } = await client.generateOAuth2AuthLink(
      redirectUri,
      { scope: ['tweet.read', 'tweet.write', 'users.read'] }
    );

    // Configurar cookies con un dominio específico
    const domain = process.env.URL ? new URL(process.env.URL).hostname : 'localhost';
    const cookieOptions = [
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      `Domain=${domain}`,
      'Path=/',
      'Max-Age=3600'
    ].join('; ');

    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': [
          `twitter_oauth_state=${state}; ${cookieOptions}`,
          `twitter_oauth_code_verifier=${codeVerifier}; ${cookieOptions}`
        ],
        'Location': url,
        'Cache-Control': 'no-cache'
      }
    };
  } catch (error) {
    console.error('Error in auth function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Authentication Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    };
  }
};
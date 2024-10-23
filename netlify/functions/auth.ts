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

    return {
      statusCode: 302,
      headers: {
        'Location': url,
        'Cache-Control': 'no-cache',
        'Set-Cookie': [
          `twitter_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`,
          `twitter_oauth_code_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
        ]
      },
      multiValueHeaders: {
        'Set-Cookie': [
          `twitter_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`,
          `twitter_oauth_code_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
        ]
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
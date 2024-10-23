import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';

export const handler: Handler = async () => {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/callback`;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Twitter credentials' })
    };
  }

  try {
    const client = new TwitterApi({ clientId, clientSecret });
    const { url, codeVerifier, state } = await client.generateOAuth2AuthLink(
      redirectUri,
      { scope: ['tweet.read', 'tweet.write', 'users.read'] }
    );

    // Simplificado: una sola cookie con los datos JSON
    const cookieData = JSON.stringify({ state, codeVerifier });
    
    return {
      statusCode: 302,
      headers: {
        'Location': url,
        'Cache-Control': 'no-cache',
        'Set-Cookie': `twitter_oauth=${cookieData}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
};
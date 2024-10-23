import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';
import cookie from 'cookie';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const cookies = cookie.parse(event.headers.cookie || '');
  const accessToken = cookies.twitter_access_token;

  if (!accessToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    const client = new TwitterApi(accessToken);
    const { text } = JSON.parse(event.body || '{}');
    
    await client.v2.tweet(text);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error posting tweet:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to post tweet' }),
    };
  }
};
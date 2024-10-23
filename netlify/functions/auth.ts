import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';

const clientId = process.env.TWITTER_CLIENT_ID!;
const clientSecret = process.env.TWITTER_CLIENT_SECRET!;
const redirectUri = process.env.URL ? `${process.env.URL}/.netlify/functions/callback` : 'http://localhost:8888/.netlify/functions/callback';

export const handler: Handler = async () => {
  const client = new TwitterApi({ clientId, clientSecret });
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    redirectUri,
    { scope: ['tweet.read', 'tweet.write', 'users.read'] }
  );

  return {
    statusCode: 302,
    headers: {
      Location: url,
      'Set-Cookie': `twitter_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      'Set-Cookie': `twitter_oauth_code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    },
  };
};
import { Handler } from '@netlify/functions';
import cookie from 'cookie';

export const handler: Handler = async (event) => {
  const cookies = cookie.parse(event.headers.cookie || '');
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      authenticated: !!cookies.twitter_session
    })
  };
};
// netlify/functions/chat.js
exports.handler = async (event, context) => {
  console.log('Function started!');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Has API key:', !!process.env.ANTHROPIC_API_KEY);
  
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('CORS request');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Wrong method');
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the incoming message
  let body;
  try {
    console.log('Parsing body...');
    body = JSON.parse(event.body);
    console.log('Body parsed:', body);
  } catch (error) {
    console.log('JSON parse error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { message } = body;
  console.log('Message:', message);
  
  if (!message) {
    console.log('No message provided');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Message is required' })
    };
  }

  // Simple test response first
  console.log('Returning test response');
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify({
      response: "Hello! This is a test response from your Netlify function. If you're seeing this, the function is working!"
    })
  };
};

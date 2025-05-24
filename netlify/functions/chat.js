// netlify/functions/chat.js
exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
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
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the incoming message
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { message } = body;
  
  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Message is required' })
    };
  }

  try {
    // Call Claude API with your API key from environment variables
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: `You are Talbot, a warm and empathetic mental health companion. You provide support between therapy sessions. You are:
            - A good listener who validates feelings
            - Gentle and non-judgmental
            - Helpful with coping strategies when appropriate
            - Clear that you're a supportive companion, not a replacement for professional therapy
            - Encouraging users to bring insights to their therapist
            Keep responses conversational, supportive, and not too long since this is a voice interface.`
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        response: data.content[0].text
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    // Return a fallback response if Claude API fails
    const fallbackResponses = [
      "I'm having trouble connecting right now, but I'm still here to listen. Can you tell me more about what's on your mind?",
      "I'm experiencing some technical difficulties, but your feelings are important. What would help you feel supported right now?",
      "I'm here for you, even though I'm having connection issues. How are you feeling in this moment?"
    ];
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      })
    };
  }
};

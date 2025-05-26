// Simplified netlify/functions/chat.js for testing
exports.handler = async (event, context) => {
  console.log('Function started!');
  
  // Handle CORS
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { message, profile } = body;
  
  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Message is required' })
    };
  }

  try {
    console.log('Calling Claude API...');
    
    // Build contextual message with profile (simplified)
    let contextualMessage = message;
    if (profile && profile.preferredName) {
      contextualMessage = `The user's name is ${profile.preferredName}. User message: ${message}`;
    }
    
// systemPrompt to control how Talbot responds:
const systemPrompt = `You are Talbot, a supportive mental health companion designed to provide personalized, empathetic support through thoughtful conversation.

## Core Approach:
- Use therapeutic questioning techniques to help users explore the root causes of their feelings, similar to how a skilled therapist guides exploration
- Ask thoughtful follow-up questions that promote insight and self-discovery
- Validate emotions while gently probing deeper into underlying patterns, triggers, and connections
- Focus on understanding the "why" behind feelings and reactions

## Personalization:
- Always reference the user's profile information: diagnoses, medications, triggers, age, name, and communication preferences
- Consider how their conditions interact with each other in their current situation (e.g., how BPD, OCD, and ADHD might all influence a particular experience)
- Remember and build on previous conversations, referencing specific people, situations, and ongoing challenges by name
- Acknowledge their progress, setbacks, and patterns over time

## Communication Style:
- Mirror the user's communication style - match their tone, formality level, and energy
- Use their preferred language and terminology rather than clinical jargon
- Respond with warmth, empathy, and without judgment
- Be conversational and genuine, not robotic or generic
- Adapt to whether they prefer direct feedback, gentle exploration, or supportive listening

## Relationship Building:
- Respond as if you genuinely know and care about this specific person's journey
- Ask questions that are specific to their unique circumstances rather than generic mental health questions
- Acknowledge the complexity of their mental health experiences
- Provide a safe space for honest expression without fear of judgment

Remember: Every response should feel personal to this individual user, not like a generic mental health response.`;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: contextualMessage
          }
        ]
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Claude API success!');
    
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
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        response: "I'm here for you, even though I'm having some connection issues. How are you feeling right now?"
      })
    };
  }
};

// Enhanced Mental Health Knowledge Base for Talbot
// Sources: NIMH, SAMHSA, WHO - All Public Domain

const MENTAL_HEALTH_KNOWLEDGE = {
  
  // CORE SYSTEM PROMPT WITH CLINICAL KNOWLEDGE
  systemPrompt: `You are Talbot, a warm, empathetic, and clinically-informed mental health companion. You provide support between therapy sessions with evidence-based knowledge from NIMH, SAMHSA, and WHO.

CLINICAL KNOWLEDGE BASE:

ANXIETY DISORDERS:
- Affect 1 in 4 people (25% of population), most common mental health condition
- Types: Generalized Anxiety Disorder (GAD), Panic Disorder, Social Anxiety, Specific Phobias, Agoraphobia
- Symptoms: Excessive worry, physical tension, avoidance behaviors, panic attacks, restlessness
- Evidence-based treatments: CBT (most effective), exposure therapy, SSRIs/SNRIs, mindfulness
- GAD: Chronic excessive worry about everyday situations for 6+ months
- Panic Disorder: Recurrent panic attacks with physical symptoms (chest pain, palpitations, dizziness)
- Often co-occurs with depression (50-60% comorbidity rate)

DEPRESSION:
- Major depressive episodes: Persistent sadness, loss of interest, fatigue, sleep changes, appetite changes
- 50.6% of adults with depression receive treatment annually
- Evidence-based treatments: CBT, IPT, antidepressants (SSRIs/SNRIs), behavioral activation
- Often linked to chronic medical conditions (diabetes, heart disease, autoimmune disorders)
- Higher risk in women, often emerges in adolescence/early adulthood
- Treatment-resistant depression requires specialized approaches

TRAUMA & PTSD:
- Results from exposure to actual/threatened death, serious injury, or sexual violence
- Symptoms: Intrusive memories, avoidance, negative mood changes, hyperarousal
- Evidence-based treatments: Trauma-focused CBT, EMDR, prolonged exposure therapy
- Co-occurs frequently with depression, anxiety, substance use

EVIDENCE-BASED TREATMENTS:
- Cognitive Behavioral Therapy (CBT): Most researched, effective for anxiety, depression, trauma
- Dialectical Behavior Therapy (DBT): Effective for emotional regulation, borderline personality
- Acceptance and Commitment Therapy (ACT): Mindfulness-based, goal-setting approach
- Exposure therapy: Gold standard for phobias, panic disorder, PTSD
- Mindfulness-based interventions: Proven for anxiety, depression, stress reduction

MEDICATIONS:
- SSRIs (Prozac, Zoloft, Lexapro): First-line for anxiety and depression
- SNRIs (Effexor, Cymbalta): Effective for anxiety, depression, chronic pain
- Benzodiazepines: Short-term anxiety relief only, high dependence risk
- Antidepressants take 4-6 weeks for full effect, may increase suicidal thoughts initially in young adults

CRISIS RECOGNITION:
- Suicidal ideation: Thoughts of death, hopelessness, making plans, giving away possessions
- Severe depression: Unable to function, persistent thoughts of death, psychotic features
- Panic attacks: Intense fear, physical symptoms, feeling of losing control
- Always refer to 988 Suicide & Crisis Lifeline or emergency services for immediate danger

THERAPEUTIC RELATIONSHIP:
- Validate feelings and experiences without judgment
- Use person-first language ("person with depression" not "depressed person")
- Encourage professional treatment while providing support
- Maintain clear boundaries - you provide support, not therapy
- Focus on strengths and coping resources

COMMUNICATION STYLE:
- Use reflective listening and empathetic responses
- Ask open-ended questions to explore feelings
- Normalize mental health struggles - very common, treatable
- Provide psychoeducation about conditions and treatments
- Encourage self-care and healthy coping strategies
- Be culturally sensitive and trauma-informed

Remember: You are a supportive companion, not a replacement for professional mental health care. Always encourage users to work with qualified mental health professionals for diagnosis and treatment.`,

  // CONDITION-SPECIFIC KNOWLEDGE
  conditions: {
    anxiety: {
      prevalence: "31.9% of adolescents, 25% of adults experience anxiety disorders",
      symptoms: [
        "Excessive worry or fear",
        "Physical tension and restlessness", 
        "Avoidance of situations",
        "Sleep disturbances",
        "Difficulty concentrating",
        "Panic attacks (for panic disorder)",
        "Physical symptoms: racing heart, sweating, trembling"
      ],
      treatments: [
        "Cognitive Behavioral Therapy (CBT) - most effective",
        "Exposure therapy for specific phobias",
        "SSRIs/SNRIs (Prozac, Zoloft, Lexapro, Effexor)",
        "Mindfulness and relaxation techniques",
        "Regular exercise and stress management",
        "Gradual exposure to feared situations"
      ],
      copingStrategies: [
        "Deep breathing exercises (4-7-8 technique)",
        "Progressive muscle relaxation",
        "Grounding techniques (5-4-3-2-1 sensory method)",
        "Regular sleep schedule",
        "Limit caffeine and alcohol",
        "Mindfulness meditation",
        "Physical exercise"
      ]
    },
    
    depression: {
      prevalence: "59.3 million adults (23.1%) live with mental illness, depression is leading cause of disability",
      symptoms: [
        "Persistent sadness or emptiness",
        "Loss of interest in activities",
        "Significant weight changes",
        "Sleep disturbances (insomnia or hypersomnia)",
        "Fatigue and loss of energy",
        "Feelings of worthlessness or guilt",
        "Difficulty concentrating",
        "Thoughts of death or suicide"
      ],
      treatments: [
        "Cognitive Behavioral Therapy (CBT)",
        "Interpersonal Therapy (IPT)", 
        "Antidepressants (SSRIs/SNRIs)",
        "Behavioral activation",
        "Problem-solving therapy",
        "Light therapy (for seasonal depression)",
        "Brain stimulation (TMS, ECT for severe cases)"
      ],
      copingStrategies: [
        "Maintain daily routines",
        "Regular physical activity (30 min walking)",
        "Social connection and support",
        "Balanced nutrition",
        "Adequate sleep (7-9 hours)",
        "Enjoyable activities (behavioral activation)",
        "Journaling and self-reflection"
      ]
    }
  },

  // TREATMENT APPROACHES
  treatments: {
    cbt: {
      description: "Cognitive Behavioral Therapy - most researched and effective psychotherapy",
      techniques: [
        "Identifying negative thought patterns",
        "Challenging cognitive distortions",
        "Behavioral experiments",
        "Homework assignments",
        "Mood and thought monitoring",
        "Problem-solving skills"
      ],
      effectiveFor: ["Depression", "Anxiety disorders", "PTSD", "Eating disorders", "Substance use"]
    },
    
    mindfulness: {
      description: "Evidence-based practices for present-moment awareness and acceptance",
      techniques: [
        "Mindful breathing",
        "Body scan meditation",
        "Loving-kindness meditation",
        "Mindful walking",
        "Acceptance and non-judgment",
        "Present-moment awareness"
      ],
      benefits: ["Reduced anxiety", "Improved emotional regulation", "Decreased rumination", "Better stress management"]
    }
  },

  // CRISIS RESOURCES
  crisis: {
    suicideRisk: [
      "Talking about wanting to die or kill themselves",
      "Looking for ways to kill themselves",
      "Talking about feeling hopeless or having no reason to live",
      "Talking about feeling trapped or in unbearable pain",
      "Increased use of alcohol or drugs",
      "Acting anxious or agitated",
      "Withdrawing from family and friends",
      "Changing eating and sleeping habits",
      "Taking risks that could lead to death",
      "Giving away prized possessions",
      "Saying goodbye to loved ones",
      "Putting affairs in order, making a will"
    ],
    resources: {
      "988 Suicide & Crisis Lifeline": "Call or text 988 - 24/7 confidential support",
      "Crisis Text Line": "Text HOME to 741741",
      "Veterans Crisis Line": "Call 988, press 1",
      "Emergency": "Call 911 for immediate danger"
    }
  }
};

// Function to update Netlify function with enhanced knowledge
function updateChatFunctionWithKnowledge() {
  return `
// Enhanced netlify/functions/chat.js with clinical knowledge
exports.handler = async (event, context) => {
  console.log('Function started with enhanced clinical knowledge!');
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

  const { message, profile } = body;
  console.log('Message:', message);
  console.log('Has profile:', !!profile);
  
  if (!message) {
    console.log('No message provided');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Message is required' })
    };
  }

  try {
    console.log('Calling Claude API with enhanced clinical knowledge...');
    
    // Build enhanced system prompt with clinical knowledge
    const enhancedSystemPrompt = \`${MENTAL_HEALTH_KNOWLEDGE.systemPrompt}\`;
    
    // Build contextual message with profile
    let contextualMessage = message;
    if (profile) {
      let context = "User Profile Context:\\n";
      
      if (profile.preferredName) {
        context += \`- Call me: \${profile.preferredName}\\n\`;
      }
      
      if (profile.diagnoses) {
        context += \`- Mental health conditions: \${profile.diagnoses}\\n\`;
      }
      
      if (profile.medications) {
        context += \`- Current medications: \${profile.medications}\\n\`;
      }
      
      if (profile.treatmentHistory) {
        context += \`- Treatment background: \${profile.treatmentHistory}\\n\`;
      }
      
      if (profile.communicationStyle && profile.communicationStyle.length > 0) {
        context += \`- Communication preferences: \${profile.communicationStyle.join(', ')}\\n\`;
      }
      
      if (profile.triggers) {
        context += \`- Sensitive topics: \${profile.triggers}\\n\`;
      }
      
      if (profile.therapyGoals) {
        context += \`- Current therapy goals: \${profile.therapyGoals}\\n\`;
      }
      
      if (profile.copingStrategies) {
        context += \`- Effective coping strategies: \${profile.copingStrategies}\\n\`;
      }
      
      if (profile.currentStressors) {
        context += \`- Current stressors: \${profile.currentStressors}\\n\`;
      }
      
      contextualMessage = context + "\\nUser message: " + message;
    }
    
    // Call Claude API with enhanced system prompt
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: enhancedSystemPrompt,
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
      console.log('Error response body:', errorText);
      throw new Error(\`Claude API error: \${response.status} - \${errorText}\`);
    }

    const data = await response.json();
    console.log('Claude API success with enhanced clinical knowledge!');
    
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
    console.error('Claude API Error:', error);
    
    // Clinical fallback responses
    const clinicalFallbacks = [
      "I'm experiencing some technical difficulties right now, but I want you to know that your feelings and experiences are completely valid. What's most important to you to talk through right now?",
      "I'm having trouble with my connection, but I'm still here to support you. Sometimes just talking through what's on your mind can be helpful, even when technology isn't cooperating perfectly.",
      "Technical issues aside, you took an important step by reaching out. That shows real strength. How are you feeling in this moment, and what kind of support would be most helpful?"
    ];
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        response: clinicalFallbacks[Math.floor(Math.random() * clinicalFallbacks.length)]
      })
    };
  }
};
`;
}

console.log("🎯 ENHANCED MENTAL HEALTH KNOWLEDGE BASE COMPILED!");
console.log("📚 Sources: NIMH, SAMHSA, WHO (All Public Domain)");
console.log("🧠 Clinical Knowledge: Anxiety, Depression, Evidence-Based Treatments, Crisis Recognition");
console.log("💡 Ready to make Talbot incredibly clinically informed!");

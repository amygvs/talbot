// AI Response Manager - Handles AI responses and therapeutic patterns
class AIResponseManager {
    constructor(profileManager) {
        this.profileManager = profileManager;
    }

    async getAIResponse(message) {
        try {
            const contextualMessage = this.profileManager.buildContextualMessage(message);
            
            // For development, use local therapeutic response simulation
            // In production, this would call your actual AI API
            return await this.simulateTherapeuticResponse(message, contextualMessage);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            return this.getFallbackResponse();
        }
    }

    // Simulate therapeutic responses for development/fallback
    async simulateTherapeuticResponse(originalMessage, contextualMessage) {
        const message = originalMessage.toLowerCase();
        
        // Look for emotional keywords and respond therapeutically
        if (this.containsKeywords(message, ['anxious', 'anxiety', 'worried', 'panic'])) {
            return this.getRandomResponse(TalbotConfig.RESPONSE_PATTERNS.anxiety);
        }
        
        if (this.containsKeywords(message, ['sad', 'depressed', 'down', 'hopeless', 'empty'])) {
            return this.getRandomResponse(TalbotConfig.RESPONSE_PATTERNS.sadness);
        }
        
        if (this.containsKeywords(message, ['angry', 'frustrated', 'mad', 'furious', 'rage'])) {
            return this.getRandomResponse(TalbotConfig.RESPONSE_PATTERNS.anger);
        }
        
        if (this.containsKeywords(message, ['alone', 'lonely', 'abandon', 'isolated', 'rejected'])) {
            return this.getRandomResponse(TalbotConfig.RESPONSE_PATTERNS.loneliness);
        }
        
        if (this.containsKeywords(message, ['overwhelmed', 'too much', 'stressed', 'pressure', 'burden'])) {
            return this.getRandomResponse(TalbotConfig.RESPONSE_PATTERNS.overwhelm);
        }

        // BPD-specific responses (if user has BPD in profile)
        if (this.profileManager.getProfile()?.diagnoses?.toLowerCase().includes('bpd')) {
            if (this.containsKeywords(message, ['leaving', 'abandon', 'reject', 'end', 'break up'])) {
                return "I can hear how frightening that possibility feels. Abandonment fears can be so intense and overwhelming. What's coming up for you when you imagine that scenario? What are you telling yourself about what it would mean?";
            }
            
            if (this.containsKeywords(message, ['intense', 'extreme', 'all or nothing', 'black and white'])) {
                return "It sounds like you're experiencing some really intense feelings right now. That's part of having a sensitive emotional system. What do you think might be driving those strong reactions? What would it be like to sit with these feelings without needing to act on them?";
            }
        }

        // ADHD-specific responses
        if (this.profileManager.getProfile()?.diagnoses?.toLowerCase().includes('adhd')) {
            if (this.containsKeywords(message, ['focus', 'concentrate', 'distracted', 'forget', 'procrastinate'])) {
                return "ADHD brains work differently, and that can be really frustrating sometimes. It sounds like you're being hard on yourself about this. What would it be like to approach this with some self-compassion? What do you think your brain might need right now to function better?";
            }
        }

        // OCD-specific responses
        if (this.profileManager.getProfile()?.diagnoses?.toLowerCase().includes('ocd')) {
            if (this.containsKeywords(message, ['thoughts', 'intrusive', 'checking', 'ritual', 'compulsion'])) {
                return "OCD can create such distressing thoughts and urges. It sounds like your mind is working overtime right now. What's it like to have these thoughts? How are you distinguishing between what OCD is telling you and what you actually believe?";
            }
        }

        // Relationship-focused responses
        if (this.containsKeywords(message, ['relationship', 'partner', 'friend', 'family', 'conflict'])) {
            return "Relationships can bring up so many complex feelings. It sounds like this is really affecting you. What do you think this situation might be triggering for you? What does this relationship mean to you?";
        }

        // Self-harm or suicidal ideation (crisis response)
        if (this.containsKeywords(message, ['hurt myself', 'kill myself', 'suicide', 'end it all', 'not worth living'])) {
            return this.getCrisisResponse();
        }

        // Work/life stress
        if (this.containsKeywords(message, ['work', 'job', 'boss', 'career', 'money', 'financial'])) {
            return "Work stress can really take a toll on our mental health. It sounds like this is weighing heavily on you. What do you think this situation represents for you beyond just the practical concerns? What fears or needs might be underneath these work worries?";
        }

        // Default therapeutic response
        return this.getDefaultTherapeuticResponse();
    }

    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getFallbackResponse() {
        return this.getRandomResponse(TalbotConfig.FALLBACK_RESPONSES);
    }

    getDefaultTherapeuticResponse() {
        const responses = [
            "That sounds really significant for you. What do you think is at the heart of those feelings?",
            "I can hear that this is affecting you quite a bit. What comes up for you when you think about why this might be hitting you so hard?",
            "It sounds like there's a lot going on beneath the surface there. What do you think might be driving those reactions?",
            "That must feel pretty intense. When you notice yourself feeling this way, what thoughts tend to go through your head?",
            "I'm hearing that this is really important to you. What would it mean if things were different in this situation?",
            "It seems like this is touching on something deeper for you. What does this situation remind you of, if anything?",
            "That sounds like it's weighing on you, mate. What do you think your mind is trying to tell you about this?",
            "I can hear the emotion in what you're sharing. What would it be like to sit with these feelings for a moment?",
            "It sounds like this is bringing up a lot for you. What do you think would help you feel more grounded right now?",
            "That's a lot to process. What's the most important thing you want me to understand about what you're going through?"
        ];
        
        return this.getRandomResponse(responses);
    }

    getCrisisResponse() {
        const crisisResponse = `I'm really concerned about what you're sharing, mate. These thoughts about hurting yourself are serious, and I want you to get proper support right away.

Please reach out for immediate help:
• Emergency Services: ${TalbotConfig.CRISIS_RESOURCES.emergency}
• Lifeline: ${TalbotConfig.CRISIS_RESOURCES.lifeline}
• Beyond Blue: ${TalbotConfig.CRISIS_RESOURCES.beyondBlue}

You don't have to go through this alone. There are people who want to help you right now. Can you reach out to one of these services or someone you trust?`;

        return crisisResponse;
    }

    // Method to call actual AI API (for production use)
    async callAIAPI(contextualMessage) {
        try {
            // This would be replaced with your actual API call
            // For example, calling Claude API or your Netlify function
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: contextualMessage,
                    systemPrompt: TalbotConfig.SYSTEM_PROMPT,
                    profile: this.profileManager.getProfile()
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
            
        } catch (error) {
            console.error('Error calling AI API:', error);
            throw error;
        }
    }

    // Helper method to personalize responses based on profile
    personalizeResponse(response) {
        const profile = this.profileManager.getProfile();
        if (!profile) return response;

        // Add user's preferred name if available
        if (profile.preferredName && !response.includes(profile.preferredName)) {
            // Occasionally add the name for a more personal touch
            if (Math.random() < 0.3) {
                response = response.replace(/^(.*?[.!?])/, `$1 ${profile.preferredName},`);
            }
        }

        // Adjust tone based on communication preferences
        if (profile.communicationStyle) {
            if (profile.communicationStyle.includes('gentle')) {
                response = response.replace(/\?$/g, ', if that feels okay to explore?');
            }
            
            if (profile.communicationStyle.includes('direct')) {
                response = response.replace(/might be|could be|perhaps/g, 'is');
            }
            
            if (profile.communicationStyle.includes('encouraging')) {
                response += " You're doing really well by talking about this.";
            }
        }

        return response;
    }

    // Method to analyze message for emotional content
    analyzeEmotionalContent(message) {
        const emotionalIndicators = {
            intensity: 0,
            primaryEmotion: null,
            triggers: [],
            urgency: 'low'
        };

        const message_lower = message.toLowerCase();

        // Check for crisis indicators
        const crisisWords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself'];
        if (crisisWords.some(word => message_lower.includes(word))) {
            emotionalIndicators.urgency = 'crisis';
            emotionalIndicators.intensity = 10;
        }

        // Check for high intensity words
        const intensityWords = ['extremely', 'unbearable', 'overwhelming', 'intense', 'severe', 'terrible'];
        if (intensityWords.some(word => message_lower.includes(word))) {
            emotionalIndicators.intensity = Math.max(emotionalIndicators.intensity, 8);
            emotionalIndicators.urgency = 'high';
        }

        // Identify primary emotion
        const emotions = {
            anxiety: ['anxious', 'worried', 'panic', 'fear', 'nervous'],
            sadness: ['sad', 'depressed', 'hopeless', 'empty', 'down'],
            anger: ['angry', 'frustrated', 'mad', 'rage', 'furious'],
            loneliness: ['alone', 'lonely', 'isolated', 'abandoned']
        };

        for (const [emotion, keywords] of Object.entries(emotions)) {
            if (keywords.some(keyword => message_lower.includes(keyword))) {
                emotionalIndicators.primaryEmotion = emotion;
                break;
            }
        }

        return emotionalIndicators;
    }
}

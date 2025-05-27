// Enhanced Speech Manager with ElevenLabs Text-to-Speech
class SpeechManager {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.bestVoice = null;
        this.currentAudio = null;
        
        // ElevenLabs configuration
        this.useElevenLabs = true; // Set to false to use browser TTS
        this.elevenLabsApiKey = null; // Will be set from environment
        this.selectedVoiceId = 'pNInz6obpgDQGcFmaJgB'; // Default: Adam (warm male voice)
        // Alternative voices:
        // 'EXAVITQu4vr4xnSDxMaL' - Bella (young female)
        // 'ErXwobaYiN019PkySvjV' - Antoni (young male)  
        // 'VR6AewLTigWG4xSOukaG' - Arnold (crisp male)
        // 'pqHfZKP75CvOlQylNhV4' - Bill (strong male)
        
        this.initializeElements();
        this.initializeSpeech();
        this.bindEvents();
        this.checkElevenLabsAPI();
    }

    initializeElements() {
        this.voiceButton = document.getElementById('voice-button');
        this.statusText = document.getElementById('status-text');
        this.statusIndicator = document.getElementById('status-indicator');
        this.messageInput = document.getElementById('message-input');
    }

    async checkElevenLabsAPI() {
        // Check if we can use ElevenLabs
        try {
            const response = await fetch('/.netlify/functions/get-elevenlabs-key');
            if (response.ok) {
                const data = await response.json();
                this.elevenLabsApiKey = data.apiKey;
                console.log('ElevenLabs API available');
            } else {
                console.log('ElevenLabs API not available, using browser TTS');
                this.useElevenLabs = false;
            }
        } catch (error) {
            console.log('ElevenLabs API check failed, using browser TTS');
            this.useElevenLabs = false;
        }
    }

    initializeSpeech() {
        this.initializeSpeechRecognition();
        this.initializeSpeechSynthesis();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-AU'; // Australian English
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceButton();
                this.updateStatus('Listening...', '👂');
                this.onListeningStart?.();
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.onSpeechResult?.(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showError('Voice recognition error. Please try again.');
                this.stopListening();
            };
            
            this.recognition.onend = () => {
                this.stopListening();
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.voiceButton.style.display = 'none';
        }
    }

    initializeSpeechSynthesis() {
        if (this.synthesis) {
            this.loadVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    loadVoices() {
        const voices = this.synthesis.getVoices();
        console.log(`Loaded ${voices.length} browser voices`);
        this.bestVoice = this.selectBestVoice(voices);
        if (this.bestVoice) {
            console.log(`Selected fallback voice: ${this.bestVoice.name}`);
        }
    }

    selectBestVoice(voices) {
        if (!voices || voices.length === 0) return null;
        
        let bestVoice = null;
        let highestScore = 0;
        
        voices.forEach(voice => {
            if (!voice.lang.startsWith('en')) return;
            
            let score = 0;
            
            // Prefer Australian/British voices for warmth
            if (voice.lang.includes('AU')) score += 20;
            if (voice.lang.includes('GB')) score += 15;
            
            // Voice quality preferences
            if (/karen|samantha|allison|ava/i.test(voice.name)) score += 15;
            if (/female/i.test(voice.name)) score += 10;
            if (voice.localService) score += 10;
            if (voice.default) score += 5;
            
            if (score > highestScore) {
                highestScore = score;
                bestVoice = voice;
            }
        });
        
        return bestVoice;
    }

    bindEvents() {
        // Voice button events - touch events for mobile
        this.voiceButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startListening();
        });
        
        this.voiceButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopListening();
        });
        
        // Voice button events - mouse events for desktop
        this.voiceButton.addEventListener('mousedown', () => this.startListening());
        this.voiceButton.addEventListener('mouseup', () => this.stopListening());
        this.voiceButton.addEventListener('mouseleave', () => this.stopListening());
        
        // Stop speech when user starts typing
        this.messageInput.addEventListener('input', () => {
            if (this.isSpeaking) {
                this.stopSpeaking();
            }
        });
    }

    // Speech Recognition Methods
    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateVoiceButton();
            this.updateStatus('Ready to listen', '💙');
        }
    }

    // Enhanced Text-to-Speech with ElevenLabs
    async speakMessage(text) {
        if (!text) return;
        
        // Stop any current speech
        this.stopSpeaking();
        
        // Pre-process text for more natural speech
        const naturalText = this.makeTextMoreNatural(text);
        
        if (this.useElevenLabs && this.elevenLabsApiKey) {
            await this.speakWithElevenLabs(naturalText);
        } else {
            this.speakWithBrowser(naturalText);
        }
    }

    async speakWithElevenLabs(text) {
        try {
            console.log('Using ElevenLabs TTS for natural speech');
            
            this.isSpeaking = true;
            this.updateVoiceButton();
            this.updateStatus('Talbot is speaking...', '🗣️');

            // Call ElevenLabs API through Netlify function
            const response = await fetch('/.netlify/functions/elevenlabs-tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    voice_id: this.selectedVoiceId,
                    voice_settings: {
                        stability: 0.75,        // Voice consistency
                        similarity_boost: 0.85, // Voice similarity to original
                        style: 0.5,             // Emotional expressiveness
                        use_speaker_boost: true // Enhance clarity
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status}`);
            }

            // Get audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Play audio
            this.currentAudio = new Audio(audioUrl);
            
            this.currentAudio.onended = () => {
                this.isSpeaking = false;
                this.updateVoiceButton();
                this.updateStatus('Ready to listen', '💙');
                URL.revokeObjectURL(audioUrl);
            };
            
            this.currentAudio.onerror = (error) => {
                console.error('Audio playback error:', error);
                this.isSpeaking = false;
                this.updateVoiceButton();
                this.updateStatus('Ready to listen', '💙');
                URL.revokeObjectURL(audioUrl);
            };
            
            await this.currentAudio.play();
            
        } catch (error) {
            console.error('ElevenLabs TTS error:', error);
            console.log('Falling back to browser TTS');
            
            // Fallback to browser TTS
            this.speakWithBrowser(text);
        }
    }

    speakWithBrowser(text) {
        console.log('Using browser TTS');
        
        if (!this.synthesis) return;
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Enhanced voice settings for warmth
        this.currentUtterance.rate = 0.85;  // Slightly slower for thoughtfulness
        this.currentUtterance.pitch = 1.1;  // Slightly higher for warmth
        this.currentUtterance.volume = 0.9; // Clear but not harsh
        
        // Use the best available voice
        if (this.bestVoice) {
            this.currentUtterance.voice = this.bestVoice;
        }
        
        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            this.updateVoiceButton();
            this.updateStatus('Talbot is speaking...', '🗣️');
        };
        
        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            this.updateVoiceButton();
            this.updateStatus('Ready to listen', '💙');
        };
        
        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isSpeaking = false;
            this.updateVoiceButton();
            this.updateStatus('Ready to listen', '💙');
        };
        
        // Small delay to ensure voice selection works
        setTimeout(() => {
            this.synthesis.speak(this.currentUtterance);
        }, 100);
    }

    makeTextMoreNatural(text) {
        let naturalText = text;
        
        // Add thoughtful pauses before important phrases
        naturalText = naturalText.replace(/\. (I understand|I hear|That sounds|It sounds like)/g, '. $1');
        naturalText = naturalText.replace(/\. (How are|What|When|Where|Why)/g, '. $1');
        
        // Remove excessive punctuation that might cause awkward pauses
        naturalText = naturalText.replace(/\.{2,}/g, '.');
        naturalText = naturalText.replace(/!{2,}/g, '!');
        naturalText = naturalText.replace(/\?{2,}/g, '?');
        
        // Soften clinical language for more human speech
        naturalText = naturalText.replace(/\btechniques\b/g, 'ways that might help');
        naturalText = naturalText.replace(/\bstrategies\b/g, 'things you can try');
        naturalText = naturalText.replace(/\bimplement\b/g, 'try');
        naturalText = naturalText.replace(/\butilize\b/g, 'use');
        
        // Make it more conversational
        naturalText = naturalText.replace(/^(Here are|These are)/g, 'Some things that might help are');
        naturalText = naturalText.replace(/\bAdditionally\b/g, 'Also');
        naturalText = naturalText.replace(/\bFurthermore\b/g, 'And');
        naturalText = naturalText.replace(/\bHowever\b/g, 'But');
        
        return naturalText;
    }

    stopSpeaking() {
        // Stop ElevenLabs audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        
        // Stop browser TTS
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.cancel();
        }
        
        this.isSpeaking = false;
        this.updateVoiceButton();
        this.updateStatus('Ready to listen', '💙');
    }

    // Voice Selection Methods
    async getAvailableVoices() {
        if (!this.useElevenLabs || !this.elevenLabsApiKey) {
            return this.getBrowserVoices();
        }
        
        try {
            const response = await fetch('/.netlify/functions/elevenlabs-voices');
            if (response.ok) {
                const data = await response.json();
                return data.voices;
            }
        } catch (error) {
            console.error('Error fetching ElevenLabs voices:', error);
        }
        
        return this.getBrowserVoices();
    }

    getBrowserVoices() {
        return this.synthesis.getVoices().filter(voice => 
            voice.lang.startsWith('en')
        ).map(voice => ({
            id: voice.name,
            name: voice.name,
            category: 'Browser',
            preview_url: null
        }));
    }

    setVoice(voiceId) {
        if (this.useElevenLabs) {
            this.selectedVoiceId = voiceId;
            console.log('Selected ElevenLabs voice:', voiceId);
        } else {
            const voice = this.synthesis.getVoices().find(v => v.name === voiceId);
            if (voice) {
                this.bestVoice = voice;
                console.log('Selected browser voice:', voice.name);
            }
        }
    }

    // UI Update Methods
    updateVoiceButton() {
        this.voiceButton.classList.remove('listening', 'speaking');
        
        if (this.isListening) {
            this.voiceButton.classList.add('listening');
            this.voiceButton.innerHTML = '⏹️';
        } else if (this.isSpeaking) {
            this.voiceButton.classList.add('speaking');
            this.voiceButton.innerHTML = '🔊';
        } else {
            this.voiceButton.innerHTML = '🎤';
        }
    }

    updateStatus(text, indicator) {
        this.statusText.textContent = text;
        this.statusIndicator.textContent = indicator;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.querySelector('.chat-container').insertBefore(errorDiv, document.getElementById('messages'));
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Event callback setters
    setOnListeningStart(callback) {
        this.onListeningStart = callback;
    }

    setOnSpeechResult(callback) {
        this.onSpeechResult = callback;
    }

    // Getters for state
    getIsListening() {
        return this.isListening;
    }

    getIsSpeaking() {
        return this.isSpeaking;
    }

    getIsUsingElevenLabs() {
        return this.useElevenLabs && this.elevenLabsApiKey;
    }
}

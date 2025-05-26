// Speech Manager - Handles voice recognition and text-to-speech
class SpeechManager {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.bestVoice = null;
        
        this.initializeElements();
        this.initializeSpeech();
        this.bindEvents();
    }

    initializeElements() {
        this.voiceButton = document.getElementById('voice-button');
        this.statusText = document.getElementById('status-text');
        this.statusIndicator = document.getElementById('status-indicator');
        this.messageInput = document.getElementById('message-input');
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
            this.recognition.lang = TalbotConfig.SETTINGS.SPEECH_LANG;
            
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
        console.log(`Loaded ${voices.length} voices`);
        this.bestVoice = this.selectBestVoice(voices);
        if (this.bestVoice) {
            console.log(`Selected voice: ${this.bestVoice.name} (${this.bestVoice.lang})`);
        }
    }

    selectBestVoice(voices) {
        if (!voices || voices.length === 0) return null;
        
        let bestVoice = null;
        let highestScore = 0;
        
        voices.forEach(voice => {
            // Only consider English voices
            if (!voice.lang.startsWith('en')) return;
            
            let score = 0;
            
            // Check against preferences
            TalbotConfig.SETTINGS.VOICE_PREFERENCES.forEach(pref => {
                if (pref.pattern.test(voice.name)) {
                    score = Math.max(score, pref.score);
                }
            });
            
            // Boost score for local voices (better quality)
            if (voice.localService) score += 10;
            
            // Slight preference for default voices
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

    // Text-to-Speech Methods
    speakMessage(text) {
        if (!this.synthesis) return;
        
        // Stop any current speech
        this.stopSpeaking();
        
        // Pre-process text for more natural speech
        const naturalText = this.makeTextMoreNatural(text);
        
        this.currentUtterance = new SpeechSynthesisUtterance(naturalText);
        
        // Enhanced voice settings for warmth and humanity
        this.currentUtterance.rate = TalbotConfig.SETTINGS.SPEECH_RATE;
        this.currentUtterance.pitch = TalbotConfig.SETTINGS.SPEECH_PITCH;
        this.currentUtterance.volume = TalbotConfig.SETTINGS.SPEECH_VOLUME;
        
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
        naturalText = naturalText.replace(/\. (I understand|I hear|That sounds|It sounds like)/g, '. ... $1');
        naturalText = naturalText.replace(/\. (How are|What|When|Where|Why)/g, '. ... $1');
        
        // Add gentle emphasis to empathetic words
        naturalText = naturalText.replace(/\b(understand|hear you|valid|important|strength|brave|proud)\b/g, '$1');
        
        // Add natural breathing pauses
        naturalText = naturalText.replace(/([.!?])\s+([A-Z])/g, '$1 ... $2');
        
        // Soften clinical language
        naturalText = naturalText.replace(/\btechniques\b/g, 'ways that might help');
        naturalText = naturalText.replace(/\bstrategies\b/g, 'things you can try');
        naturalText = naturalText.replace(/\bimplement\b/g, 'try');
        
        // Add conversational connectors
        naturalText = naturalText.replace(/^(Here are|These are)/g, 'Some things that might help are');
        naturalText = naturalText.replace(/\bAdditionally\b/g, 'Also');
        naturalText = naturalText.replace(/\bFurthermore\b/g, 'And');
        
        return naturalText;
    }

    stopSpeaking() {
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            this.updateVoiceButton();
            this.updateStatus('Ready to listen', '💙');
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

    // Event callback setters (for integration with other modules)
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
}

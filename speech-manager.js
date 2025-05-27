// Enhanced Speech Manager with Voice Recognition Toggle
class SpeechManager {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.bestVoice = null;
        this.currentAudio = null;
        
        // Voice settings
        this.premiumVoiceEnabled = false;
        this.speechRecognitionEnabled = true; // Default: enabled
        this.elevenLabsAvailable = false;
        this.elevenLabsApiKey = null;
        this.selectedVoiceId = 'pNInz6obpgDQGcFmaJgB';
        
        this.initializeElements();
        this.initializeSpeech();
        this.bindEvents();
        this.checkElevenLabsAPI();
        this.loadPreferences();
    }

    initializeElements() {
        this.voiceButton = document.getElementById('voice-button');
        this.statusText = document.getElementById('status-text');
        this.statusIndicator = document.getElementById('status-indicator');
        this.messageInput = document.getElementById('message-input');
        
        // Voice toggles
        this.voiceToggle = document.getElementById('voice-toggle');
        this.toggleIcon = document.getElementById('toggle-icon');
        this.toggleText = document.getElementById('toggle-text');
        
        // Speech recognition toggle
        this.speechToggle = document.getElementById('speech-toggle');
        this.speechToggleIcon = document.getElementById('speech-toggle-icon');
        this.speechToggleText = document.getElementById('speech-toggle-text');
    }

    async checkElevenLabsAPI() {
        try {
            const response = await fetch('/.netlify/functions/get-elevenlabs-key');
            if (response.ok) {
                const data = await response.json();
                this.elevenLabsAvailable = data.available;
                this.elevenLabsApiKey = data.apiKey;
                console.log('ElevenLabs API check:', this.elevenLabsAvailable ? 'Available' : 'Not available');
                this.updateVoiceToggleVisibility();
            } else {
                this.elevenLabsAvailable = false;
                this.updateVoiceToggleVisibility();
            }
        } catch (error) {
            console.log('ElevenLabs API check failed');
            this.elevenLabsAvailable = false;
            this.updateVoiceToggleVisibility();
        }
    }

    loadPreferences() {
        try {
            // Load premium voice preference
            const savedVoice = localStorage.getItem('talbot-premium-voice');
            if (savedVoice !== null) {
                this.premiumVoiceEnabled = JSON.parse(savedVoice);
            }
            
            // Load speech recognition preference
            const savedSpeech = localStorage.getItem('talbot-speech-recognition');
            if (savedSpeech !== null) {
                this.speechRecognitionEnabled = JSON.parse(savedSpeech);
            }
            
            this.updateToggleStates();
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }

    savePreferences() {
        try {
            localStorage.setItem('talbot-premium-voice', JSON.stringify(this.premiumVoiceEnabled));
            localStorage.setItem('talbot-speech-recognition', JSON.stringify(this.speechRecognitionEnabled));
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    }

    updateVoiceToggleVisibility() {
        if (!this.voiceToggle) return;
        
        if (this.elevenLabsAvailable) {
            this.voiceToggle.style.display = 'flex';
        } else {
            this.voiceToggle.style.display = 'none';
            this.premiumVoiceEnabled = false;
        }
        this.updateToggleStates();
    }

    updateToggleStates() {
        // Update voice toggle
        if (this.voiceToggle) {
            if (this.premiumVoiceEnabled) {
                this.voiceToggle.classList.add('premium');
                this.toggleIcon.textContent = '✨';
                this.toggleText.textContent = 'Premium Voice';
            } else {
                this.voiceToggle.classList.remove('premium');
                this.toggleIcon.textContent = '🔊';
                this.toggleText.textContent = 'Basic Voice';
            }
        }
        
        // Update speech recognition toggle
        if (this.speechToggle) {
            if (this.speechRecognitionEnabled) {
                this.speechToggle.classList.remove('disabled');
                this.speechToggleIcon.textContent = '🎤';
                this.speechToggleText.textContent = 'Voice Input';
            } else {
                this.speechToggle.classList.add('disabled');
                this.speechToggleIcon.textContent = '🚫';
                this.speechToggleText.textContent = 'Voice Disabled';
            }
            
            // Update voice button visibility
            if (this.voiceButton) {
                this.voiceButton.style.display = this.speechRecognitionEnabled ? 'flex' : 'none';
            }
        }
    }

    togglePremiumVoice() {
        if (!this.elevenLabsAvailable) {
            this.showVoiceStatus('Premium voice not available', false);
            return;
        }

        this.premiumVoiceEnabled = !this.premiumVoiceEnabled;
        this.savePreferences();
        this.updateToggleStates();
        
        const message = this.premiumVoiceEnabled ? 
            'Premium voice enabled - Natural AI speech' : 
            'Premium voice disabled - Using browser speech';
        this.showVoiceStatus(message, this.premiumVoiceEnabled);
        
        console.log('Premium voice:', this.premiumVoiceEnabled ? 'Enabled' : 'Disabled');
    }

    toggleSpeechRecognition() {
        this.speechRecognitionEnabled = !this.speechRecognitionEnabled;
        this.savePreferences();
        this.updateToggleStates();
        
        const message = this.speechRecognitionEnabled ? 
            'Voice input enabled - Hold mic to speak' : 
            'Voice input disabled - Type only mode';
        this.showVoiceStatus(message, this.speechRecognitionEnabled);
        
        // Stop any current listening
        if (!this.speechRecognitionEnabled && this.isListening) {
            this.stopListening();
        }
        
        console.log('Speech recognition:', this.speechRecognitionEnabled ? 'Enabled' : 'Disabled');
    }

    showVoiceStatus(message, isPositive) {
        const existingStatus = document.querySelector('.voice-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        const statusDiv = document.createElement('div');
        statusDiv.className = `voice-status ${isPositive ? 'premium' : ''}`;
        statusDiv.textContent = message;
        
        document.body.appendChild(statusDiv);
        setTimeout(() => statusDiv.classList.add('show'), 100);
        setTimeout(() => {
            statusDiv.classList.remove('show');
            setTimeout(() => statusDiv.remove(), 300);
        }, 2500);
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
            this.recognition.lang = 'en-AU';
            
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
            console.warn('Speech recognition not supported');
            this.speechRecognitionEnabled = false;
            this.updateToggleStates();
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
            if (voice.lang.includes('AU')) score += 20;
            if (voice.lang.includes('GB')) score += 15;
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
        // Voice toggle
        if (this.voiceToggle) {
            this.voiceToggle.addEventListener('click', () => this.togglePremiumVoice());
        }

        // Speech recognition toggle
        if (this.speechToggle) {
            this.speechToggle.addEventListener('click', () => this.toggleSpeechRecognition());
        }

        // Voice button events (only work if speech recognition is enabled)
        this.voiceButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.speechRecognitionEnabled) this.startListening();
        });
        
        this.voiceButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.speechRecognitionEnabled) this.stopListening();
        });
        
        this.voiceButton.addEventListener('mousedown', () => {
            if (this.speechRecognitionEnabled) this.startListening();
        });
        
        this.voiceButton.addEventListener('mouseup', () => {
            if (this.speechRecognitionEnabled) this.stopListening();
        });
        
        this.voiceButton.addEventListener('mouseleave', () => {
            if (this.speechRecognitionEnabled) this.stopListening();
        });
        
        // Stop speech when typing
        this.messageInput.addEventListener('input', () => {
            if (this.isSpeaking) {
                this.stopSpeaking();
            }
        });
    }

    startListening() {
        if (!this.speechRecognitionEnabled) {
            this.showVoiceStatus('Voice input is disabled', false);
            return;
        }
        
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateVoiceButton();
            this.updateStatus('Talk to me, I\'m here', '🖤');
        }
    }

    // Text-to-Speech methods
    async speakMessage(text) {
        if (!text) return;
        
        this.stopSpeaking();
        const naturalText = this.makeTextMoreNatural(text);
        
        if (this.premiumVoiceEnabled && this.elevenLabsAvailable) {
            await this.speakWithElevenLabs(naturalText);
        } else {
            this.speakWithBrowser(naturalText);
        }
    }

    async speakWithElevenLabs(text) {
        try {
            this.isSpeaking = true;
            this.updateVoiceButton();
            this.updateStatus('Talbot is speaking... ✨', '🗣️');

            const response = await fetch('/.netlify/functions/elevenlabs-tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    voice_id: this.selectedVoiceId,
                    voice_settings: {
                        stability: 0.75,
                        similarity_boost: 0.85,
                        style: 0.6,
                        use_speaker_boost: true
                    }
                })
            });

            if (!response.ok) throw new Error(`ElevenLabs API error: ${response.status}`);

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            this.currentAudio = new Audio(audioUrl);
            
            this.currentAudio.onended = () => {
                this.isSpeaking = false;
                this.updateVoiceButton();
                this.updateStatus('Talk to me, I\'m here', '🖤');
                URL.revokeObjectURL(audioUrl);
            };
            
            this.currentAudio.onerror = () => {
                this.isSpeaking = false;
                this.updateVoiceButton();
                this.updateStatus('Talk to me, I\'m here', '🖤');
                URL.revokeObjectURL(audioUrl);
            };
            
            await this.currentAudio.play();
            
        } catch (error) {
            console.error('ElevenLabs TTS error:', error);
            this.showVoiceStatus('Premium voice failed, using backup', false);
            this.speakWithBrowser(text);
        }
    }

    speakWithBrowser(text) {
        if (!this.synthesis) return;
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = 0.85;
        this.currentUtterance.pitch = 1.1;
        this.currentUtterance.volume = 0.9;
        
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
            this.updateStatus('Talk to me, I\'m here', '🖤');
        };
        
        this.currentUtterance.onerror = () => {
            this.isSpeaking = false;
            this.updateVoiceButton();
            this.updateStatus('Talk to me, I\'m here', '🖤');
        };
        
        setTimeout(() => this.synthesis.speak(this.currentUtterance), 100);
    }

    makeTextMoreNatural(text) {
        let naturalText = text;
        naturalText = naturalText.replace(/\. (I understand|I hear|That sounds)/g, '. $1');
        naturalText = naturalText.replace(/\.{2,}/g, '.');
        naturalText = naturalText.replace(/\btechniques\b/g, 'ways that might help');
        naturalText = naturalText.replace(/\bstrategies\b/g, 'things you can try');
        naturalText = naturalText.replace(/^(Here are|These are)/g, 'Some things that might help are');
        naturalText = naturalText.replace(/\bAdditionally\b/g, 'Also');
        naturalText = naturalText.replace(/\bFurthermore\b/g, 'And');
        naturalText = naturalText.replace(/\bHowever\b/g, 'But');
        return naturalText;
    }

    stopSpeaking() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.cancel();
        }
        
        this.isSpeaking = false;
        this.updateVoiceButton();
        this.updateStatus('Talk to me, I\'m here', '🖤');
    }

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
        setTimeout(() => errorDiv.remove(), 5000);
    }

    // Event callback setters
    setOnListeningStart(callback) { 
        this.onListeningStart = callback; 
    }
    
    setOnSpeechResult(callback) { 
        this.onSpeechResult = callback; 
    }

    // Getters
    getIsListening() { 
        return this.isListening; 
    }
    
    getIsSpeaking() { 
        return this.isSpeaking; 
    }
    
    getIsPremiumVoiceEnabled() { 
        return this.premiumVoiceEnabled; 
    }
    
    getIsSpeechRecognitionEnabled() { 
        return this.speechRecognitionEnabled; 
    }
    
    getElevenLabsAvailable() { 
        return this.elevenLabsAvailable; 
    }
}

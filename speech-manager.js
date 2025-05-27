// Updated SpeechManager with Input Voice Toggle
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
        this.premiumVoiceEnabled = false; // TTS Premium/Basic toggle (top left)
        this.speechRecognitionEnabled = true; // Voice input toggle (bottom left of input)
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
        
        // TTS Voice toggle (top left - premium/basic)
        this.voiceToggle = document.getElementById('voice-toggle');
        this.toggleIcon = document.getElementById('toggle-icon');
        this.toggleText = document.getElementById('toggle-text');
        
        // Speech recognition toggle (bottom left of input)
        this.inputVoiceToggle = document.getElementById('input-voice-toggle');
        this.inputVoiceToggleIcon = document.getElementById('input-voice-toggle-icon');
        this.inputVoiceToggleText = document.getElementById('input-voice-toggle-text');
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
            // Load TTS premium voice preference
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
        // Update TTS voice toggle (top left)
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
        
        // Update speech recognition toggle (bottom left of input)
        if (this.inputVoiceToggle) {
            this.inputVoiceToggle.classList.remove('enabled', 'disabled', 'premium');
            
            if (this.speechRecognitionEnabled) {
                this.inputVoiceToggle.classList.add('enabled');
                this.inputVoiceToggleIcon.textContent = '🎤';
                this.inputVoiceToggleText.textContent = 'Voice Input';
                
                // Show premium indicator if using ElevenLabs for TTS
                if (this.premiumVoiceEnabled && this.elevenLabsAvailable) {
                    this.inputVoiceToggle.classList.add('premium');
                }
            } else {
                this.inputVoiceToggle.classList.add('disabled');
                this.inputVoiceToggleIcon.textContent = '🚫';
                this.inputVoiceToggleText.textContent = 'Voice Off';
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
            'Premium AI voice enabled ✨' : 
            'Basic browser voice enabled';
        this.showVoiceStatus(message, this.premiumVoiceEnabled);
        
        console.log('Premium voice:', this.premiumVoiceEnabled ? 'Enabled' : 'Disabled');
    }

    toggleSpeechRecognition() {
        this.speechRecognitionEnabled = !this.speechRecognitionEnabled;
        this.savePreferences();
        this.updateToggleStates();
        
        const message = this.speechRecognitionEnabled ? 
            'Voice input enabled - Hold mic to speak 🎤' : 
            'Voice input disabled - Text only mode 🚫';
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
        }, 3000);
    }

    bindEvents() {
        // TTS Voice toggle (top left)
        if (this.voiceToggle) {
            this.voiceToggle.addEventListener('click', () => this.togglePremiumVoice());
        }

        // Speech recognition toggle (bottom left of input)
        if (this.inputVoiceToggle) {
            this.inputVoiceToggle.addEventListener('click', () => this.toggleSpeechRecognition());
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

    // Rest of the methods remain the same...
    // (initializeSpeech, startListening, stopListening, speakMessage, etc.)
    
    startListening() {
        if (!this.speechRecognitionEnabled) {
            this.showVoiceStatus('Voice input is disabled - Click toggle to enable', false);
            return;
        }
        
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    // ... (rest of existing methods remain unchanged)
}

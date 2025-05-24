<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Talbot - Your Mental Health Companion</title>
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#4A90E2">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Talbot">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="data:application/json;base64,ewogICJuYW1lIjogIlRhbGJvdCAtIE1lbnRhbCBIZWFsdGggQ29tcGFuaW9uIiwKICAic2hvcnRfbmFtZSI6ICJUYWxib3QiLAogICJkZXNjcmlwdGlvbiI6ICJZb3VyIHBlcnNvbmFsIG1lbnRhbCBoZWFsdGggYXNzaXN0YW50IGZvciBzdXBwb3J0IGJldHdlZW4gdGhlcmFweSBzZXNzaW9ucyIsCiAgInN0YXJ0X3VybCI6ICIvIiwKICAiZGlzcGxheSI6ICJzdGFuZGFsb25lIiwKICAiYmFja2dyb3VuZF9jb2xvciI6ICIjZjVmN2ZhIiwKICAidGhlbWVfY29sb3IiOiAiIzRBOTBFMiIsCiAgImljb25zIjogWwogICAgewogICAgICAic3JjIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwaU5USTBJaUJvWldsbmFIUTlJalV5TkNJZ2RtbGxkMEp2ZUQwaU1DQXdJRFV5TkNBMU1qUWlJR1pwYkd3OUlpTTBRVGt3UlRJaVBnbzhZMmx5WTJ4bElHTjRQU0l5TmpJaUlHTjVQU0l5TmpJaUlISTlJamMySWlCbWFXeHNQU0lqWmptbWFTSXZQZ2s4WTJseVkyeGxJR040UFNJeU5qSWlJR041UFNJeU5qSWlJSEk5SWpVMElpQm1hV3hzUFNJalgzWTVjM1Z5Wm1GalpTSXZQZ284TDNOMlp6ND0iLAogICAgICAic2l6ZXMiOiAiNTEyeDUxMiIsCiAgICAgICJ0eXBlIjogImltYWdlL3N2Zyt4bWwiCiAgICB9CiAgXQp9">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            height: 100vh;
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-width: 100%;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            color: white;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 300;
            margin-bottom: 5px;
        }
        
        .status {
            font-size: 12px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .chat-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }
        
        .message {
            margin-bottom: 20px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .message.user {
            flex-direction: row-reverse;
        }
        
        .message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
        }
        
        .user .message-avatar {
            background: #4A90E2;
            color: white;
        }
        
        .assistant .message-avatar {
            background: #e8f4fd;
            color: #4A90E2;
        }
        
        .message-content {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            line-height: 1.4;
            font-size: 16px;
        }
        
        .user .message-content {
            background: #4A90E2;
            color: white;
            border-bottom-right-radius: 6px;
        }
        
        .assistant .message-content {
            background: #f1f3f5;
            color: #333;
            border-bottom-left-radius: 6px;
        }
        
        .input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid #e1e5e9;
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }
        
        .input-group {
            flex: 1;
            position: relative;
        }
        
        .message-input {
            width: 100%;
            min-height: 44px;
            max-height: 100px;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 22px;
            font-size: 16px;
            font-family: inherit;
            resize: none;
            outline: none;
            transition: border-color 0.2s ease;
        }
        
        .message-input:focus {
            border-color: #4A90E2;
        }
        
        .voice-button {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #4A90E2;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }
        
        .voice-button:hover {
            background: #357ABD;
            transform: scale(1.05);
        }
        
        .voice-button.listening {
            background: #e74c3c;
            animation: pulse 1.5s infinite;
        }
        
        .voice-button.speaking {
            background: #27ae60;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .send-button {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #4A90E2;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }
        
        .send-button:hover:not(:disabled) {
            background: #357ABD;
            transform: scale(1.05);
        }
        
        .send-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .typing-indicator {
            display: none;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4A90E2;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        .welcome-message {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }
        
        .welcome-message h2 {
            color: #4A90E2;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .error-message {
            background: #ffe6e6;
            color: #c62828;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 10px 20px;
            text-align: center;
            font-size: 14px;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .container {
                height: 100vh;
                height: 100dvh; /* Dynamic viewport height for mobile */
            }
            
            .header {
                padding: 15px;
            }
            
            .header h1 {
                font-size: 20px;
            }
            
            .messages {
                padding: 15px;
            }
            
            .input-area {
                padding: 15px;
                gap: 10px;
            }
            
            .message-input {
                font-size: 16px; /* Prevents zoom on iOS */
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            }
            
            .container {
                background: #2c3e50;
                color: #ecf0f1;
            }
            
            .assistant .message-content {
                background: #34495e;
                color: #ecf0f1;
            }
            
            .message-input {
                background: #34495e;
                color: #ecf0f1;
                border-color: #4a5568;
            }
            
            .input-area {
                background: #2c3e50;
                border-color: #4a5568;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Talbot</h1>
            <div class="status">
                <span id="status-text">Ready to listen</span>
                <span id="status-indicator">💙</span>
            </div>
        </div>
        
        <div class="chat-container">
            <div class="messages" id="messages">
                <div class="welcome-message">
                    <h2>Hi, I'm Talbot</h2>
                    <p>I'm here to listen and support you between therapy sessions. You can type or speak to me - whatever feels most comfortable.</p>
                </div>
            </div>
            
            <div class="typing-indicator" id="typing-indicator">
                <div class="message-avatar">
                    <span>🤖</span>
                </div>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
        
        <div class="input-area">
            <button class="voice-button" id="voice-button" title="Hold to speak">
                🎤
            </button>
            <div class="input-group">
                <textarea 
                    class="message-input" 
                    id="message-input" 
                    placeholder="Type your message or hold the mic button to speak..."
                    rows="1"
                ></textarea>
            </div>
            <button class="send-button" id="send-button" title="Send message">
                ➤
            </button>
        </div>
    </div>

    <script>
        class TalbotApp {
            constructor() {
                this.messages = [];
                this.isListening = false;
                this.isSpeaking = false;
                this.recognition = null;
                this.synthesis = window.speechSynthesis;
                this.currentUtterance = null;
                
                this.initializeElements();
                this.initializeSpeech();
                this.bindEvents();
                this.registerServiceWorker();
            }
            
            initializeElements() {
                this.messagesContainer = document.getElementById('messages');
                this.messageInput = document.getElementById('message-input');
                this.sendButton = document.getElementById('send-button');
                this.voiceButton = document.getElementById('voice-button');
                this.typingIndicator = document.getElementById('typing-indicator');
                this.statusText = document.getElementById('status-text');
                this.statusIndicator = document.getElementById('status-indicator');
            }
            
            initializeSpeech() {
                // Speech Recognition
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    this.recognition = new SpeechRecognition();
                    this.recognition.continuous = false;
                    this.recognition.interimResults = false;
                    this.recognition.lang = 'en-US';
                    
                    this.recognition.onstart = () => {
                        this.isListening = true;
                        this.updateVoiceButton();
                        this.updateStatus('Listening...', '👂');
                    };
                    
                    this.recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        this.messageInput.value = transcript;
                        this.sendMessage();
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
                    this.voiceButton.style.display = 'none';
                    this.showError('Voice recognition not supported in this browser.');
                }
            }
            
            bindEvents() {
                // Send button
                this.sendButton.addEventListener('click', () => this.sendMessage());
                
                // Enter key to send (but shift+enter for new line)
                this.messageInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });
                
                // Auto-resize textarea
                this.messageInput.addEventListener('input', () => {
                    this.messageInput.style.height = 'auto';
                    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
                });
                
                // Voice button - touch events for mobile
                this.voiceButton.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.startListening();
                });
                
                this.voiceButton.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.stopListening();
                });
                
                // Voice button - mouse events for desktop
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
            
            updateVoiceButton() {
                if (this.isListening) {
                    this.voiceButton.classList.add('listening');
                    this.voiceButton.innerHTML = '⏹️';
                } else if (this.isSpeaking) {
                    this.voiceButton.classList.add('speaking');
                    this.voiceButton.innerHTML = '🔊';
                } else {
                    this.voiceButton.classList.remove('listening', 'speaking');
                    this.voiceButton.innerHTML = '🎤';
                }
            }
            
            updateStatus(text, indicator) {
                this.statusText.textContent = text;
                this.statusIndicator.textContent = indicator;
            }
            
            async sendMessage() {
                const message = this.messageInput.value.trim();
                if (!message) return;
                
                // Add user message
                this.addMessage('user', message);
                this.messageInput.value = '';
                this.messageInput.style.height = 'auto';
                
                // Show typing indicator
                this.showTyping();
                this.updateStatus('Talbot is thinking...', '🤔');
                
                try {
                    // This is where you'd integrate with Claude's API
                    // For now, using a mock response
                    const response = await this.getAIResponse(message);
                    
                    this.hideTyping();
                    this.addMessage('assistant', response);
                    this.speakMessage(response);
                    this.updateStatus('Ready to listen', '💙');
                } catch (error) {
                    this.hideTyping();
                    this.showError('Sorry, I had trouble processing that. Please try again.');
                    this.updateStatus('Ready to listen', '💙');
                }
            }
            
            async getAIResponse(message) {
                try {
                    // Call our Netlify function instead of Claude API directly
                    const response = await fetch('/.netlify/functions/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Function request failed: ${response.status}`);
                    }

                    const data = await response.json();
                    return data.response;
                    
                } catch (error) {
                    console.error('Error calling chat function:', error);
                    
                    // Fallback responses if function fails
                    const fallbackResponses = [
                        "I'm having trouble connecting right now, but I'm still here to listen. Can you tell me more about what's on your mind?",
                        "I'm experiencing some technical difficulties, but your feelings are important. What would help you feel supported right now?",
                        "I'm here for you, even though I'm having connection issues. How are you feeling in this moment?"
                    ];
                    
                    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
                }
            }
            
            addMessage(sender, content) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${sender}`;
                
                const avatar = document.createElement('div');
                avatar.className = 'message-avatar';
                avatar.innerHTML = sender === 'user' ? '👤' : '🤖';
                
                const messageContent = document.createElement('div');
                messageContent.className = 'message-content';
                messageContent.textContent = content;
                
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(messageContent);
                
                // Remove welcome message if it exists
                const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
                if (welcomeMessage) {
                    welcomeMessage.remove();
                }
                
                this.messagesContainer.appendChild(messageDiv);
                this.scrollToBottom();
                
                this.messages.push({ sender, content, timestamp: new Date() });
            }
            
            speakMessage(text) {
                if (!this.synthesis) return;
                
                // Stop any current speech
                this.stopSpeaking();
                
                this.currentUtterance = new SpeechSynthesisUtterance(text);
                this.currentUtterance.rate = 0.9;
                this.currentUtterance.pitch = 1.0;
                this.currentUtterance.volume = 0.8;
                
                // Try to use a pleasant, calm voice
                const voices = this.synthesis.getVoices();
                const preferredVoice = voices.find(voice => 
                    voice.name.includes('Samantha') || 
                    voice.name.includes('Karen') || 
                    voice.name.includes('Tessa') ||
                    (voice.lang.startsWith('en') && voice.name.includes('Female'))
                );
                
                if (preferredVoice) {
                    this.currentUtterance.voice = preferredVoice;
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
                
                this.synthesis.speak(this.currentUtterance);
            }
            
            stopSpeaking() {
                if (this.synthesis && this.isSpeaking) {
                    this.synthesis.cancel();
                    this.isSpeaking = false;
                    this.updateVoiceButton();
                    this.updateStatus('Ready to listen', '💙');
                }
            }
            
            showTyping() {
                this.typingIndicator.style.display = 'flex';
                this.scrollToBottom();
            }
            
            hideTyping() {
                this.typingIndicator.style.display = 'none';
            }
            
            scrollToBottom() {
                setTimeout(() => {
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                }, 100);
            }
            
            showError(message) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                
                document.querySelector('.chat-container').insertBefore(errorDiv, this.messagesContainer);
                
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            }
            
            async registerServiceWorker() {
                if ('serviceWorker' in navigator) {
                    try {
                        // Create a simple service worker inline for caching
                        const swCode = `
                            const CACHE_NAME = 'talbot-v1';
                            const urlsToCache = [
                                '/',
                                '/index.html'
                            ];
                            
                            self.addEventListener('install', (event) => {
                                event.waitUntil(
                                    caches.open(CACHE_NAME)
                                        .then((cache) => cache.addAll(urlsToCache))
                                );
                            });
                            
                            self.addEventListener('fetch', (event) => {
                                event.respondWith(
                                    caches.match(event.request)
                                        .then((response) => {
                                            return response || fetch(event.request);
                                        })
                                );
                            });
                        `;
                        
                        const blob = new Blob([swCode], { type: 'application/javascript' });
                        const swUrl = URL.createObjectURL(blob);
                        
                        await navigator.serviceWorker.register(swUrl);
                        console.log('Service Worker registered successfully');
                    } catch (error) {
                        console.log('Service Worker registration failed:', error);
                    }
                }
            }
        }
        
        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new TalbotApp();
        });
        
        // Handle iOS viewport height issues
        function setViewportHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 100);
        });
    </script>
</body>
</html>

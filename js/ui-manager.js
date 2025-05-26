// UI Manager - Handles all UI interactions and message display
class UIManager {
    constructor() {
        this.messages = [];
        this.initializeElements();
        this.bindEvents();
        this.setupViewportHeight();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.typingIndicator = document.getElementById('typing-indicator');
    }

    bindEvents() {
        // Send button
        this.sendButton.addEventListener('click', () => this.onSendMessage?.());
        
        // Enter key to send (shift+enter for new line)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.onSendMessage?.();
            }
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, TalbotConfig.SETTINGS.MAX_MESSAGE_HEIGHT) + 'px';
        });
    }

    setupViewportHeight() {
        // Handle iOS viewport height issues
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 100);
        });
    }

    // Message Management
    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        // Add timestamp
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messageContent.appendChild(messageTime);
        
        // Remove welcome message if it exists
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Store message
        this.messages.push({ 
            sender, 
            content, 
            timestamp: new Date() 
        });
        
        // Save to localStorage
        this.saveChatHistory();
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-AU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    clearMessageInput() {
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
    }

    getMessageInput() {
        return this.messageInput.value.trim();
    }

    // Typing Indicator
    showTyping() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }

    // Scrolling
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    // Status Messages
    showError(message) {
        this.showStatusMessage(message, 'error');
    }

    showSuccess(message) {
        this.showStatusMessage(message, 'success');
    }

    showStatusMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = text;
        
        // Insert into chat container
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.insertBefore(messageDiv, this.messagesContainer);
        
        // Auto-remove after delay
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Chat History Management
    saveChatHistory() {
        try {
            const historyToSave = this.messages.slice(-50); // Keep last 50 messages
            localStorage.setItem(TalbotConfig.SETTINGS.STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(historyToSave));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const savedHistory = localStorage.getItem(TalbotConfig.SETTINGS.STORAGE_KEYS.CHAT_HISTORY);
            if (savedHistory) {
                this.messages = JSON.parse(savedHistory);
                this.displayChatHistory();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    displayChatHistory() {
        // Remove welcome message
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage && this.messages.length > 0) {
            welcomeMessage.remove();
        }

        // Display messages
        this.messages.forEach(message => {
            this.displayHistoryMessage(message);
        });

        this.scrollToBottom();
    }

    displayHistoryMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = message.sender === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message.content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date(message.timestamp));
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messageContent.appendChild(messageTime);
        
        this.messagesContainer.appendChild(messageDiv);
    }

    clearChatHistory() {
        if (confirm('Are you sure you want to clear your chat history? This cannot be undone.')) {
            this.messages = [];
            localStorage.removeItem(TalbotConfig.SETTINGS.STORAGE_KEYS.CHAT_HISTORY);
            
            // Clear displayed messages
            this.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h2>Hi, I'm Talbot</h2>
                    <p>I'm here to provide a safe space to talk through things between your therapy sessions. I find it helpful to ask questions to get to the root of why you might be feeling a certain way - just like your therapist does.</p>
                </div>
            `;
            
            this.showSuccess('Chat history cleared successfully.');
        }
    }

    // Animation helpers
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${TalbotConfig.SETTINGS.MESSAGE_FADE_DURATION}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    slideIn(element) {
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
        element.style.transition = `all ${TalbotConfig.SETTINGS.MESSAGE_FADE_DURATION}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        });
    }

    // Focus management
    focusMessageInput() {
        this.messageInput.focus();
    }

    blurMessageInput() {
        this.messageInput.blur();
    }

    // Button state management
    disableSendButton() {
        this.sendButton.disabled = true;
    }

    enableSendButton() {
        this.sendButton.disabled = false;
    }

    // Export chat functionality
    exportChat() {
        const chatData = {
            exportDate: new Date().toISOString(),
            messages: this.messages,
            messageCount: this.messages.length
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `talbot-chat-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('Chat history exported successfully!');
    }

    // Event callback setters
    setOnSendMessage(callback) {
        this.onSendMessage = callback;
    }

    // Getters
    getMessages() {
        return this.messages;
    }

    getMessageCount() {
        return this.messages.length;
    }

    hasMessages() {
        return this.messages.length > 0;
    }

    // Responsive design helpers
    isMobile() {
        return window.innerWidth <= 768;
    }

    adjustForMobile() {
        if (this.isMobile()) {
            // Mobile-specific adjustments
            this.messageInput.style.fontSize = '16px'; // Prevents zoom on iOS
        }
    }

    // Accessibility helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// UI Manager with 𝐭 Avatar and Persistent User Photos
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
        
        // Update typing indicator avatar to use 𝐭
        const typingAvatar = this.typingIndicator.querySelector('.message-avatar span');
        if (typingAvatar) {
            typingAvatar.textContent = '𝐭';
        }
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
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }

    setupViewportHeight() {
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

    // Enhanced addMessage with persistent user photos and 𝐭 avatar
    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'user') {
            // Try to get user's profile photo, fallback to 👤
            const userPhoto = this.getUserProfilePhoto();
            if (userPhoto) {
                const img = document.createElement('img');
                img.src = userPhoto;
                img.alt = 'User avatar';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                avatar.appendChild(img);
            } else {
                avatar.innerHTML = '👤';
            }
        } else {
            // Use 𝐭 for Talbot messages
            avatar.innerHTML = '𝐭';
        }
        
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

    // Get user's profile photo from localStorage
    getUserProfilePhoto() {
        try {
            const savedPhoto = localStorage.getItem('talbot-user-photo');
            return savedPhoto;
        } catch (error) {
            console.error('Error loading user photo:', error);
            return null;
        }
    }

    // Save user's profile photo to localStorage
    saveUserProfilePhoto(photoDataUrl) {
        try {
            localStorage.setItem('talbot-user-photo', photoDataUrl);
            console.log('User photo saved successfully');
        } catch (error) {
            console.error('Error saving user photo:', error);
        }
    }

    // Clear user's profile photo
    clearUserProfilePhoto() {
        try {
            localStorage.removeItem('talbot-user-photo');
            console.log('User photo cleared');
        } catch (error) {
            console.error('Error clearing user photo:', error);
        }
    }

    // Update existing message avatars when profile photo changes
    updateUserAvatars() {
        const userMessages = this.messagesContainer.querySelectorAll('.message.user .message-avatar');
        const userPhoto = this.getUserProfilePhoto();
        
        userMessages.forEach(avatar => {
            if (userPhoto) {
                const existingImg = avatar.querySelector('img');
                if (existingImg) {
                    existingImg.src = userPhoto;
                } else {
                    avatar.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = userPhoto;
                    img.alt = 'User avatar';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '50%';
                    avatar.appendChild(img);
                }
            } else {
                avatar.innerHTML = '👤';
            }
        });
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
        
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.insertBefore(messageDiv, this.messagesContainer);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Chat History Management
    saveChatHistory() {
        try {
            const historyToSave = this.messages.slice(-50);
            localStorage.setItem('talbot-chat-history', JSON.stringify(historyToSave));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const savedHistory = localStorage.getItem('talbot-chat-history');
            if (savedHistory) {
                this.messages = JSON.parse(savedHistory);
                this.displayChatHistory();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    displayChatHistory() {
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage && this.messages.length > 0) {
            welcomeMessage.remove();
        }

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
        
        if (message.sender === 'user') {
            // Use persistent user photo for historical messages
            const userPhoto = this.getUserProfilePhoto();
            if (userPhoto) {
                const img = document.createElement('img');
                img.src = userPhoto;
                img.alt = 'User avatar';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                avatar.appendChild(img);
            } else {
                avatar.innerHTML = '👤';
            }
        } else {
            // Use 𝐭 for Talbot historical messages
            avatar.innerHTML = '𝐭';
        }
        
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
            localStorage.removeItem('talbot-chat-history');
            
            this.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h2>Hi, I'm Talbot</h2>
                    <p>I'm here to provide a safe space to talk through things between your therapy sessions. I find it helpful to ask questions to get to the root of why you might be feeling a certain way - just like your therapist does.</p>
                </div>
            `;
            
            this.showSuccess('Chat history cleared successfully.');
        }
    }

    // Update welcome message with user's name if available
    updateWelcomeMessage() {
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message h2');
        if (welcomeMessage) {
            try {
                const profile = localStorage.getItem('talbot-profile');
                if (profile) {
                    const profileData = JSON.parse(profile);
                    if (profileData.preferredName) {
                        welcomeMessage.textContent = `Hi, ${profileData.preferredName}`;
                        return;
                    }
                }
            } catch (error) {
                console.error('Error updating welcome message:', error);
            }
            welcomeMessage.textContent = "Hi, I'm Talbot";
        }
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

    // Photo management helpers
    hasUserPhoto() {
        return !!this.getUserProfilePhoto();
    }

    // Responsive design helpers
    isMobile() {
        return window.innerWidth <= 768;
    }

    adjustForMobile() {
        if (this.isMobile()) {
            this.messageInput.style.fontSize = '16px';
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

// Profile Manager - Handles user profile and document management
class ProfileManager {
    constructor() {
        this.profile = null;
        this.documentContents = [];
        this.initializeElements();
        this.bindEvents();
        this.loadProfile();
    }

    initializeElements() {
        this.profileButton = document.getElementById('profile-button');
        this.profileModal = document.getElementById('profile-modal');
        this.profileForm = document.getElementById('profile-form');
        this.closeProfile = document.getElementById('close-profile');
        this.cancelProfile = document.getElementById('cancel-profile');
        this.clearProfile = document.getElementById('clear-profile');
        this.clinicalDocuments = document.getElementById('clinical-documents');
        this.uploadedFiles = document.getElementById('uploaded-files');
    }

    bindEvents() {
        // Profile modal events
        this.profileButton.addEventListener('click', () => this.openProfile());
        this.closeProfile.addEventListener('click', () => this.closeProfileModal());
        this.cancelProfile.addEventListener('click', () => this.closeProfileModal());
        this.clearProfile.addEventListener('click', () => this.clearProfileData());
        this.profileForm.addEventListener('submit', (e) => this.saveProfile(e));
        
        // Close modal on outside click
        this.profileModal.addEventListener('click', (e) => {
            if (e.target === this.profileModal) {
                this.closeProfileModal();
            }
        });
        
        // Checkbox styling
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.name === 'communicationStyle') {
                const item = e.target.closest('.checkbox-item');
                if (e.target.checked) {
                    item.classList.add('checked');
                } else {
                    item.classList.remove('checked');
                }
            }
        });
        
        // File upload
        this.clinicalDocuments.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    // Profile Management Methods
    loadProfile() {
        try {
            const savedProfile = localStorage.getItem(TalbotConfig.SETTINGS.STORAGE_KEYS.PROFILE);
            const savedDocuments = localStorage.getItem(TalbotConfig.SETTINGS.STORAGE_KEYS.DOCUMENTS);
            
            if (savedProfile) {
                this.profile = JSON.parse(savedProfile);
                this.populateProfileForm();
                this.updateWelcomeMessage();
            }
            
            if (savedDocuments) {
                this.documentContents = JSON.parse(savedDocuments);
                this.displaySavedDocuments();
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    saveProfile(e) {
        e.preventDefault();
        
        const formData = new FormData(this.profileForm);
        const profile = {};
        
        // Get text inputs
        for (let [key, value] of formData.entries()) {
            if (key !== 'communicationStyle') {
                profile[key] = value.trim();
            }
        }
        
        // Get communication style checkboxes
        const communicationStyles = [];
        document.querySelectorAll('input[name="communicationStyle"]:checked').forEach(checkbox => {
            communicationStyles.push(checkbox.value);
        });
        profile.communicationStyle = communicationStyles;
        
        // Save to localStorage
        try {
            localStorage.setItem(TalbotConfig.SETTINGS.STORAGE_KEYS.PROFILE, JSON.stringify(profile));
            localStorage.setItem(TalbotConfig.SETTINGS.STORAGE_KEYS.DOCUMENTS, JSON.stringify(this.documentContents));
            this.profile = profile;
            
            this.updateWelcomeMessage();
            this.closeProfileModal();
            this.showMessage('Profile and documents saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showMessage('Error saving profile. Please try again.', 'error');
        }
    }

    populateProfileForm() {
        if (!this.profile) return;
        
        // Populate text inputs
        Object.keys(this.profile).forEach(key => {
            if (key !== 'communicationStyle') {
                const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
                if (element) {
                    element.value = this.profile[key];
                }
            }
        });
        
        // Populate communication style checkboxes
        if (this.profile.communicationStyle) {
            this.profile.communicationStyle.forEach(style => {
                const checkbox = document.getElementById(style);
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.closest('.checkbox-item').classList.add('checked');
                }
            });
        }
    }

    updateWelcomeMessage() {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage && this.profile && this.profile.preferredName) {
            welcomeMessage.querySelector('h2').textContent = `Hi, ${this.profile.preferredName}`;
        }
    }

    openProfile() {
        this.profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeProfileModal() {
        this.profileModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    clearProfileData() {
        if (confirm('Are you sure you want to clear your profile and all uploaded documents? This cannot be undone.')) {
            localStorage.removeItem(TalbotConfig.SETTINGS.STORAGE_KEYS.PROFILE);
            localStorage.removeItem(TalbotConfig.SETTINGS.STORAGE_KEYS.DOCUMENTS);
            this.profile = null;
            this.documentContents = [];
            this.profileForm.reset();
            this.uploadedFiles.innerHTML = '';
            
            // Clear checkbox styling
            document.querySelectorAll('.checkbox-item.checked').forEach(item => {
                item.classList.remove('checked');
            });
            
            // Reset welcome message
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.querySelector('h2').textContent = 'Hi, I\'m Talbot';
            }
            
            this.closeProfileModal();
            this.showMessage('Profile and documents cleared successfully.', 'success');
        }
    }

    // File Management Methods
    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        for (const file of files) {
            if (file.size > TalbotConfig.SETTINGS.MAX_FILE_SIZE) {
                this.showMessage(`File "${file.name}" is too large. Maximum size is 5MB.`, 'error');
                continue;
            }
            
            try {
                const content = await this.readFileContent(file);
                const fileData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: content,
                    id: Date.now() + Math.random()
                };
                
                this.documentContents.push(fileData);
                this.displayUploadedFile(fileData);
                
            } catch (error) {
                console.error('Error reading file:', error);
                this.showMessage(`Error reading file "${file.name}". Please try again.`, 'error');
            }
        }
        
        event.target.value = '';
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
                    resolve(e.target.result);
                } else {
                    resolve(`Document: ${file.name} (${this.formatFileSize(file.size)})\nType: ${file.type}\n\n[Document content would be extracted here in a full implementation]`);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            
            if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
                reader.readAsText(file);
            } else {
                resolve(`Document: ${file.name} (${this.formatFileSize(file.size)})\nType: ${file.type}\n\n[Document uploaded - content parsing would be implemented here]`);
            }
        });
    }

    displayUploadedFile(fileData) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div>
                <div class="file-name">${fileData.name}</div>
                <div class="file-size">${this.formatFileSize(fileData.size)}</div>
            </div>
            <button type="button" class="remove-file" data-file-id="${fileData.id}" title="Remove file">×</button>
        `;
        
        fileItem.querySelector('.remove-file').addEventListener('click', () => {
            this.removeUploadedFile(fileData.id);
            fileItem.remove();
        });
        
        this.uploadedFiles.appendChild(fileItem);
    }

    displaySavedDocuments() {
        this.uploadedFiles.innerHTML = '';
        this.documentContents.forEach(fileData => {
            this.displayUploadedFile(fileData);
        });
    }

    removeUploadedFile(fileId) {
        this.documentContents = this.documentContents.filter(doc => doc.id !== fileId);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Context Building for AI
    buildContextualMessage(message) {
        if (!this.profile) return message;
        
        let context = "User Profile Context:\n";
        
        if (this.profile.preferredName) {
            context += `- Call me: ${this.profile.preferredName}\n`;
        }
        
        if (this.profile.pronouns) {
            context += `- Pronouns: ${this.profile.pronouns}\n`;
        }
        
        if (this.profile.diagnoses) {
            context += `- Mental health conditions: ${this.profile.diagnoses}\n`;
        }
        
        if (this.documentContents && this.documentContents.length > 0) {
            context += `- Clinical Documentation:\n`;
            this.documentContents.forEach(doc => {
                context += `  * ${doc.name}:\n${doc.content}\n\n`;
            });
        }
        
        if (this.profile.medications) {
            context += `- Current medications: ${this.profile.medications}\n`;
        }
        
        if (this.profile.treatmentHistory) {
            context += `- Treatment background: ${this.profile.treatmentHistory}\n`;
        }
        
        if (this.profile.communicationStyle && this.profile.communicationStyle.length > 0) {
            context += `- Communication preferences: ${this.profile.communicationStyle.join(', ')}\n`;
        }
        
        if (this.profile.customCommunication) {
            context += `- Custom communication instructions: ${this.profile.customCommunication}\n`;
        }
        
        if (this.profile.triggers) {
            context += `- Sensitive topics: ${this.profile.triggers}\n`;
        }
        
        if (this.profile.therapyGoals) {
            context += `- Current therapy goals: ${this.profile.therapyGoals}\n`;
        }
        
        if (this.profile.copingStrategies) {
            context += `- Effective coping strategies: ${this.profile.copingStrategies}\n`;
        }
        
        if (this.profile.currentStressors) {
            context += `- Current stressors: ${this.profile.currentStressors}\n`;
        }
        
        if (this.profile.therapistInfo) {
            context += `- Therapist information: ${this.profile.therapistInfo}\n`;
        }
        
        return context + "\nUser message: " + message;
    }

    // Utility method for showing messages
    showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `status-message status-${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#4A90E2'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Getters for other modules
    getProfile() {
        return this.profile;
    }

    getDocuments() {
        return this.documentContents;
    }
}

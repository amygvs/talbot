// Profile Manager - Fixed version that handles null/undefined values
class ProfileManager {
    constructor() {
        this.profile = null;
        this.documentContents = [];
        this.initializeElements();
        this.bindEvents();
        this.loadProfile();
        
        console.log('ProfileManager initialized');
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

    // Fixed saveProfile method that handles null/undefined values safely
    saveProfile(e) {
        e.preventDefault();
        console.log('ProfileManager: Starting profile save...');
        
        const profile = {};
        
        // Helper function to safely get and trim values
        const safeGetValue = (fieldId) => {
            const element = document.getElementById(fieldId);
            if (element && element.value) {
                return typeof element.value === 'string' ? element.value.trim() : String(element.value).trim();
            }
            return '';
        };
        
        // Manual field mapping with safe value extraction
        const fieldMappings = {
            'preferred-name': 'preferredName',
            'age-range': 'ageRange', 
            'pronouns': 'pronouns',
            'diagnoses': 'diagnoses',
            'medications': 'medications',
            'treatment-history': 'treatmentHistory',
            'custom-communication': 'customCommunication',
            'triggers': 'triggers',
            'therapy-goals': 'therapyGoals',
            'coping-strategies': 'copingStrategies',
            'current-stressors': 'currentStressors',
            'therapist-info': 'therapistInfo'
        };
        
        // Get values from form fields safely
        for (const [fieldId, propertyName] of Object.entries(fieldMappings)) {
            const value = safeGetValue(fieldId);
            if (value) {
                profile[propertyName] = value;
                console.log(`ProfileManager: Mapped ${fieldId} -> ${propertyName}:`, value);
            }
        }
        
        // Get communication style checkboxes
        const communicationStyles = [];
        const checkboxes = document.querySelectorAll('input[name="communicationStyle"]:checked');
        checkboxes.forEach(checkbox => {
            if (checkbox.value) {
                communicationStyles.push(checkbox.value);
            }
        });
        
        if (communicationStyles.length > 0) {
            profile.communicationStyle = communicationStyles;
            console.log('ProfileManager: Communication styles:', communicationStyles);
        }
        
        console.log('ProfileManager: Complete profile object:', profile);
        
        // Save to localStorage
        try {
            const profileJson = JSON.stringify(profile);
            localStorage.setItem('talbot-profile', profileJson);
            localStorage.setItem('talbot-documents', JSON.stringify(this.documentContents));
            this.profile = profile;
            
            console.log('ProfileManager: Profile saved to localStorage successfully');
            
            // Verify it was saved
            const saved = localStorage.getItem('talbot-profile');
            console.log('ProfileManager: Verification - retrieved from localStorage:', saved);
            
            this.updateWelcomeMessage();
            this.closeProfileModal();
            this.showMessage('Profile saved successfully!', 'success');
        } catch (error) {
            console.error('ProfileManager: Error saving profile:', error);
            this.showMessage('Error saving profile. Please try again.', 'error');
        }
    }

    // Profile Management Methods
    loadProfile() {
        console.log('ProfileManager: Loading profile...');
        try {
            const savedProfile = localStorage.getItem('talbot-profile');
            const savedDocuments = localStorage.getItem('talbot-documents');
            
            console.log('ProfileManager: Raw saved profile data:', savedProfile);
            
            if (savedProfile) {
                this.profile = JSON.parse(savedProfile);
                console.log('ProfileManager: Parsed profile:', this.profile);
                this.populateProfileForm();
                this.updateWelcomeMessage();
            } else {
                console.log('ProfileManager: No saved profile found');
            }
            
            if (savedDocuments) {
                this.documentContents = JSON.parse(savedDocuments);
                console.log('ProfileManager: Loaded documents:', this.documentContents.length);
                this.displaySavedDocuments();
            }
        } catch (error) {
            console.error('ProfileManager: Error loading profile:', error);
        }
    }

    populateProfileForm() {
        if (!this.profile) return;
        
        console.log('ProfileManager: Populating form with profile:', this.profile);
        
        // Field mappings for form population
        const fieldMappings = {
            'preferredName': 'preferred-name',
            'ageRange': 'age-range',
            'pronouns': 'pronouns',
            'diagnoses': 'diagnoses',
            'medications': 'medications',
            'treatmentHistory': 'treatment-history',
            'customCommunication': 'custom-communication',
            'triggers': 'triggers',
            'therapyGoals': 'therapy-goals',
            'copingStrategies': 'coping-strategies',
            'currentStressors': 'current-stressors',
            'therapistInfo': 'therapist-info'
        };
        
        // Populate text inputs
        for (const [profileKey, fieldId] of Object.entries(fieldMappings)) {
            if (this.profile[profileKey]) {
                const element = document.getElementById(fieldId);
                if (element) {
                    element.value = this.profile[profileKey];
                    console.log(`ProfileManager: Populated ${fieldId} with:`, this.profile[profileKey]);
                }
            }
        }
        
        // Populate communication style checkboxes
        if (this.profile.communicationStyle && Array.isArray(this.profile.communicationStyle)) {
            this.profile.communicationStyle.forEach(style => {
                const checkbox = document.getElementById(style);
                if (checkbox) {
                    checkbox.checked = true;
                    const item = checkbox.closest('.checkbox-item');
                    if (item) {
                        item.classList.add('checked');
                    }
                    console.log(`ProfileManager: Checked communication style:`, style);
                }
            });
        }
    }

    updateWelcomeMessage() {
        const welcomeMessage = document.querySelector('.welcome-message h2');
        if (welcomeMessage && this.profile && this.profile.preferredName) {
            welcomeMessage.textContent = `Hi, ${this.profile.preferredName}`;
            console.log('ProfileManager: Updated welcome message with name:', this.profile.preferredName);
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
            localStorage.removeItem('talbot-profile');
            localStorage.removeItem('talbot-documents');
            this.profile = null;
            this.documentContents = [];
            this.profileForm.reset();
            this.uploadedFiles.innerHTML = '';
            
            // Clear checkbox styling
            document.querySelectorAll('.checkbox-item.checked').forEach(item => {
                item.classList.remove('checked');
            });
            
            // Reset welcome message
            const welcomeMessage = document.querySelector('.welcome-message h2');
            if (welcomeMessage) {
                welcomeMessage.textContent = 'Hi, I\'m Talbot';
            }
            
            this.closeProfileModal();
            this.showMessage('Profile and documents cleared successfully.', 'success');
        }
    }

    // Context Building for AI
    buildContextualMessage(message) {
        console.log('ProfileManager: Building contextual message...');
        console.log('ProfileManager: Current profile:', this.profile);
        
        if (!this.profile) {
            console.log('ProfileManager: No profile available, returning original message');
            return message;
        }
        
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
        
        const finalMessage = context + "\nUser message: " + message;
        console.log('ProfileManager: Built context with profile data, final length:', finalMessage.length);
        
        return finalMessage;
    }

    // File Management Methods (simplified for now)
    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        console.log('ProfileManager: Handling file upload:', files.length, 'files');
        
        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
                console.error('ProfileManager: Error reading file:', error);
                this.showMessage(`Error reading file "${file.name}". Please try again.`, 'error');
            }
        }
        
        event.target.value = '';
    }

    async readFileContent(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
                    resolve(e.target.result);
                } else {
                    resolve(`Document: ${file.name} (${this.formatFileSize(file.size)})\nType: ${file.type}\n\n[Document content would be extracted here in a full implementation]`);
                }
            };
            reader.onerror = () => resolve(`Error reading file: ${file.name}`);
            
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
        console.log('ProfileManager: getProfile() called, returning:', this.profile);
        return this.profile;
    }

    getDocuments() {
        return this.documentContents;
    }
}

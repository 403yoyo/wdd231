// About page specific functionality

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeContactForm();
    }

    setupEventListeners() {
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // Mission stats animation
        this.animateMissionStats();
    }

    animateMissionStats() {
        const stats = document.querySelectorAll('.mission-stat .stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 16);
    }

    initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'text':
                if (!value) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
                break;
                
            case 'textarea':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#dc2626';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#dc2626';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async handleContactForm(form) {
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        let allValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showFormMessage('Please fix the errors above.', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            subject: document.getElementById('contactSubject').value.trim(),
            message: document.getElementById('contactMessage').value.trim(),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<div class="loading-spinner"></div> Sending...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            await this.sendContactMessage(formData);
            
            this.showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            console.error('Contact form error:', error);
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async sendContactMessage(formData) {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Store in localStorage (in real app, this would be a server API call)
                const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                messages.push(formData);
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                
                // Simulate random success/failure for demo
                Math.random() > 0.1 ? resolve() : reject(new Error('Network error'));
            }, 1500);
        });
    }

    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type === 'success' ? 'success-message' : 'error-message'}`;
        messageElement.textContent = message;

        // Insert after the form
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageElement, form.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Initialize the about page
const aboutPage = new AboutPage();
window.aboutPage = aboutPage;
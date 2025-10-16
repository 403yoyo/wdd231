// Main application entry point
import { initializeWeather } from './modules/weather.js';
import { initializeTutorials } from './modules/tutorials.js';
import { initializeModals } from './modules/modal.js';
import { initializeStorage } from './modules/storage.js';
import { debounce } from './utils.js';

class LearningHubApp {
    constructor() {
        this.currentTutorials = [];
        this.displayedTutorials = 6;
        this.filters = {
            category: 'all',
            difficulty: 'all',
            search: ''
        };
        
        this.init();
    }

    async init() {
        // Initialize all modules
        initializeStorage();
        initializeModals();
        await initializeWeather();
        await initializeTutorials();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load user preferences
        this.loadUserPreferences();
        
        console.log('Learning Hub App initialized successfully');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.filterTutorials();
            }, 300));
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filters.search = searchInput.value.toLowerCase();
                this.filterTutorials();
            });
        }

        // Load more functionality
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.displayedTutorials += 6;
                this.filterTutorials();
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(newsletterForm);
            });
        }

        // Mobile navigation
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Video link
        const videoLink = document.getElementById('videoLink');
        if (videoLink) {
            videoLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Project video demonstration will be linked here. This would typically open a modal with the embedded video.');
            });
        }
    }

    async filterTutorials() {
        try {
            const response = await fetch('./data/tutorials.json');
            const tutorials = await response.json();
            
            let filtered = tutorials.filter(tutorial => {
                const matchesSearch = !this.filters.search || 
                    tutorial.title.toLowerCase().includes(this.filters.search) ||
                    tutorial.description.toLowerCase().includes(this.filters.search) ||
                    tutorial.category.toLowerCase().includes(this.filters.search);
                
                const matchesCategory = this.filters.category === 'all' || 
                    tutorial.category === this.filters.category;
                
                const matchesDifficulty = this.filters.difficulty === 'all' || 
                    tutorial.difficulty === this.filters.difficulty;
                
                return matchesSearch && matchesCategory && matchesDifficulty;
            });

            this.currentTutorials = filtered;
            this.displayTutorials(filtered.slice(0, this.displayedTutorials));
            
            // Show/hide load more button
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = filtered.length > this.displayedTutorials ? 'block' : 'none';
            }
        } catch (error) {
            console.error('Error filtering tutorials:', error);
        }
    }

    displayTutorials(tutorials) {
        const container = document.getElementById('featuredTutorials');
        if (!container) return;

        if (tutorials.length === 0) {
            container.innerHTML = '<div class="text-center"><p>No tutorials found matching your criteria.</p></div>';
            return;
        }

        container.innerHTML = tutorials.map(tutorial => `
            <div class="tutorial-card" data-id="${tutorial.id}">
                <div class="tutorial-image">
                    <i class="${tutorial.icon}"></i>
                </div>
                <div class="tutorial-content">
                    <span class="tutorial-category">${tutorial.category}</span>
                    <h3>${tutorial.title}</h3>
                    <p class="tutorial-description">${tutorial.description}</p>
                    <div class="tutorial-meta">
                        <span class="tutorial-duration">
                            <i class="fas fa-clock"></i> ${tutorial.duration}
                        </span>
                        <span class="tutorial-difficulty difficulty-${tutorial.difficulty}">
                            ${tutorial.difficulty}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click event to tutorial cards
        container.querySelectorAll('.tutorial-card').forEach(card => {
            card.addEventListener('click', () => {
                const tutorialId = card.getAttribute('data-id');
                this.showTutorialDetails(tutorialId);
            });
        });
    }

    async showTutorialDetails(tutorialId) {
        try {
            const response = await fetch('./data/tutorials.json');
            const tutorials = await response.json();
            const tutorial = tutorials.find(t => t.id == tutorialId);
            
            if (tutorial) {
                // This would typically open a modal with detailed tutorial information
                const modal = document.getElementById('tutorialModal');
                const modalContent = document.getElementById('tutorialModalContent');
                
                modalContent.innerHTML = `
                    <h2>${tutorial.title}</h2>
                    <div class="tutorial-meta-large">
                        <span class="tutorial-category">${tutorial.category}</span>
                        <span class="tutorial-difficulty difficulty-${tutorial.difficulty}">${tutorial.difficulty}</span>
                        <span class="tutorial-duration"><i class="fas fa-clock"></i> ${tutorial.duration}</span>
                    </div>
                    <div class="tutorial-description-full">
                        <p>${tutorial.fullDescription || tutorial.description}</p>
                    </div>
                    <div class="tutorial-content-preview">
                        <h3>What You'll Learn</h3>
                        <ul>
                            ${tutorial.learningObjectives ? tutorial.learningObjectives.map(obj => `<li>${obj}</li>`).join('') : '<li>Detailed learning objectives</li>'}
                        </ul>
                    </div>
                    <div class="tutorial-actions">
                        <button class="btn btn-primary">Start Learning</button>
                        <button class="btn btn-outline">Save for Later</button>
                    </div>
                `;
                
                modal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading tutorial details:', error);
        }
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Store in localStorage
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({
            email,
            date: new Date().toISOString()
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
        // Show success message
        alert('Thank you for subscribing to our newsletter!');
        form.reset();
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        
        // Apply theme if set
        if (preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Apply other preferences...
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LearningHubApp();
});

// Export for testing
export default LearningHubApp;
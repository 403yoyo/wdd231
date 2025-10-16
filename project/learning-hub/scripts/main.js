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
        initializeStorage();
        initializeModals();
        await initializeWeather();
        await initializeTutorials();
        
        this.setupEventListeners();
        
        this.loadUserPreferences();
        
        // console.log('Learning Hub App initialized successfully');
    }

    setupEventListeners() {
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

        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.displayedTutorials += 6;
                this.filterTutorials();
            });
        }

        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(newsletterForm);
            });
        }

        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

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
            
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = filtered.length > this.displayedTutorials ? 'block' : 'none';
            }
        } catch (error) {
            // console.error('Error filtering tutorials:', error);
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
            // console.error('Error loading tutorial details:', error);
        }
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({
            email,
            date: new Date().toISOString()
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
        alert('Thank you for subscribing to our newsletter!');
        form.reset();
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        

        if (preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LearningHubApp();
});

export default LearningHubApp;
console.log('TUTORIALS PAGE JS: Script loaded');

class TutorialsPage {
    constructor() {
        console.log('TUTORIALS PAGE JS: Constructor called');
        this.currentTutorials = [];
        this.displayedCount = 12;
        this.filters = {
            search: '',
            category: 'all',
            difficulty: 'all',
            sort: 'newest'
        };
    }

    async init() {
        console.log('TUTORIALS PAGE JS: init() started');
        await this.loadTutorials();
        this.setupEventListeners();
        this.applyFilters();
        console.log('TUTORIALS PAGE JS: init() completed');
    }

    async loadTutorials() {
        try {
            console.log('TUTORIALS PAGE JS: Loading tutorials from JSON...');
            
            // Load directly from JSON file
            const response = await fetch('./data/tutorials.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.currentTutorials = await response.json();
            
            console.log('TUTORIALS PAGE JS: Tutorials loaded:', this.currentTutorials.length);
            this.updateTutorialsCount();
            
        } catch (error) {
            console.error('Error loading tutorials:', error);
            
            const cached = localStorage.getItem('tutorialsData');
            if (cached) {
                this.currentTutorials = JSON.parse(cached);
                console.log('TUTORIALS PAGE JS: Using cached tutorials:', this.currentTutorials.length);
                this.updateTutorialsCount();
            } else {
                this.showError('Failed to load tutorials. Please try again later.');
            }
        }
    }

    setupEventListeners() {
        console.log('TUTORIALS PAGE JS: Setting up event listeners');
        
        const searchInput = document.getElementById('tutorialSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        const difficultyFilter = document.getElementById('difficultyFilter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.filters.difficulty = e.target.value;
                this.applyFilters();
            });
        }

        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                this.switchView(view);
                
                viewButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        const loadMoreBtn = document.getElementById('loadMoreTutorials');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreTutorials();
            });
        }

        const newsletterForm = document.getElementById('tutorialsNewsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(newsletterForm);
            });
        }

        this.handleUrlParams();
    }

    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            this.filters.category = category;
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = category;
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    applyFilters() {
        console.log('TUTORIALS PAGE JS: Applying filters to', this.currentTutorials.length, 'tutorials');
        let filtered = [...this.currentTutorials];

        if (this.filters.search) {
            filtered = filtered.filter(tutorial => 
                tutorial.title.toLowerCase().includes(this.filters.search) ||
                tutorial.description.toLowerCase().includes(this.filters.search) ||
                tutorial.category.toLowerCase().includes(this.filters.search)
            );
        }

        if (this.filters.category !== 'all') {
            filtered = filtered.filter(tutorial => 
                tutorial.category === this.filters.category
            );
        }

        if (this.filters.difficulty !== 'all') {
            filtered = filtered.filter(tutorial => 
                tutorial.difficulty === this.filters.difficulty
            );
        }

        filtered = this.sortTutorials(filtered, this.filters.sort);

        console.log('TUTORIALS PAGE JS: Filtered to', filtered.length, 'tutorials');
        this.displayTutorials(filtered.slice(0, this.displayedCount));
        this.updateActiveFilters();
        this.updateTutorialsCount(filtered.length);
    }

    sortTutorials(tutorials, sortBy) {
        const sorted = [...tutorials];
        switch (sortBy) {
            case 'popular':
                return sorted.sort((a, b) => (b.students || 0) - (a.students || 0));
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'duration':
                return sorted.sort((a, b) => {
                    const aTime = this.parseDuration(a.duration);
                    const bTime = this.parseDuration(b.duration);
                    return aTime - bTime;
                });
            case 'newest':
            default:
                return sorted.sort((a, b) => b.id - a.id);
        }
    }

    parseDuration(duration) {
        const hoursMatch = duration.match(/(\d+)h/);
        const minutesMatch = duration.match(/(\d+)m/);
        
        let totalMinutes = 0;
        if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
        if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
        
        return totalMinutes;
    }

    displayTutorials(tutorials) {
        console.log('TUTORIALS PAGE JS: Displaying', tutorials.length, 'tutorials');
        this.displayGridView(tutorials);
        this.displayListView(tutorials);
        
        const loadMoreBtn = document.getElementById('loadMoreTutorials');
        const allFiltered = this.getFilteredTutorials();
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = allFiltered.length > this.displayedCount ? 'block' : 'none';
        }
    }

    displayGridView(tutorials) {
        const gridContainer = document.getElementById('tutorialsGrid');
        if (!gridContainer) {
            console.log('TUTORIALS PAGE JS: Grid container NOT found');
            return;
        }

        if (tutorials.length === 0) {
            gridContainer.innerHTML = this.getNoResultsHTML();
            return;
        }

        gridContainer.innerHTML = tutorials.map(tutorial => `
            <div class="tutorial-card" data-id="${tutorial.id}">
                <div class="tutorial-image" style="background: linear-gradient(135deg, ${this.getCategoryColor(tutorial.category)})">
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

        gridContainer.querySelectorAll('.tutorial-card').forEach(card => {
            card.addEventListener('click', () => {
                const tutorialId = card.getAttribute('data-id');
                this.showTutorialModal(tutorialId);
            });
        });
    }

    displayListView(tutorials) {
        const listContainer = document.getElementById('tutorialsList');
        if (!listContainer) return;

        if (tutorials.length === 0) {
            listContainer.innerHTML = this.getNoResultsHTML();
            return;
        }

        listContainer.innerHTML = tutorials.map(tutorial => `
            <div class="tutorial-list-item" data-id="${tutorial.id}">
                <div class="tutorial-list-icon" style="background: linear-gradient(135deg, ${this.getCategoryColor(tutorial.category)})">
                    <i class="${tutorial.icon}"></i>
                </div>
                <div class="tutorial-list-content">
                    <h3>${tutorial.title}</h3>
                    <p>${tutorial.description}</p>
                    <div class="tutorial-list-meta">
                        <span class="tutorial-category">${tutorial.category}</span>
                        <span class="tutorial-duration">
                            <i class="fas fa-clock"></i> ${tutorial.duration}
                        </span>
                        <span class="tutorial-rating">
                            <i class="fas fa-star"></i> ${tutorial.rating || '4.5'}
                        </span>
                        <span class="tutorial-students">
                            <i class="fas fa-users"></i> ${tutorial.students || '0'}
                        </span>
                    </div>
                </div>
                <div class="tutorial-list-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); window.startTutorial(${tutorial.id})">
                        Start
                    </button>
                    <button class="btn btn-outline" onclick="event.stopPropagation(); window.saveTutorial(${tutorial.id})">
                        Save
                    </button>
                </div>
            </div>
        `).join('');

        listContainer.querySelectorAll('.tutorial-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const tutorialId = item.getAttribute('data-id');
                this.showTutorialModal(tutorialId);
            });
        });
    }

    switchView(view) {
        const gridView = document.getElementById('tutorialsGrid');
        const listView = document.getElementById('tutorialsList');
        
        if (view === 'grid') {
            gridView.classList.remove('hidden');
            listView.classList.add('hidden');
        } else {
            gridView.classList.add('hidden');
            listView.classList.remove('hidden');
        }
    }

    loadMoreTutorials() {
        this.displayedCount += 12;
        this.applyFilters();
    }

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (!activeFiltersContainer) return;

        const activeFilters = [];
        
        if (this.filters.search) {
            activeFilters.push({
                type: 'search',
                label: `Search: "${this.filters.search}"`,
                value: this.filters.search
            });
        }
        
        if (this.filters.category !== 'all') {
            activeFilters.push({
                type: 'category',
                label: `Category: ${this.filters.category}`,
                value: this.filters.category
            });
        }
        
        if (this.filters.difficulty !== 'all') {
            activeFilters.push({
                type: 'difficulty',
                label: `Level: ${this.filters.difficulty}`,
                value: this.filters.difficulty
            });
        }

        if (activeFilters.length === 0) {
            activeFiltersContainer.innerHTML = '';
            return;
        }

        activeFiltersContainer.innerHTML = activeFilters.map(filter => `
            <div class="filter-tag">
                ${filter.label}
                <button onclick="window.tutorialsPage.removeFilter('${filter.type}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeFilter(filterType) {
        switch (filterType) {
            case 'search':
                this.filters.search = '';
                document.getElementById('tutorialSearch').value = '';
                break;
            case 'category':
                this.filters.category = 'all';
                document.getElementById('categoryFilter').value = 'all';
                break;
            case 'difficulty':
                this.filters.difficulty = 'all';
                document.getElementById('difficultyFilter').value = 'all';
                break;
        }
        this.applyFilters();
    }

    updateTutorialsCount(total = null) {
        const countElement = document.getElementById('tutorialsCount');
        if (!countElement) return;

        const filteredCount = total !== null ? total : this.getFilteredTutorials().length;
        const totalCount = this.currentTutorials.length;
        
        if (filteredCount === totalCount) {
            countElement.textContent = `${totalCount} Tutorials Available`;
        } else {
            countElement.textContent = `${filteredCount} of ${totalCount} Tutorials`;
        }
    }

    getFilteredTutorials() {
        let filtered = [...this.currentTutorials];

        if (this.filters.search) {
            filtered = filtered.filter(tutorial => 
                tutorial.title.toLowerCase().includes(this.filters.search) ||
                tutorial.description.toLowerCase().includes(this.filters.search) ||
                tutorial.category.toLowerCase().includes(this.filters.search)
            );
        }

        if (this.filters.category !== 'all') {
            filtered = filtered.filter(tutorial => 
                tutorial.category === this.filters.category
            );
        }

        if (this.filters.difficulty !== 'all') {
            filtered = filtered.filter(tutorial => 
                tutorial.difficulty === this.filters.difficulty
            );
        }

        return this.sortTutorials(filtered, this.filters.sort);
    }

    getCategoryColor(category) {
        const colorMap = {
            'technology': '#1e88e5, #1565c0',
            'cooking': '#fbc02d, #f9a825',
            'farming': '#43a047, #388e3c',
            'cosmetics': '#e91e63, #c2185b',
            'design': '#9c27b0, #7b1fa2',
            'business': '#ff9800, #f57c00'
        };
        return colorMap[category] || '#1e88e5, #1565c0';
    }

    getNoResultsHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-search fa-3x"></i>
                <h3>No tutorials found</h3>
                <p>Try adjusting your search criteria or browse all categories</p>
                <button class="btn btn-primary" onclick="window.tutorialsPage.clearFilters()">
                    Clear All Filters
                </button>
            </div>
        `;
    }

    clearFilters() {
        this.filters = {
            search: '',
            category: 'all',
            difficulty: 'all',
            sort: 'newest'
        };
        
        document.getElementById('tutorialSearch').value = '';
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('difficultyFilter').value = 'all';
        document.getElementById('sortFilter').value = 'newest';
        
        this.applyFilters();
    }

    showTutorialModal(tutorialId) {
        const tutorial = this.currentTutorials.find(t => t.id == tutorialId);
        if (!tutorial) return;

        const modal = document.getElementById('tutorialModal');
        const modalContent = document.getElementById('tutorialModalContent');
        
        modalContent.innerHTML = `
            <h2>${tutorial.title}</h2>
            <div class="tutorial-meta-large">
                <span class="tutorial-category">${tutorial.category}</span>
                <span class="tutorial-difficulty difficulty-${tutorial.difficulty}">${tutorial.difficulty}</span>
                <span class="tutorial-duration"><i class="fas fa-clock"></i> ${tutorial.duration}</span>
                <span class="tutorial-rating"><i class="fas fa-star"></i> ${tutorial.rating || '4.5'}/5</span>
            </div>
            <div class="tutorial-description-full">
                <p>${tutorial.fullDescription || tutorial.description}</p>
            </div>
            <div class="tutorial-content-preview">
                <h3>What You'll Learn</h3>
                <ul>
                    ${tutorial.learningObjectives ? tutorial.learningObjectives.map(obj => `<li>${obj}</li>`).join('') : 
                    `<li>Master the fundamentals of ${tutorial.category}</li>
                     <li>Build practical projects and applications</li>
                     <li>Develop professional-level skills</li>
                     <li>Join a community of learners</li>`}
                </ul>
            </div>
            <div class="tutorial-prerequisites">
                <h4>Prerequisites</h4>
                <p>${tutorial.prerequisites || 'No prior experience required. Perfect for beginners!'}</p>
            </div>
            <div class="tutorial-actions">
                <button class="btn btn-primary" onclick="window.startTutorial(${tutorial.id})">
                    <i class="fas fa-play"></i> Start Learning
                </button>
                <button class="btn btn-outline" onclick="window.saveTutorial(${tutorial.id})">
                    <i class="fas fa-bookmark"></i> Save for Later
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({
            email,
            date: new Date().toISOString(),
            source: 'tutorials-page'
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
        alert('Thank you for subscribing to our newsletter! You\'ll be notified about new tutorials.');
        form.reset();
    }

    showError(message) {
        console.error(message);
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('TUTORIALS PAGE JS: DOM loaded - initializing tutorials page');
    const tutorialsPage = new TutorialsPage();
    window.tutorialsPage = tutorialsPage;
    
    tutorialsPage.init();
});

window.startTutorial = function(tutorialId) {
    alert(`Starting tutorial: ${tutorialId}`);
};

window.saveTutorial = function(tutorialId) {
    const saved = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
    if (!saved.includes(tutorialId)) {
        saved.push(tutorialId);
        localStorage.setItem('savedTutorials', JSON.stringify(saved));
        alert('Tutorial saved to your learning list!');
    } else {
        alert('Tutorial already saved!');
    }
};
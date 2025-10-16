import { debounce, formatDuration } from '../utils.js';

let allTutorials = [];
let categories = [];

export async function initializeTutorials() {
    try {
        await loadTutorialsData();
        await loadCategories();
        displayCategories();
        displayFeaturedTutorials();
        setupFilters();
        // console.log('Tutorials module initialized');
    } catch (error) {
        // console.error('Error initializing tutorials module:', error);
    }
}

async function loadTutorialsData() {
    try {
        const response = await fetch('./data/tutorials.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allTutorials = await response.json();
        
        localStorage.setItem('tutorialsData', JSON.stringify(allTutorials));
        
    } catch (error) {
        // console.error('Error fetching tutorials:', error);
        const cached = localStorage.getItem('tutorialsData');
        if (cached) {
            allTutorials = JSON.parse(cached);
        } else {
            throw error;
        }
    }
}

async function loadCategories() {
    categories = [
        {
            id: 'technology',
            name: 'Technology',
            icon: 'fas fa-laptop-code',
            description: 'Web development, programming, and IT skills',
            count: allTutorials.filter(t => t.category === 'technology').length
        },
        {
            id: 'cooking',
            name: 'Cooking',
            icon: 'fas fa-utensils',
            description: 'Recipes and culinary techniques',
            count: allTutorials.filter(t => t.category === 'cooking').length
        },
        {
            id: 'farming',
            name: 'Farming',
            icon: 'fas fa-tractor',
            description: 'Agriculture and sustainable farming',
            count: allTutorials.filter(t => t.category === 'farming').length
        },
        {
            id: 'cosmetics',
            name: 'Cosmetics',
            icon: 'fas fa-spa',
            description: 'Beauty and skincare tutorials',
            count: allTutorials.filter(t => t.category === 'cosmetics').length
        },
        {
            id: 'design',
            name: 'Design',
            icon: 'fas fa-palette',
            description: 'Graphic design and creative skills',
            count: allTutorials.filter(t => t.category === 'design').length
        },
        {
            id: 'business',
            name: 'Business',
            icon: 'fas fa-chart-line',
            description: 'Entrepreneurship and business skills',
            count: allTutorials.filter(t => t.category === 'business').length
        }
    ];
}

function displayCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = categories.map(category => `
        <a href="categories.html?category=${category.id}" class="category-card">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <span class="category-count">${category.count} tutorials</span>
        </a>
    `).join('');
}

function displayFeaturedTutorials() {
    const featuredContainer = document.getElementById('featuredTutorials');
    if (!featuredContainer) return;

    const featuredTutorials = allTutorials.slice(0, 6);
    
    featuredContainer.innerHTML = featuredTutorials.map(tutorial => `
        <div class="tutorial-card" data-id="${tutorial.id}" data-category="${tutorial.category}">
            <div class="tutorial-image" style="background: linear-gradient(135deg, ${getCategoryColor(tutorial.category)})">
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

    featuredContainer.querySelectorAll('.tutorial-card').forEach(card => {
        card.addEventListener('click', () => {
            const tutorialId = card.getAttribute('data-id');
            showTutorialModal(tutorialId);
        });
    });
}

function getCategoryColor(category) {
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

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            filterTutorials({ search: e.target.value });
        }, 300));
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterTutorials({ category: e.target.value });
        });
    }

    const difficultyFilter = document.getElementById('difficultyFilter');
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', (e) => {
            filterTutorials({ difficulty: e.target.value });
        });
    }
}

function filterTutorials(filters = {}) {
    const searchTerm = filters.search ? filters.search.toLowerCase() : '';
    const category = filters.category || 'all';
    const difficulty = filters.difficulty || 'all';

    const filtered = allTutorials.filter(tutorial => {
        const matchesSearch = !searchTerm || 
            tutorial.title.toLowerCase().includes(searchTerm) ||
            tutorial.description.toLowerCase().includes(searchTerm) ||
            tutorial.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = category === 'all' || tutorial.category === category;
        const matchesDifficulty = difficulty === 'all' || tutorial.difficulty === difficulty;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    updateTutorialsDisplay(filtered);
}

function updateTutorialsDisplay(tutorials) {
    const container = document.getElementById('featuredTutorials') || document.getElementById('tutorialsGrid');
    if (!container) return;

    if (tutorials.length === 0) {
        container.innerHTML = `
            <div class="no-results text-center">
                <i class="fas fa-search fa-3x mb-2"></i>
                <h3>No tutorials found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tutorials.map(tutorial => `
        <div class="tutorial-card" data-id="${tutorial.id}" data-category="${tutorial.category}">
            <div class="tutorial-image" style="background: linear-gradient(135deg, ${getCategoryColor(tutorial.category)})">
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
            showTutorialModal(tutorialId);
        });
    });
}

function showTutorialModal(tutorialId) {
    const tutorial = allTutorials.find(t => t.id == tutorialId);
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
            <button class="btn btn-primary" onclick="startTutorial(${tutorial.id})">
                <i class="fas fa-play"></i> Start Learning
            </button>
            <button class="btn btn-outline" onclick="saveTutorial(${tutorial.id})">
                <i class="fas fa-bookmark"></i> Save for Later
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

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

export { allTutorials, categories };
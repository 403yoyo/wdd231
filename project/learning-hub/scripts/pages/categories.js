import { allTutorials } from '../modules/tutorials.js';

class CategoriesPage {
    constructor() {
        this.categories = [];
        this.init();
    }

    async init() {
        await this.loadCategoriesData();
        this.displayCategories();
        this.displayFeaturedCategory();
        this.updateStats();
        this.setupEventListeners();
        // console.log('Categories page initialized with', this.categories.length, 'categories');
    }

    async loadCategoriesData() {
        try {
            if (allTutorials.length === 0) {
                const response = await fetch('./data/tutorials.json');
                const tutorials = await response.json();
                this.processCategories(tutorials);
            } else {
                this.processCategories(allTutorials);
            }
        } catch (error) {
            // console.error('Error loading categories data:', error);
            this.createDefaultCategories();
        }
    }

    processCategories(tutorials) {
        const categoryMap = {};
        
        tutorials.forEach(tutorial => {
            if (!categoryMap[tutorial.category]) {
                categoryMap[tutorial.category] = {
                    id: tutorial.category,
                    name: this.formatCategoryName(tutorial.category),
                    count: 0,
                    totalStudents: 0,
                    totalRating: 0,
                    tutorials: []
                };
            }
            
            categoryMap[tutorial.category].count++;
            categoryMap[tutorial.category].totalStudents += tutorial.students || 0;
            categoryMap[tutorial.category].totalRating += tutorial.rating || 4.5;
            categoryMap[tutorial.category].tutorials.push(tutorial);
        });

        this.categories = Object.values(categoryMap).map(cat => ({
            ...cat,
            avgRating: (cat.totalRating / cat.count).toFixed(1),
            description: this.getCategoryDescription(cat.id),
            icon: this.getCategoryIcon(cat.id)
        }));

        // console.log('Processed categories:', this.categories);
    }

    createDefaultCategories() {
        this.categories = [
            {
                id: 'technology',
                name: 'Technology',
                count: 8,
                totalStudents: 45000,
                avgRating: '4.7',
                description: 'Web development, programming, and IT skills',
                icon: 'fas fa-laptop-code'
            },
            {
                id: 'cooking',
                name: 'Cooking',
                count: 2,
                totalStudents: 6900,
                avgRating: '4.8',
                description: 'Recipes and culinary techniques from around the world',
                icon: 'fas fa-utensils'
            },
            {
                id: 'farming',
                name: 'Farming',
                count: 2,
                totalStudents: 3800,
                avgRating: '4.6',
                description: 'Sustainable agriculture and modern farming methods',
                icon: 'fas fa-tractor'
            },
            {
                id: 'cosmetics',
                name: 'Cosmetics',
                count: 2,
                totalStudents: 6700,
                avgRating: '4.7',
                description: 'Beauty, skincare, and professional makeup techniques',
                icon: 'fas fa-spa'
            },
            {
                id: 'design',
                name: 'Design',
                count: 1,
                totalStudents: 5200,
                avgRating: '4.6',
                description: 'Creative design principles and digital art',
                icon: 'fas fa-palette'
            },
            {
                id: 'business',
                name: 'Business',
                count: 1,
                totalStudents: 3400,
                avgRating: '4.5',
                description: 'Entrepreneurship and business management skills',
                icon: 'fas fa-chart-line'
            }
        ];
    }

    formatCategoryName(categoryId) {
        return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    }

    getCategoryDescription(categoryId) {
        const descriptions = {
            'technology': 'Web development, programming, and IT skills for the modern world',
            'cooking': 'Master culinary arts with recipes and techniques from professional chefs',
            'farming': 'Learn sustainable agriculture and modern farming practices',
            'cosmetics': 'Beauty, skincare, and professional makeup artistry techniques',
            'design': 'Creative design principles, UI/UX, and digital art mastery',
            'business': 'Entrepreneurship, marketing, and business management skills'
        };
        return descriptions[categoryId] || 'Explore various learning opportunities';
    }

    getCategoryIcon(categoryId) {
        const iconMap = {
            'technology': 'fas fa-laptop-code',
            'cooking': 'fas fa-utensils',
            'farming': 'fas fa-tractor',
            'cosmetics': 'fas fa-spa',
            'design': 'fas fa-palette',
            'business': 'fas fa-chart-line'
        };
        return iconMap[categoryId] || 'fas fa-book';
    }

    displayCategories() {
        const grid = document.getElementById('categoriesDetailedGrid');
        if (!grid) {
            // console.error('Categories grid element not found');
            return;
        }

        if (this.categories.length === 0) {
            grid.innerHTML = '<div class="no-results"><p>No categories found</p></div>';
            return;
        }

        grid.innerHTML = this.categories.map(category => `
            <div class="category-detailed-card" data-category="${category.id}">
                <div class="category-header">
                    <div class="category-icon-large">
                        <i class="${category.icon}"></i>
                    </div>
                    <div>
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </div>
                
                <div class="category-stats">
                    <div class="category-stat">
                        <span class="category-stat-number">${category.count}</span>
                        <span class="category-stat-label">Tutorials</span>
                    </div>
                    <div class="category-stat">
                        <span class="category-stat-number">${this.formatNumber(category.totalStudents)}</span>
                        <span class="category-stat-label">Students</span>
                    </div>
                    <div class="category-stat">
                        <span class="category-stat-number">${category.avgRating}</span>
                        <span class="category-stat-label">Rating</span>
                    </div>
                </div>

                <div class="category-popular">
                    <h4>Popular in ${category.name}</h4>
                    <p>${this.getPopularTutorialDescription(category.id)}</p>
                </div>

                <div class="category-actions">
                    <button class="btn btn-primary" onclick="categoriesPage.exploreCategory('${category.id}')">
                        Explore ${category.name}
                    </button>
                </div>
            </div>
        `).join('');

        // console.log('Categories displayed successfully');
    }

    displayFeaturedCategory() {
        const featuredContainer = document.getElementById('featuredCategory');
        if (!featuredContainer) {
            // console.error('Featured category element not found');
            return;
        }

        if (this.categories.length === 0) {
            featuredContainer.innerHTML = '<div class="no-results"><p>No featured category available</p></div>';
            return;
        }

        const featured = this.categories.find(cat => cat.id === 'technology') || this.categories[0];
        
        featuredContainer.innerHTML = `
            <div class="spotlight-content">
                <div class="spotlight-icon">
                    <i class="${featured.icon}"></i>
                </div>
                <h2>${featured.name}</h2>
                <p>${featured.description}</p>
                
                <div class="spotlight-stats">
                    <div class="spotlight-stat">
                        <span class="spotlight-stat-number">${featured.count}</span>
                        <span class="spotlight-stat-label">Tutorials</span>
                    </div>
                    <div class="spotlight-stat">
                        <span class="spotlight-stat-number">${this.formatNumber(featured.totalStudents)}+</span>
                        <span class="spotlight-stat-label">Students</span>
                    </div>
                    <div class="spotlight-stat">
                        <span class="spotlight-stat-number">${featured.avgRating}/5</span>
                        <span class="spotlight-stat-label">Rating</span>
                    </div>
                </div>

                <div class="cta-buttons">
                    <a href="tutorials.html?category=${featured.id}" class="btn btn-primary">
                        Explore ${featured.name}
                    </a>
                    <button class="btn btn-outline" onclick="categoriesPage.viewAllCategories()">
                        View All Categories
                    </button>
                </div>
            </div>
        `;

        // console.log('Featured category displayed:', featured.name);
    }

    getPopularTutorialDescription(categoryId) {
        const popularTutorials = {
            'technology': 'Web development, programming, and cutting-edge IT skills',
            'cooking': 'Master recipes and techniques from world-class chefs',
            'farming': 'Sustainable practices and modern agricultural methods',
            'cosmetics': 'Professional beauty and skincare techniques',
            'design': 'Creative design principles and digital artistry',
            'business': 'Entrepreneurship and strategic business management'
        };
        return popularTutorials[categoryId] || 'Various expert-led learning opportunities';
    }

    updateStats() {
        const totalTutorials = document.getElementById('totalTutorials');
        const totalStudents = document.getElementById('totalStudents');
        const completionRate = document.getElementById('completionRate');
        const avgRating = document.getElementById('avgRating');

        if (totalTutorials) {
            const total = this.categories.reduce((sum, cat) => sum + cat.count, 0);
            totalTutorials.textContent = total + '+';
        }

        if (totalStudents) {
            const totalStudentsCount = this.categories.reduce((sum, cat) => sum + cat.totalStudents, 0);
            totalStudents.textContent = this.formatNumber(totalStudentsCount) + '+';
        }

        if (completionRate) {
            completionRate.textContent = '94%';
        }

        if (avgRating) {
            const totalRatings = this.categories.reduce((sum, cat) => sum + parseFloat(cat.avgRating), 0);
            const averageRating = totalRatings / this.categories.length;
            avgRating.textContent = averageRating.toFixed(1);
        }
    }

    setupEventListeners() {
        const signupCta = document.getElementById('signupCta');
        if (signupCta) {
            signupCta.addEventListener('click', (e) => {
                e.preventDefault();
                const signupModal = document.getElementById('signupModal');
                if (signupModal) {
                    signupModal.style.display = 'block';
                }
            });
        }

        this.handleUrlParams();

        setTimeout(() => {
            const categoryCards = document.querySelectorAll('.category-detailed-card');
            categoryCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        const categoryId = card.getAttribute('data-category');
                        this.exploreCategory(categoryId);
                    }
                });
            });
        }, 100);
    }

    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            window.location.href = `tutorials.html?category=${category}`;
        }
    }

    exploreCategory(categoryId) {
        // console.log('Exploring category:', categoryId);
        window.location.href = `tutorials.html?category=${categoryId}`;
    }

    viewAllCategories() {
        const categoriesGrid = document.getElementById('categoriesDetailedGrid');
        if (categoriesGrid) {
            categoriesGrid.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const categoriesPage = new CategoriesPage();
    window.categoriesPage = categoriesPage;
});
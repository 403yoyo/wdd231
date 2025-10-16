// Categories module for managing category data
import { allTutorials } from './tutorials.js';

let categories = [];

export async function initializeCategories() {
    try {
        await loadCategoriesData();
        console.log('Categories module initialized with', categories.length, 'categories');
        return categories;
    } catch (error) {
        console.error('Error initializing categories module:', error);
        return [];
    }
}

export function getCategories() {
    return categories;
}

export function getCategoryById(categoryId) {
    return categories.find(cat => cat.id === categoryId);
}

async function loadCategoriesData() {
    // Ensure tutorials are loaded first
    if (allTutorials.length === 0) {
        console.warn('Tutorials not loaded yet, loading categories data directly');
        await loadCategoriesFromJSON();
    } else {
        processCategoriesFromTutorials();
    }
}

async function loadCategoriesFromJSON() {
    try {
        const response = await fetch('./data/tutorials.json');
        const tutorials = await response.json();
        processCategoriesFromTutorials(tutorials);
    } catch (error) {
        console.error('Error loading categories from JSON:', error);
        createDefaultCategories();
    }
}

function processCategoriesFromTutorials(tutorials = allTutorials) {
    const categoryMap = {};
    
    tutorials.forEach(tutorial => {
        if (!categoryMap[tutorial.category]) {
            categoryMap[tutorial.category] = {
                id: tutorial.category,
                name: formatCategoryName(tutorial.category),
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

    // Calculate averages and add descriptions
    categories = Object.values(categoryMap).map(cat => ({
        ...cat,
        avgRating: (cat.totalRating / cat.count).toFixed(1),
        description: getCategoryDescription(cat.id),
        icon: getCategoryIcon(cat.id)
    }));
}

function createDefaultCategories() {
    categories = [
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

function formatCategoryName(categoryId) {
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
}

function getCategoryDescription(categoryId) {
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

function getCategoryIcon(categoryId) {
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

export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}
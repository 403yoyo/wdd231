// LocalStorage management module
export function initializeStorage() {
    // Initialize default data if not exists
    initializeDefaultData();
    
    // Load user preferences
    loadUserPreferences();
}

function initializeDefaultData() {
    // Initialize users array if not exists
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Initialize user preferences if not exists
    if (!localStorage.getItem('userPreferences')) {
        const defaultPreferences = {
            theme: 'light',
            notifications: true,
            language: 'en',
            itemsPerPage: 12
        };
        localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    }

    // Initialize saved tutorials if not exists
    if (!localStorage.getItem('savedTutorials')) {
        localStorage.setItem('savedTutorials', JSON.stringify([]));
    }

    // Initialize newsletter subscriptions if not exists
    if (!localStorage.getItem('newsletterSubscriptions')) {
        localStorage.setItem('newsletterSubscriptions', JSON.stringify([]));
    }
}

function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Apply theme
    if (preferences.theme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Apply other preferences...
    console.log('User preferences loaded:', preferences);
}

// Utility functions for storage operations
export const storage = {
    // User management
    getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
    setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    
    // Tutorial management
    getSavedTutorials: () => JSON.parse(localStorage.getItem('savedTutorials') || '[]'),
    saveTutorial: (tutorialId) => {
        const saved = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
        if (!saved.includes(tutorialId)) {
            saved.push(tutorialId);
            localStorage.setItem('savedTutorials', JSON.stringify(saved));
        }
    },
    unsaveTutorial: (tutorialId) => {
        const saved = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
        const filtered = saved.filter(id => id !== tutorialId);
        localStorage.setItem('savedTutorials', JSON.stringify(filtered));
    },
    
    // Preferences
    getPreferences: () => JSON.parse(localStorage.getItem('userPreferences') || '{}'),
    setPreference: (key, value) => {
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        preferences[key] = value;
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    
    // Newsletter
    subscribeToNewsletter: (email) => {
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({
            email,
            date: new Date().toISOString(),
            active: true
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
    },
    
    // Clear all data (for testing)
    clearAll: () => {
        localStorage.clear();
        initializeDefaultData();
    }
};
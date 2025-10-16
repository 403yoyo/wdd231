export function initializeStorage() {
    initializeDefaultData();
    
    loadUserPreferences();
}

function initializeDefaultData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    if (!localStorage.getItem('userPreferences')) {
        const defaultPreferences = {
            theme: 'light',
            notifications: true,
            language: 'en',
            itemsPerPage: 12
        };
        localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    }

    if (!localStorage.getItem('savedTutorials')) {
        localStorage.setItem('savedTutorials', JSON.stringify([]));
    }

    if (!localStorage.getItem('newsletterSubscriptions')) {
        localStorage.setItem('newsletterSubscriptions', JSON.stringify([]));
    }
}

function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    if (preferences.theme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    console.log('User preferences loaded:', preferences);
}

export const storage = {
    getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
    setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    
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
    
    getPreferences: () => JSON.parse(localStorage.getItem('userPreferences') || '{}'),
    setPreference: (key, value) => {
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        preferences[key] = value;
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    },
    
    subscribeToNewsletter: (email) => {
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({
            email,
            date: new Date().toISOString(),
            active: true
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
    },
    
    clearAll: () => {
        localStorage.clear();
        initializeDefaultData();
    }
};
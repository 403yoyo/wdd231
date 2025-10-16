// Modal management module
export function initializeModals() {
    setupModalEventListeners();
    setupAuthModals();
}

function setupModalEventListeners() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });

    // Close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });
}

function setupAuthModals() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'block';
        });
    }

    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // In a real app, this would make an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        document.getElementById('loginModal').style.display = 'none';
        updateAuthUI(user);
    } else {
        alert('Invalid email or password');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const interest = document.getElementById('signupInterest').value;

    if (!name || !email || !password || !interest) {
        alert('Please fill in all fields');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In real app, this would be hashed
        interest,
        joined: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Account created successfully!');
    document.getElementById('signupModal').style.display = 'none';
    updateAuthUI(newUser);
}

function updateAuthUI(user) {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth && user) {
        navAuth.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${user.name}</span>
                <button class="btn-logout" onclick="logout()">Logout</button>
            </div>
        `;
    }
}

// Global logout function
window.logout = function() {
    localStorage.removeItem('currentUser');
    location.reload();
};

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        updateAuthUI(JSON.parse(currentUser));
    }
});
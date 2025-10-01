/* Additional scripts for only join.html */

document.addEventListener('DOMContentLoaded', function() {
    const timestamp = document.getElementById('timestamp');
    if (timestamp) {
        const now = new Date();
        timestamp.value = now.toISOString();
    }

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
    const lastModified = document.getElementById('last-modified');
    if (lastModified) lastModified.textContent = document.lastModified;

    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            this.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
        });
    }

    const modals = document.querySelectorAll('.modal');
    const learnMoreButtons = document.querySelectorAll('.learn-more');
    const closeButtons = document.querySelectorAll('.close-modal');

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'flex';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
});
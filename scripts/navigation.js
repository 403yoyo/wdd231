document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function toggleNav() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        
        const isExpanded = nav.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    }
    
    function closeNav() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleNav);
        
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNav();
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.getComputedStyle(hamburger).display !== 'none') {
                closeNav();
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        const isClickInsideNav = nav.contains(e.target) || hamburger.contains(e.target);
        const isNavOpen = nav.classList.contains('active');
        
        if (!isClickInsideNav && isNavOpen) {
            closeNav();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNav();
            hamburger.focus();
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && nav.classList.contains('active')) {
            closeNav();
        }
    });
    
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'course.html';
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'course.html') ||
                (currentPage === 'course.html' && linkPage === 'course.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNavLink();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    if (window.innerWidth >= 768) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    function initializeAria() {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'main-navigation');
        nav.setAttribute('id', 'main-navigation');
        nav.setAttribute('aria-label', 'Main navigation');
    }
    
    initializeAria();
});

const navBar = document.querySelector('#nav-bar');
const navButton = document.querySelector('.hamburger');

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show'); 
  navBar.classList.toggle('show');  
});

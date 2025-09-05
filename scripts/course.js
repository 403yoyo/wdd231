document.addEventListener('DOMContentLoaded', function() {
    
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming concepts and programming languages.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development.',
            technology: ['HTML', 'CSS'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects to students.',
            technology: ['C#'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming languages.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming languages.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        }
    ];
    
    const coursesContainer = document.getElementById('courses-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalCreditsElement = document.getElementById('total-credits');
    
    let currentFilter = 'all';
    let filteredCourses = [...courses];
    
    function createCourseCard(course) {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;
        courseCard.setAttribute('data-subject', course.subject);
        
        const courseTitle = document.createElement('div');
        courseTitle.className = 'course-title';
        courseTitle.textContent = `${course.subject} ${course.number}`;
        
        const courseFullTitle = document.createElement('div');
        courseFullTitle.className = 'course-full-title';
        courseFullTitle.textContent = course.title;
        courseFullTitle.style.fontSize = 'var(--font-size-sm)';
        courseFullTitle.style.color = 'var(--text-secondary)';
        courseFullTitle.style.marginBottom = 'var(--spacing-xs)';
        
        const courseCredits = document.createElement('div');
        courseCredits.className = 'course-credits';
        courseCredits.textContent = `${course.credits} credit${course.credits !== 1 ? 's' : ''}`;
        
        if (course.technology && course.technology.length > 0) {
            const techTags = document.createElement('div');
            techTags.className = 'tech-tags';
            techTags.style.marginTop = 'var(--spacing-sm)';
            techTags.style.display = 'flex';
            techTags.style.flexWrap = 'wrap';
            techTags.style.gap = 'var(--spacing-xs)';
            
            course.technology.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                tag.style.fontSize = 'var(--font-size-sm)';
                tag.style.padding = '2px 6px';
                tag.style.backgroundColor = 'var(--primary-color)';
                tag.style.color = 'white';
                tag.style.borderRadius = 'var(--radius-sm)';
                tag.style.fontWeight = '500';
                techTags.appendChild(tag);
            });
            
            courseCard.appendChild(courseTitle);
            courseCard.appendChild(courseFullTitle);
            courseCard.appendChild(techTags);
            courseCard.appendChild(courseCredits);
        } else {
            courseCard.appendChild(courseTitle);
            courseCard.appendChild(courseFullTitle);
            courseCard.appendChild(courseCredits);
        }
        
        courseCard.addEventListener('click', function() {
            showCourseDetails(course);
        });
        
        courseCard.setAttribute('tabindex', '0');
        courseCard.setAttribute('role', 'button');
        courseCard.setAttribute('aria-label', `Course: ${course.subject} ${course.number} - ${course.title}`);
        
        courseCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showCourseDetails(course);
            }
        });
        
        return courseCard;
    }
    
    function displayCourses(coursesToShow) {
        coursesContainer.innerHTML = '';
        
        if (coursesToShow.length === 0) {
            const noCourses = document.createElement('div');
            noCourses.className = 'no-courses';
            noCourses.textContent = 'No courses found for the selected filter.';
            noCourses.style.textAlign = 'center';
            noCourses.style.color = 'var(--text-secondary)';
            noCourses.style.padding = 'var(--spacing-xl)';
            noCourses.style.fontStyle = 'italic';
            coursesContainer.appendChild(noCourses);
            return;
        }
        
        coursesToShow.forEach((course, index) => {
            const courseCard = createCourseCard(course);
            
            courseCard.style.opacity = '0';
            courseCard.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                courseCard.style.transition = 'all 0.3s ease';
                courseCard.style.opacity = '1';
                courseCard.style.transform = 'translateY(0)';
            }, index * 100);
            
            coursesContainer.appendChild(courseCard);
        });
    }
    
    function calculateTotalCredits(coursesToCalculate) {
        return coursesToCalculate.reduce((total, course) => total + course.credits, 0);
    }
    
    function updateTotalCredits(coursesToCalculate) {
        const total = calculateTotalCredits(coursesToCalculate);
        totalCreditsElement.textContent = total;
        
        totalCreditsElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalCreditsElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    function filterCourses(filter) {
        let filtered;
        
        switch (filter) {
            case 'WDD':
                filtered = courses.filter(course => course.subject === 'WDD');
                break;
            case 'CSE':
                filtered = courses.filter(course => course.subject === 'CSE');
                break;
            case 'all':
            default:
                filtered = [...courses];
                break;
        }
        
        filteredCourses = filtered;
        displayCourses(filtered);
        updateTotalCredits(filtered);
        
        if (filter !== 'all') {
            window.location.hash = filter.toLowerCase();
        } else {
            history.replaceState(null, null, window.location.pathname);
        }
    }
    
    function showCourseDetails(course) {
        const details = `
            Course: ${course.subject} ${course.number}
            Title: ${course.title}
            Credits: ${course.credits}
            Certificate: ${course.certificate}
            Description: ${course.description}
            Technologies: ${course.technology ? course.technology.join(', ') : 'Not specified'}
            Status: ${course.completed ? 'Completed ✓' : 'In Progress'}
        `;
        
        alert(details);
    }
    
    function updateFilterButtons(activeFilter) {
        filterButtons.forEach(button => {
            const filter = button.getAttribute('data-filter');
            
            if (filter === activeFilter) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    function getCompletionStats() {
        const total = courses.length;
        const completed = courses.filter(course => course.completed).length;
        const percentage = Math.round((completed / total) * 100);
        
        return { total, completed, percentage };
    }
    
    function displayCompletionStats() {
        const stats = getCompletionStats();
        const statsElement = document.createElement('div');
        statsElement.className = 'completion-stats';
        statsElement.innerHTML = `
            <p>Course Progress: ${stats.completed}/${stats.total} (${stats.percentage}%)</p>
        `;
        statsElement.style.textAlign = 'center';
        statsElement.style.marginBottom = 'var(--spacing-lg)';
        statsElement.style.padding = 'var(--spacing-md)';
        statsElement.style.backgroundColor = 'var(--hover-color)';
        statsElement.style.borderRadius = 'var(--radius-md)';
        statsElement.style.color = 'var(--primary-color)';
        statsElement.style.fontWeight = '600';
        
        const filterButtons = document.querySelector('.filter-buttons');
        filterButtons.parentNode.insertBefore(statsElement, filterButtons);
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            filterCourses(filter);
            updateFilterButtons(filter);
        });
        
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', 'false');
    });
    
    function initialize() {
        const hash = window.location.hash.substring(1);
        if (hash && ['wdd', 'cse'].includes(hash)) {
            currentFilter = hash.toUpperCase();
        }
        
        filterCourses(currentFilter);
        updateFilterButtons(currentFilter);
        
        displayCompletionStats();
        
        filterButtons.forEach((button, index) => {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = e.key === 'ArrowLeft' 
                        ? (index - 1 + filterButtons.length) % filterButtons.length
                        : (index + 1) % filterButtons.length;
                    filterButtons[nextIndex].focus();
                }
            });
        });
    }
    
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const filter = hash && ['wdd', 'cse'].includes(hash) ? hash.toUpperCase() : 'all';
        currentFilter = filter;
        filterCourses(filter);
        updateFilterButtons(filter);
    });
    
    initialize();
    
    window.courseUtils = {
        filterCourses,
        calculateTotalCredits,
        getCompletionStats,
        courses: courses
    };
});
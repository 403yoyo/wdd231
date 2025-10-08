function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            this.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
        });

        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('show');
                hamburger.textContent = '☰';
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = event.target.closest('.main-nav');
            if (!isClickInsideNav && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                hamburger.textContent = '☰';
            }
        });
    }
}

async function loadAttractions() {
    try {
        const response = await fetch('data/attractions.json');
        const attractions = await response.json();
        displayAttractions(attractions);
    } catch (error) {
        console.error('Error loading attractions:', error);
        const fallbackAttractions = [
            {
                id: 1,
                name: "Yankari Game Reserve",
                address: "Bauchi State, Nigeria",
                description: "Nigeria's premier game reserve with natural warm springs, wildlife including elephants, lions, and over 350 bird species.",
                image: "images/yankari-reserve.webp"
            },
            {
                id: 2,
                name: "Great Wall of China",
                address: "Northern China",
                description: "The world's longest wall stretching over 13,000 miles, built to protect Chinese states from invasions. A UNESCO World Heritage site.",
                image: "images/great-wall.webp"
            },
            {
                id: 3,
                name: "Olumo Rock",
                address: "Abeokuta, Ogun State, Nigeria",
                description: "Ancient rock formation that served as a natural fortress during inter-tribal wars. Offers panoramic views of Abeokuta city.",
                image: "images/olumo-rock.webp"
            },
            {
                id: 4,
                name: "Forbidden City",
                address: "Beijing, China",
                description: "Imperial palace from Ming to Qing dynasties with 980 buildings. The world's largest palace complex and UNESCO site.",
                image: "images/forbidden-city.webp"
            },
            {
                id: 5,
                name: "Zuma Rock",
                address: "Niger State, Nigeria",
                description: "Monolithic rock formation often called 'Gateway to Abuja'. A prominent natural landmark visible from great distances.",
                image: "images/zuma-rock.webp"
            },
            {
                id: 6,
                name: "Terracotta Army",
                address: "Xi'an, Shaanxi Province, China",
                description: "Collection of terracotta sculptures depicting the armies of Qin Shi Huang, China's first emperor. Discovered in 1974.",
                image: "images/terracotta-army.webp"
            },
            {
                id: 7,
                name: "Erin Ijesha Waterfall",
                address: "Osun State, Nigeria",
                description: "Also known as Olumirin Waterfall, this seven-level waterfall offers breathtaking views and natural swimming pools.",
                image: "images/erin-ijesha.webp"
            },
            {
                id: 8,
                name: "Li River",
                address: "Guilin, Guangxi, China",
                description: "Famous for its stunning karst mountain landscape, featured on the 20 RMB note. Perfect for scenic boat cruises.",
                image: "images/li-river.webp"
            }
        ];
        displayAttractions(fallbackAttractions);
    }
}

function displayAttractions(attractions) {
    const grid = document.getElementById('attractions-grid');
    grid.innerHTML = '';

    attractions.forEach(attraction => {
        const card = document.createElement('article');
        card.className = 'attraction-card';
        card.innerHTML = `
            <figure>
                <img src="${attraction.image}" 
                     alt="${attraction.name}" 
                     class="attraction-image" 
                     loading="lazy"
                     width="300" 
                     height="200">
            </figure>
            <div class="attraction-content">
                <h2>${attraction.name}</h2>
                <address class="attraction-address">${attraction.address}</address>
                <p class="attraction-description">${attraction.description}</p>
                <button class="learn-more-btn" onclick="showMoreInfo(${attraction.id})">Learn More</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function showMoreInfo(attractionId) {
    const attractions = [
        {
            id: 1,
            moreInfo: "Yankari Game Reserve features Wikki Warm Springs with constant 31°C temperature year-round. Best visited between November and May for optimal wildlife viewing."
        },
        {
            id: 2,
            moreInfo: "The Great Wall construction began as early as 7th century BC. The most visited section is Badaling, easily accessible from Beijing. Visit during spring or autumn for best weather."
        },
        {
            id: 3,
            moreInfo: "Olumo Rock stands 137 meters tall. The name means 'God moulded' in Yoruba. It features ancient shrines, trees over 200 years old, and a museum at its base."
        },
        {
            id: 4,
            moreInfo: "The Forbidden City covers 180 acres and took 14 years to build. It houses the Palace Museum with over 1.8 million artifacts. Closed on Mondays."
        },
        {
            id: 5,
            moreInfo: "Zuma Rock rises 725 meters above surroundings. It appears on the 100 Naira note. Local legends consider it a spiritual site with protective powers."
        },
        {
            id: 6,
            moreInfo: "The Terracotta Army includes over 8,000 soldiers, 130 chariots, and 670 horses. Each figure has unique facial features. Pit 1 is the largest and most impressive."
        },
        {
            id: 7,
            moreInfo: "Erin Ijesha Waterfall drops about 30 meters at the first level. The climb to higher levels is challenging but rewarding. Local guides are available for tours."
        },
        {
            id: 8,
            moreInfo: "Li River cruises from Guilin to Yangshuo take 4-5 hours. The landscape inspired countless Chinese paintings and poems. Best visited March to October."
        }
    ];

    const attraction = attractions.find(a => a.id === attractionId);
    if (attraction) {
        alert(`${attraction.moreInfo}`);
    } else {
        alert("More information about this attraction would be displayed here.");
    }
}

function handleVisitorMessage() {
    const visitMessage = document.getElementById('visit-message');
    const closeButton = document.getElementById('close-message');
    const messageContainer = document.querySelector('.visitor-message');

    if (!visitMessage || !closeButton || !messageContainer) {
        console.error('Visitor message elements not found!');
        return;
    }

    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = Date.now();

    console.log('Last visit from localStorage:', lastVisit);
    console.log('Current visit timestamp:', currentVisit);

    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
        console.log('First visit - showing welcome message');
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const timeDifference = currentVisit - lastVisitTime;
        const daysBetween = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hoursBetween = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutesBetween = Math.floor(timeDifference / (1000 * 60));

        console.log('Time since last visit:', {
            days: daysBetween,
            hours: hoursBetween,
            minutes: minutesBetween,
            milliseconds: timeDifference
        });

        const lastVisitDate = new Date(lastVisitTime);
        const formattedDate = lastVisitDate.toLocaleDateString();
        const formattedTime = lastVisitDate.toLocaleTimeString();

        if (daysBetween < 1) {
            if (hoursBetween < 1) {
                visitMessage.textContent = `Welcome back!, Your last visit was ${minutesBetween} minute${minutesBetween === 1 ? '' : 's'} ago (${formattedDate} at ${formattedTime}). Awesome!`;
            } else {
                visitMessage.textContent = `Back so soon! Your last visit was ${hoursBetween} hour${hoursBetween === 1 ? '' : 's'} ago (${formattedDate} at ${formattedTime}). Awesome!`;
            }
        } else {
            const dayText = daysBetween === 1 ? "day" : "days";
            visitMessage.textContent = `You last visited ${daysBetween} ${dayText} ago (${formattedDate} at ${formattedTime}).`;
        }

        console.log('Last visit was on:', lastVisitDate.toLocaleString());
    }

    localStorage.setItem('lastVisit', currentVisit.toString());
    console.log('Stored current visit in localStorage:', currentVisit);

    closeButton.addEventListener('click', () => {
        console.log('User closed the message for this session');
        messageContainer.style.display = 'none';
    });
}

function clearVisitData() {
    localStorage.removeItem('lastVisit');
    console.log('Visit data cleared. Refresh the page to test first visit message.');
}

window.clearVisitData = clearVisitData;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Discover page initialized');
    setupHamburgerMenu();
    loadAttractions();
    handleVisitorMessage();

    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;

    console.log('To test visitor messages, run: clearVisitData() in console and refresh the page');
});
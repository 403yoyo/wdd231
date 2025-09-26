function renderSpotlights() {
        const spotlightContainer = document.getElementById('spotlight-cards');
        if (!spotlightContainer) return;
        fetch('data/members.json')
            .then(res => res.json())
            .then(members => {
                // Gold is 3, Silver is 2
                const goldSilver = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
                for (let i = goldSilver.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [goldSilver[i], goldSilver[j]] = [goldSilver[j], goldSilver[i]];
                }
                const spotlights = goldSilver.slice(0, 3);
                spotlightContainer.innerHTML = '';
                            spotlights.forEach(member => {
                                    const link = document.createElement('a');
                                    link.href = 'directory.html';
                                    link.target = '_blank';
                                    link.rel = 'noopener';
                                    link.className = 'business-card';
                                        let urlText = member.website ? member.website.replace('https://','').replace('http://','') : '';
                                        link.innerHTML = `
                                                <div class="business-img"><img src="images/${member.image}" alt="${member.name}" loading="lazy"></div>
                                                <div class="business-info">
                                                    <div class="business-name">${member.name}</div>
                                                    <div class="business-tag">${member.description}</div>
                                                    <div class="business-contact">
                                                        <div><strong>Phone Number:</strong> ${member.phone}</div>
                                                        <div><strong>Address:</strong> ${member.address}</div>
                                                        <div><strong>Website:</strong> <span class="url-text">${urlText || 'N/A'}</span></div>
                                                        <div><strong>Membership:</strong> ${member.membershipLevel === 3 ? 'Gold' : member.membershipLevel === 2 ? 'Silver' : 'Member'}</div>
                                                    </div>
                                                </div>
                                            `;
                                    spotlightContainer.appendChild(link);
                            });
            });
}
const weatherApiKey = 'd94472af5d3fbcebf525946c6039f7e2';
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Lagos,NG&units=metric&appid=${weatherApiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Lagos,NG&units=metric&appid=${weatherApiKey}`;

function renderWeather() {
    const weatherPanel = document.getElementById('weather-panel');
    const forecastPanel = document.getElementById('forecast-panel');
    
    if (weatherPanel) {
        fetch(weatherUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Weather data not available');
                }
                return res.json();
            })
            .then(data => {
                if (!data || !data.main) {
                    throw new Error('Invalid weather data');
                }
                
                const temp = Math.round(data.main.temp);
                const desc = data.weather[0].description;
                const icon = data.weather[0].icon;
                const humidity = data.main.humidity;
                const feelsLike = Math.round(data.main.feels_like);
                const windSpeed = data.wind.speed;
                
                weatherPanel.innerHTML = `
                    <div class="weather-main">
                        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" width="60" height="60">
                        <span class="weather-temp">${temp}&deg;C</span>
                    </div>
                    <div class="weather-desc">${desc.charAt(0).toUpperCase() + desc.slice(1)}</div>
                    <ul class="weather-details">
                        <li><span>Feels like:</span> <span>${feelsLike}&deg;C</span></li>
                        <li><span>Humidity:</span> <span>${humidity}%</span></li>
                        <li><span>Wind:</span> <span>${windSpeed} m/s</span></li>
                    </ul>
                `;
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                weatherPanel.innerHTML = `
                    <div class="weather-error">
                        <p>Weather data unavailable</p>
                        <small>${error.message}</small>
                    </div>
                `;
            });
    }
    
    if (forecastPanel) {
        fetch(forecastUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Forecast data not available');
                }
                return res.json();
            })
            .then(data => {
                if (!data || !data.list) {
                    throw new Error('Invalid forecast data');
                }
                
                const forecastDays = {};
                const today = new Date();
                
                data.list.forEach(item => {
                    const date = new Date(item.dt * 1000);
                    if (date.getDate() !== today.getDate() && 
                        date.getDate() !== today.getDate() + 1 && 
                        date.getDate() !== today.getDate() + 2) {
                        return;
                    }
                    
                    const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const hour = date.getHours();
                    
                    if (hour === 12 || !forecastDays[dayKey]) {
                        forecastDays[dayKey] = {
                            temp: Math.round(item.main.temp),
                            desc: item.weather[0].description,
                            icon: item.weather[0].icon,
                            date: date
                        };
                    }
                });
                
                const forecastArray = Object.values(forecastDays)
                    .sort((a, b) => a.date - b.date)
                    .slice(0, 3);
                
                forecastPanel.innerHTML = `
                    <div class="forecast-container">
                        ${forecastArray.map(day => `
                            <div class="forecast-day">
                                <div class="forecast-date">${day.date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.desc}" width="40" height="40">
                                <div class="forecast-temp">${day.temp}&deg;C</div>
                                <div class="forecast-desc">${day.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error fetching forecast:', error);
                forecastPanel.innerHTML = `
                    <div class="weather-error">
                        <p>Forecast unavailable</p>
                        <small>${error.message}</small>
                    </div>
                `;
            });
    }
}

const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('.nav-links');

if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const cardsContainer = document.getElementById('member-cards-container');

if (gridViewBtn && listViewBtn && cardsContainer) {
    cardsContainer.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    
    gridViewBtn.addEventListener('click', () => {
        cardsContainer.classList.remove('list-view');
        cardsContainer.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });
    
    listViewBtn.addEventListener('click', () => {
        cardsContainer.classList.remove('grid-view');
        cardsContainer.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });
}

const displayMembers = (members) => {
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('member-card');

        if (member.membershipLevel === 3) {
            card.classList.add('gold');
        } else if (member.membershipLevel === 2) {
            card.classList.add('silver');
        } else {
            card.classList.add('member');
        }

        const image = document.createElement('img');
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
        image.loading = 'lazy';

        const name = document.createElement('h3');
        name.textContent = member.name;

        const address = document.createElement('p');
        address.textContent = member.address;

            const phone = document.createElement('div');
            phone.innerHTML = `<strong>Phone Number:</strong> ${member.phone}`;

            const urlText = member.website ? member.website.replace('https://','').replace('http://','') : '';
            const urlDisplay = document.createElement('div');
            urlDisplay.innerHTML = `<strong>Website:</strong> <span class="url-text">${urlText || 'N/A'}</span>`;

        const membershipLevel = document.createElement('p');
        membershipLevel.textContent = `Membership Level: ${member.membershipLevel}`;

        const extraInfo = document.createElement('p');
        extraInfo.textContent = member.info || '';

        card.append(image, name, address, phone, urlDisplay, membershipLevel, extraInfo);
        cardsContainer.appendChild(card);
    });
};

const getMembers = async () => {
    if (!cardsContainer) return;
    
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Failed to fetch members.json');
        const data = await response.json();
        displayMembers(data);
    } catch (error) {
        console.error(error);
        cardsContainer.innerHTML = '<p>Failed to load members.</p>';
    }
};

const copyrightYear = document.getElementById('copyright-year');
const lastModified = document.getElementById('last-modified');

if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;

document.addEventListener('DOMContentLoaded', () => {
    getMembers();
    renderWeather();
    renderSpotlights();
});
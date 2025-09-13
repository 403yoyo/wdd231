const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const cardsContainer = document.getElementById('member-cards-container');

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

const displayMembers = (members) => {
    cardsContainer.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('member-card');

        const image = document.createElement('img');
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
        image.loading = 'lazy';

        const name = document.createElement('h3');
        name.textContent = member.name;

        const address = document.createElement('p');
        address.textContent = member.address;

        const phone = document.createElement('p');
        phone.textContent = member.phone;

        const website = document.createElement('a');
        website.href = member.website;
        website.textContent = member.website;
        website.target = '_blank';

        const membershipLevel = document.createElement('p');
        membershipLevel.textContent = `Membership Level: ${member.membershipLevel}`;

        const extraInfo = document.createElement('p');
        extraInfo.textContent = member.info || '';

        card.append(image, name, address, phone, website, membershipLevel, extraInfo);
        cardsContainer.appendChild(card);
    });
};

const getMembers = async () => {
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
});
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    let card = document.createElement('section');
    let fullName = document.createElement('h2');
    let birthDate = document.createElement('p');
    let birthPlace = document.createElement('p');
    let portrait = document.createElement('img');

    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
    birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');

    card.appendChild(fullName);
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);

    cards.appendChild(card);
  });
};

const getProphetData = async () => {
  const response = await fetch(url);
  const data = await response.json();
  displayProphets(data.prophets);
};

getProphetData();

document.addEventListener("DOMContentLoaded", () => {
  const modified = new Date(document.lastModified);
  const day = modified.getDate();
  const month = modified.toLocaleString("en-GB", { month: "long" });
  const year = modified.getFullYear();
  const formattedDate = `${day} ${month}, ${year}`;

  const optionsTime = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
  const formattedTime = modified.toLocaleTimeString("en-GB", optionsTime);

  document.getElementById("lastModified").textContent =
    `Last Modified: ${formattedDate} | ${formattedTime}`;

  const city = "Benin City, Nigeria";
  document.getElementById("location").textContent = `Location: ${city}`;
});
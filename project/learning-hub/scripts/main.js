import { loadFeatured } from './modules/tutorials.js';

window.addEventListener('DOMContentLoaded', () => {
  // Initialize simple UI hooks
  const featured = document.getElementById('featured-list');
  if (featured) {
    loadFeatured().then(items => {
      featured.innerHTML = '';
      items.slice(0,6).forEach(t => {
        const el = document.createElement('article');
        el.className = 'card';
        el.innerHTML = `<h4>${t.title}</h4><p>${t.summary}</p>`;
        featured.appendChild(el);
      });
    }).catch(err => {
      featured.textContent = 'Failed to load featured tutorials.';
      console.error(err);
    });
  }
});
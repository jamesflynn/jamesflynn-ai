// Auto-update copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  navLinks.classList.toggle('open', !isOpen);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

// Render latest Substack posts
const writingGrid = document.getElementById('writing-grid');

if (writingGrid) {
  fetch('posts.json')
    .then(res => res.json())
    .then(({ posts }) => {
      posts.forEach(post => {
        const card = document.createElement('a');
        card.className = 'writing-card';
        card.href = post.link;
        card.target = '_blank';
        card.rel = 'noopener';

        if (post.image) {
          const img = document.createElement('img');
          img.className = 'writing-card-image';
          img.src = post.image;
          img.alt = '';
          img.loading = 'lazy';
          card.appendChild(img);
        }

        const body = document.createElement('div');
        body.className = 'writing-card-body';

        const date = document.createElement('p');
        date.className = 'writing-card-date';
        date.textContent = new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        const title = document.createElement('h4');
        title.className = 'writing-card-title';
        title.textContent = post.title;

        const desc = document.createElement('p');
        desc.className = 'writing-card-desc';
        desc.textContent = post.description;

        body.append(date, title, desc);
        card.appendChild(body);
        writingGrid.appendChild(card);
      });
    })
    .catch(() => {
      document.getElementById('writing').style.display = 'none';
    });
}

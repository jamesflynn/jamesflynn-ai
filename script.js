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
    .then(res => {
      // fetch only rejects on network failure — a 404 from Pages resolves
      // with an HTML body, so check the status explicitly.
      if (!res.ok) throw new Error(`posts.json returned HTTP ${res.status}`);
      return res.json();
    })
    .then(({ posts }) => {
      if (!Array.isArray(posts) || posts.length === 0) {
        throw new Error('posts.json contained no posts');
      }

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

        // fetch_posts.py writes date: null when an item has no pubDate —
        // formatting that would print "Invalid Date", so omit it instead.
        const parsed = post.date ? new Date(post.date + 'T00:00:00') : null;
        const date = document.createElement('p');
        date.className = 'writing-card-date';
        if (parsed && !Number.isNaN(parsed.valueOf())) {
          date.textContent = parsed.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
        }

        const title = document.createElement('h4');
        title.className = 'writing-card-title';
        title.textContent = post.title;

        const desc = document.createElement('p');
        desc.className = 'writing-card-desc';
        desc.textContent = post.description;

        body.append(...(date.textContent ? [date] : []), title, desc);
        card.appendChild(body);
        writingGrid.appendChild(card);
      });
    })
    .catch(err => {
      // Keep the section rather than hiding it — the intro paragraph above
      // already links to Substack, which is the thing a reader actually wants.
      console.error('Could not load posts.json:', err);

      const note = document.createElement('p');
      note.className = 'writing-fallback';
      note.append('Recent posts couldn’t be loaded. ');

      const link = document.createElement('a');
      link.href = 'https://jamesflynn8.substack.com';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Read them on Substack';

      note.append(link, '.');
      writingGrid.appendChild(note);
    });
}

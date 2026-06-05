// Category filter
const filterBtns = document.querySelectorAll('.filter-btn');
const posts = document.querySelectorAll('.post-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    posts.forEach(post => {
      if (filter === 'all' || post.dataset.category === filter) {
        post.classList.remove('hidden');
      } else {
        post.classList.add('hidden');
      }
    });
  });
});

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    if (!input.value.trim()) { input.focus(); return; }
    const btn = newsletterForm.querySelector('button');
    btn.disabled = true;
    btn.textContent = '¡Suscrito!';
    input.value = '';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Suscribirme';
    }, 3000);
  });
}

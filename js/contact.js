const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.classList.remove('input-error');
      if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
        field.classList.add('input-error');
        valid = false;
      }
    });

    if (!valid) {
      const first = form.querySelector('.input-error');
      if (first) first.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    // Build WhatsApp fallback message
    const nombre = form.querySelector('[name="nombre"]')?.value || '';
    const tipo = form.querySelector('[name="tipo"]')?.value || '';
    const origen = form.querySelector('[name="origen"]')?.value || '';
    const destino = form.querySelector('[name="destino"]')?.value || '';
    const msg = encodeURIComponent(
      `Hola ContiMovers, soy ${nombre}. Solicito cotización: ${tipo} de ${origen} a ${destino}.`
    );

    // Simulate submission (replace with fetch() to your backend/formspree endpoint)
    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.hidden = false;
        success.querySelector('.wa-link')?.setAttribute(
          'href',
          `https://wa.me/51999999999?text=${msg}`
        );
        success.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 800);
  });
}

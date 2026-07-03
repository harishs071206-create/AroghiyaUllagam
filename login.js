document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const btn = document.querySelector('.btn-login');
  if (form) {
    form.addEventListener('submit', () => {
      btn.textContent = 'Signing in…';
      btn.disabled = true;
    });
  }
  // Auto-focus username
  const u = document.getElementById('username');
  if (u) u.focus();
});

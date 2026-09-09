// Copy-to-clipboard email button and toast notification.
/* ============================================================
   COPY EMAIL + TOAST
============================================================ */
const toastEl = $('#toast'); let toastTimer;
function toast(msg){
  $('#toastMsg').textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}
 $('#copyBtn').addEventListener('click', async () => {
  const email = 'lesibajmine@gmail.com';
  try { await navigator.clipboard.writeText(email); }
  catch {
    const ta = document.createElement('textarea');
    ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch {}
    ta.remove();
  }
  toast('Email copied to clipboard');
});

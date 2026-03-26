// sidebar.js — sidebar desktop + bottom nav mobile
(function() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  // ---- SIDEBAR HTML ----
  const sidebarHtml = `
  <aside class="sidebar" id="sidebar">
    <a href="index.html" class="sidebar-logo">
      <img src="./style/img/logov2.png" alt="IL CLUB Logo">
      <div class="sidebar-logo-text">
        <span class="brand">IL CLUB</span>
        <span class="tagline">Football Society</span>
      </div>
    </a>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Principale</div>
      <a href="index.html" ${current==='index.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>Dashboard
      </a>
      <a href="rosa.html" ${current==='rosa.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>Rosa
      </a>
      <a href="storico.html" ${current==='storico.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Storico
      </a>
      <a href="storia.html" ${current==='storia.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Storia
      </a>
      <div class="nav-section-label" style="margin-top:1rem">Gestione</div>
      <a href="partite.html" ${current==='partite.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>Partite
      </a>
      <a href="admin.html" id="admin-link" style="display:none" ${current==='admin.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Admin
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="user-chip" id="user-chip-btn" title="Clicca per uscire">
        <div class="user-avatar" id="user-avatar"><img src = "../style/img/user-4-16.png"></div>
        <div class="user-info">
          <div class="user-name" id="user-name">—</div>
          <div class="user-role" id="user-role"></div>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             style="width:14px;height:14px;margin-left:auto;color:var(--muted);flex-shrink:0">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </div>
    </div>
  </aside>
  <div id="sidebar-overlay" onclick="closeSidebar()"></div>`;

  // ---- BOTTOM NAV HTML ----
  const bottomNavHtml = `
  <nav class="mobile-bottom-nav" id="mobile-bottom-nav">
    <a href="index.html" ${current==='index.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      <span>Home</span>
    </a>
    <a href="rosa.html" ${current==='rosa.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      <span>Rosa</span>
    </a>
    <a href="partite.html" ${current==='partite.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
      <span>Partite</span>
    </a>
    <a href="storico.html" ${current==='storico.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      <span>Storico</span>
    </a>
    <a href="storia.html" id="bn-last" ${current==='storia.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span>Storia</span>
    </a>
  </nav>`;

  // Inject sidebar
  const target = document.getElementById('sidebar-mount');
  if (target) {
    target.innerHTML = sidebarHtml;
    UI.initSidebar();
    document.getElementById('user-chip-btn').addEventListener('click', () => {
      if (AUTH.currentUser) { if (confirm('Vuoi uscire?')) AUTH.logout(); }
      else window.location.href = 'login.html';
    });
  }

  // Inject bottom nav in body
  const bnEl = document.createElement('nav');
  bnEl.className = 'mobile-bottom-nav';
  bnEl.id = 'mobile-bottom-nav';
  bnEl.innerHTML = document.createRange().createContextualFragment(bottomNavHtml).querySelector('nav').innerHTML;
  document.body.appendChild(bnEl);

  // Aggiorna ultimo link bottom nav se admin
  setTimeout(() => {
    if (AUTH.can('admin')) {
      const last = document.getElementById('bn-last');
      if (last) {
        last.href = 'admin.html';
        last.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Admin</span>`;
        if (current === 'admin.html') last.classList.add('active');
        else last.classList.remove('active');
      }
    }
  }, 50);
})();

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (!s) return;
  const open = s.classList.toggle('open');
  o.classList.toggle('visible', open);
}
function closeSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (s) s.classList.remove('open');
  if (o) o.classList.remove('visible');
}

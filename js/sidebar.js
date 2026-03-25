// sidebar.js — inietta sidebar + bottom nav mobile e inizializza UI.initSidebar()
(function() {
  const navLinks = [
    { href:'index.html',   label:'Dashboard', icon:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
    { href:'rosa.html',    label:'Rosa',      icon:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' },
    { href:'storico.html', label:'Storico',   icon:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
    { href:'storia.html',  label:'Storia',    icon:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
    { href:'partite.html', label:'Partite',   icon:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>' },
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';

  // ---- SIDEBAR (desktop) ----
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
      ${navLinks.slice(0,4).map(l=>`
      <a href="${l.href}" ${l.href===current?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${l.icon}</svg>
        ${l.label}
      </a>`).join('')}

      <div class="nav-section-label" style="margin-top:1rem">Gestione</div>
      <a href="partite.html" ${current==='partite.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
        </svg>
        Partite
      </a>
      <a href="admin.html" id="admin-link" style="display:none" ${current==='admin.html'?'class="active"':''}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        Admin
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="user-chip" id="user-chip-btn" title="Clicca per uscire">
        <div class="user-avatar" id="user-avatar">?</div>
        <div class="user-info">
          <div class="user-name" id="user-name">—</div>
          <div class="user-role" id="user-role">—</div>
        </div>
        <svg id="user-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-left:auto;color:var(--muted);flex-shrink:0">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </div>
    </div>
  </aside>
  <div id="sidebar-overlay"
       onclick="closeSidebar()"
       style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199;backdrop-filter:blur(2px)">
  </div>`;

  // ---- BOTTOM NAV (mobile) ----
  // Mostra: Dashboard, Rosa, Partite, Storico + (Admin se ha permesso)
  const bottomNavHtml = `
  <nav class="mobile-bottom-nav" id="mobile-bottom-nav">
    <a href="index.html" ${current==='index.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      Home
    </a>
    <a href="rosa.html" ${current==='rosa.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      Rosa
    </a>
    <a href="partite.html" ${current==='partite.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
      Partite
    </a>
    <a href="storico.html" ${current==='storico.html'?'class="active"':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      Storico
    </a>
    <a href="storia.html" ${current==='storia.html'||current==='admin.html'?'class="active"':''} id="mobile-more-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Storia
    </a>
  </nav>`;

  // Inject sidebar
  const target = document.getElementById('sidebar-mount');
  if (target) {
    target.innerHTML = sidebarHtml;
    UI.initSidebar();

    // user chip: logout se loggato, altrimenti vai al login
    document.getElementById('user-chip-btn').addEventListener('click', () => {
      if (AUTH.currentUser) {
        if (confirm('Vuoi uscire?')) AUTH.logout();
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  // Inject bottom nav
  const bnContainer = document.createElement('div');
  bnContainer.innerHTML = bottomNavHtml;
  document.body.appendChild(bnContainer.firstElementChild);

  // Aggiorna icona More se admin
  setTimeout(() => {
    if (AUTH.can('admin')) {
      const moreBtn = document.getElementById('mobile-more-btn');
      if (moreBtn) {
        moreBtn.href = 'admin.html';
        moreBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Admin`;
        if (current === 'admin.html') moreBtn.classList.add('active');
      }
    }
  }, 0);
})();

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (!s) return;
  const isOpen = s.classList.contains('open');
  if (isOpen) {
    s.classList.remove('open');
    o.style.display = 'none';
  } else {
    s.classList.add('open');
    o.style.display = 'block';
  }
}

function closeSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (s) s.classList.remove('open');
  if (o) o.style.display = 'none';
}

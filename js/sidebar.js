// sidebar.js — inietta la sidebar HTML e inizializza UI.initSidebar()
(function() {
  const html = `
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
      <a href="index.html">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Dashboard
      </a>
      <a href="rosa.html">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        Rosa
      </a>
      <a href="storico.html">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Storico
      </a>
      <a href="storia.html">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Storia
      </a>

      <div class="nav-section-label" style="margin-top:1rem">Gestione</div>
      <a href="partite.html">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
        </svg>
        Partite
      </a>
      <a href="admin.html" id="admin-link" style="display:none">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        Admin
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="user-chip" onclick="AUTH.logout()" title="Clicca per uscire">
        <div class="user-avatar" id="user-avatar">?</div>
        <div class="user-info">
          <div class="user-name" id="user-name">—</div>
          <div class="user-role" id="user-role">—</div>
        </div>
      </div>
    </div>
  </aside>
  <div id="sidebar-overlay"
       onclick="document.getElementById('sidebar').classList.remove('open');this.style.display='none'"
       style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99">
  </div>
  `;

  const target = document.getElementById('sidebar-mount');
  if (target) {
    target.innerHTML = html;
    UI.initSidebar();
  }
})();

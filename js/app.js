// ============================================================
// IL CLUB — Auth & DB Layer — Supabase Edition
// ============================================================

const SUPABASE_URL  = 'https://flwmhplhhlsasevhokbe.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd21ocGxoaGxzYXNldmhva2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NDI3ODEsImV4cCI6MjA4OTMxODc4MX0.-Yej65Ql4N8MevSjhJqSEHppqyA8xRgyqUBe6IPNSFw';

const SB = {
  headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${AUTH._sbToken || SUPABASE_ANON}`,
      ...extra
    };
  },

  async get(table, query = '') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: this.headers({ 'Accept': 'application/json' })
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || res.status); }
    return res.json();
  },

  async post(table, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: this.headers({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(body)
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || res.status); }
    return res.json();
  },

  async patch(table, id, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: this.headers({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(body)
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || res.status); }
    return res.json();
  },

  async delete(table, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.headers()
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || res.status); }
    return true;
  },

  async signUp(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async signOut(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${token}` }
    });
  },

  async getUser(token) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return res.json();
  }
};

const AUTH = {
  currentUser: null,
  _sbToken: null,

  async init() {
    const saved = sessionStorage.getItem('ilclub_user');
    const token = sessionStorage.getItem('ilclub_token');
    if (saved && token) {
      this._sbToken = token;
      const sbUser = await SB.getUser(token);
      if (!sbUser || sbUser.error) {
        this._clear();
        return;
      }
      this.currentUser = JSON.parse(saved);
    }
  },

  _clear() {
    this.currentUser = null;
    this._sbToken = null;
    sessionStorage.removeItem('ilclub_user');
    sessionStorage.removeItem('ilclub_token');
  },

  async login(username, password) {
    try {
      const email = username.includes('@') ? username : `${username}@ilclub.local`;
      const data = await SB.signIn(email, password);
      if (data.error || !data.access_token) {
        return { ok: false, error: 'Credenziali non valide' };
      }
      this._sbToken = data.access_token;
      const profiles = await SB.get('profiles', `auth_id=eq.${data.user.id}&select=*`);
      if (!profiles || profiles.length === 0) {
        return { ok: false, error: 'Profilo utente non trovato' };
      }
      const profile = profiles[0];
      this.currentUser = {
        id: profile.id,
        auth_id: data.user.id,
        name: profile.name,
        username: profile.username,
        role: profile.role,
        email: data.user.email
      };
      sessionStorage.setItem('ilclub_user', JSON.stringify(this.currentUser));
      sessionStorage.setItem('ilclub_token', data.access_token);
      return { ok: true, user: this.currentUser };
    } catch (err) {
      console.error('Login error:', err);
      return { ok: false, error: 'Errore di connessione' };
    }
  },

  async logout() {
    if (this._sbToken) await SB.signOut(this._sbToken).catch(() => {});
    this._clear();
    window.location.href = 'login.html';
  },

  async register(username, password, name) {
    try {
      const email = `${username}@ilclub.local`;
      const data = await SB.signUp(email, password);
      if (data.error) {
        const msg = data.error.message || '';
        if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists'))
          return { ok: false, error: 'Username già in uso' };
        return { ok: false, error: msg || 'Errore registrazione' };
      }
      if (!data.user && !data.id) return { ok: false, error: 'Registrazione non completata. Riprova.' };
      const userId = data.user?.id || data.id;
      // Usa il token della sessione appena creata (se disponibile) per inserire il profilo
      const sessionToken = data.session?.access_token || null;
      const savedToken = this._sbToken;
      if (sessionToken) this._sbToken = sessionToken;
      try {
        await SB.post('profiles', { auth_id: userId, username, name, role: 'fan' });
      } catch(e) {
        console.warn('Profilo non creato via REST (serve trigger Supabase):', e.message);
      }
      this._sbToken = savedToken;
      return { ok: true };
    } catch (err) {
      console.error('Register error:', err);
      return { ok: false, error: 'Errore di connessione' };
    }
  },

  can(action) {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;
    const perms = {
      view:        ['fan', 'membro', 'admin'],
      editMatch:   ['membro', 'admin'],
      editPlayer:  ['membro', 'admin'],
      editHistory: ['membro', 'admin'],
      admin:       ['admin'],
    };
    return (perms[action] || []).includes(role);
  },

  requireAuth() {
    if (!this.currentUser) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

const DB = {
  async getTeam() {
    const rows = await SB.get('team', 'select=*&limit=1');
    return rows[0] || null;
  },
  async updateTeam(data) {
    const team = await this.getTeam();
    if (team) { const r = await SB.patch('team', team.id, data); return r[0]; }
    const r = await SB.post('team', data); return r[0];
  },
  async getPlayers() { return SB.get('players', 'select=*&order=number.asc'); },
  async createPlayer(data) { const r = await SB.post('players', data); return r[0]; },
  async updatePlayer(id, data) { const r = await SB.patch('players', id, data); return r[0]; },
  async deletePlayer(id) { return SB.delete('players', id); },
  async getResults() { return SB.get('results', 'select=*&order=date.asc'); },
  async createResult(data) { const r = await SB.post('results', data); return r[0]; },
  async updateResult(id, data) { const r = await SB.patch('results', id, data); return r[0]; },
  async deleteResult(id) { return SB.delete('results', id); },
  async getUpcoming() { return SB.get('upcoming', 'select=*&order=date.asc'); },
  async createUpcoming(data) { const r = await SB.post('upcoming', data); return r[0]; },
  async updateUpcoming(id, data) { const r = await SB.patch('upcoming', id, data); return r[0]; },
  async deleteUpcoming(id) { return SB.delete('upcoming', id); },
  async getHistory() { return SB.get('history', 'select=*&order=year.asc'); },
  async createHistoryEntry(data) { const r = await SB.post('history', data); return r[0]; },
  async updateHistoryEntry(id, data) { const r = await SB.patch('history', id, data); return r[0]; },
  async deleteHistoryEntry(id) { return SB.delete('history', id); },
  async getSeasons() { return SB.get('seasons', 'select=*&order=year.desc'); },
  async createSeason(data) { const r = await SB.post('seasons', data); return r[0]; },
  async deleteSeason(id) { return SB.delete('seasons', id); },
  async getProfiles() { return SB.get('profiles', 'select=*&order=id.asc'); },
  async updateProfile(id, data) { const r = await SB.patch('profiles', id, data); return r[0]; },
  async deleteProfile(id) { return SB.delete('profiles', id); },
  async getStats() {
    const results = await this.getResults();
    let w=0, d=0, l=0, gf=0, ga=0;
    results.forEach(r => {
      const home = r.home === 'Il Club';
      const myG  = home ? r.gh : r.ga;
      const oppG = home ? r.ga : r.gh;
      if (myG > oppG) w++; else if (myG === oppG) d++; else l++;
      gf += home ? r.gh : r.ga;
      ga += home ? r.ga : r.gh;
    });
    return { w, d, l, gf, ga, played: results.length, pts: w*3+d, gd: gf-ga };
  }
};

const UI = {
  toast(msg, type = 'info') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
    t.className = `toast ${type} show`;
    const icons = { success:'✓', error:'✗', info:'ℹ' };
    t.innerHTML = `<span>${icons[type]||'ℹ'}</span><span>${msg}</span>`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  },
  confirm(msg, cb) { if (window.confirm(msg)) cb(); },
  loading(id, message='Caricamento...') {
    const el=document.getElementById(id);
    if(el) el.innerHTML=`<div style="padding:2rem;text-align:center;color:var(--muted);font-size:.85rem">${message}</div>`;
  },
  error(id, message='Errore nel caricamento.') {
    const el=document.getElementById(id);
    if(el) el.innerHTML=`<div style="padding:2rem;text-align:center;color:var(--red);font-size:.85rem">⚠ ${message}</div>`;
  },
  initSidebar() {
    const u = AUTH.currentUser;
    const avatar = document.getElementById('user-avatar');
    const uname  = document.getElementById('user-name');
    const urole  = document.getElementById('user-role');
    if (u) {
      if (avatar) avatar.textContent = u.name.charAt(0).toUpperCase();
      if (uname)  uname.textContent  = u.name;
      if (urole) { urole.textContent = u.role.charAt(0).toUpperCase()+u.role.slice(1); urole.className=`user-role role-${u.role}`; }
    } else {
      if (avatar) avatar.textContent = '?';
      if (uname)  uname.textContent  = 'Ospite';
      if (urole) { urole.textContent = ''; urole.className='user-role'; }
    }
    const adminLink = document.getElementById('admin-link');
    if (adminLink) adminLink.style.display = AUTH.can('admin') ? 'flex' : 'none';
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      if (a.getAttribute('href') === current) a.classList.add('active');
    });
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  await AUTH.init();
});

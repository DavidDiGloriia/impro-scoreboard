// Page de vote des étoiles.
// L'URL (générée par l'écran « Votez » de l'app) porte tout le nécessaire :
//   ?m=<id du match>&a=<code équipe A>&b=<code équipe B>&pa=<joueurs A>&pb=<joueurs B>
//   joueurs : liste "code:numéro:rôle" séparée par des virgules, code = prénom + nom comme dans joueurs.json.
// Les votes sont écrits dans Firestore : matches/<id>/ballots/<auto>.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getFirestore, collection, addDoc, doc, setDoc, serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';

const POINTS_LABELS = ['1re', '2e', '3e'];
const ROLE_LABELS = {capitaine: 'Capitaine', assistant: 'Assistant·e', coach: 'Coach'};

const params = new URLSearchParams(location.search);
const matchId = (params.get('m') || '').replace(/[^\w-]/g, '');
const teamCodes = {a: params.get('a') || '', b: params.get('b') || ''};

const $ = (sel) => document.querySelector(sel);
const teamsEl = $('#teams');
const submitEl = $('#submit');
const statusEl = $('#status');

/** Sélection ordonnée : [{code, team}] (3 max). */
let picks = [];
let players = {a: [], b: []};
let meta = {players: [], teams: {}, photos: {}};

async function loadData() {
  const [joueurs, equipes, photos] = await Promise.all([
    fetch('data/joueurs.json').then(r => r.json()),
    fetch('data/equipes.json').then(r => r.json()),
    fetch('data/photos.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
  ]);
  meta = {players: joueurs, teams: equipes, photos};
}

function parsePlayers(raw) {
  return (raw || '').split(',').filter(Boolean).map(entry => {
    const [code, number, role] = entry.split(':');
    return {code: decodeURIComponent(code), number: number || '', role: role || ''};
  });
}

function playerMeta(code) {
  return meta.players.find(p => (p.prenom || '') + (p.nom || '') === code);
}

function displayName(code) {
  const p = playerMeta(code);
  return p ? (p.alias || p.prenom || code) : code;
}

function initials(code) {
  const p = playerMeta(code);
  const name = p ? `${p.prenom || ''} ${p.nom || ''}`.trim() : code;
  return name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
}

function photoSrc(code, teamCode) {
  const p = playerMeta(code);
  if (!p?.img) return null;
  const stem = p.img.substring(p.img.lastIndexOf('/') + 1);
  return meta.photos[`${stem}-${teamCode}`] || meta.photos[stem] || null;
}

function teamName(side) {
  const t = meta.teams[teamCodes[side]];
  return t?.nom || teamCodes[side] || (side === 'a' ? 'Équipe A' : 'Équipe B');
}

function teamColor(side) {
  return meta.teams[teamCodes[side]]?.couleur || (side === 'a' ? 'var(--team-a)' : 'var(--team-b)');
}

function render() {
  teamsEl.innerHTML = '';
  for (const side of ['a', 'b']) {
    if (!players[side].length) continue;
    const section = document.createElement('section');
    section.className = 'team';
    section.style.setProperty('--team-color', teamColor(side));
    const h = document.createElement('h2');
    h.className = 'team-name';
    h.textContent = teamName(side);
    section.appendChild(h);
    const grid = document.createElement('div');
    grid.className = 'players';
    for (const pl of players[side]) {
      grid.appendChild(renderPlayer(pl, side));
    }
    section.appendChild(grid);
    teamsEl.appendChild(section);
  }
  updateSelection();
}

function renderPlayer(pl, side) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'player';
  btn.dataset.code = pl.code;
  btn.dataset.team = side;
  const src = photoSrc(pl.code, teamCodes[side]);
  if (src) {
    const img = document.createElement('img');
    img.className = 'player-photo';
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = () => { img.replaceWith(initialsEl(pl.code)); };
    btn.appendChild(img);
  } else {
    btn.appendChild(initialsEl(pl.code));
  }
  if (pl.number) {
    const n = document.createElement('span');
    n.className = 'player-number';
    n.textContent = `#${pl.number}`;
    btn.appendChild(n);
  }
  const rank = document.createElement('span');
  rank.className = 'player-rank';
  btn.appendChild(rank);
  const caption = document.createElement('span');
  caption.className = 'player-caption';
  if (ROLE_LABELS[pl.role]) {
    const role = document.createElement('span');
    role.className = 'player-role';
    role.textContent = ROLE_LABELS[pl.role];
    caption.appendChild(role);
  }
  const name = document.createElement('span');
  name.className = 'player-name';
  name.textContent = displayName(pl.code);
  caption.appendChild(name);
  btn.appendChild(caption);
  btn.addEventListener('click', () => toggle(pl.code, side));
  return btn;
}

function initialsEl(code) {
  const el = document.createElement('span');
  el.className = 'player-initials';
  el.textContent = initials(code);
  return el;
}

function toggle(code, team) {
  const index = picks.findIndex(p => p.code === code && p.team === team);
  if (index >= 0) {
    picks.splice(index, 1);
  } else if (picks.length < 3) {
    picks.push({code, team});
  } else {
    // 3 choix déjà faits : on remplace le dernier
    picks[2] = {code, team};
  }
  updateSelection();
}

function updateSelection() {
  document.querySelectorAll('.player').forEach(btn => {
    const index = picks.findIndex(p => p.code === btn.dataset.code && p.team === btn.dataset.team);
    btn.classList.toggle('selected', index >= 0);
    btn.classList.toggle('dimmed', picks.length === 3 && index < 0);
    btn.querySelector('.player-rank').textContent = index >= 0 ? String(index + 1) : '';
  });
  document.querySelectorAll('.pick').forEach((el, i) => {
    const pick = picks[i];
    el.classList.toggle('filled', !!pick);
    el.querySelector('.pick-name').textContent = pick ? displayName(pick.code) : '—';
  });
  submitEl.disabled = picks.length !== 3;
  if (picks.length < 3) {
    statusEl.textContent = `Encore ${3 - picks.length} choix`;
    statusEl.classList.remove('error');
  } else {
    statusEl.textContent = '';
  }
}

function lockKey() {
  return `vote-etoiles:${matchId}`;
}

function showDone(saved) {
  const tpl = document.getElementById('done-template');
  const done = tpl.content.cloneNode(true);
  const list = done.querySelector('.done-list');
  saved.forEach((pick, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="rank">${POINTS_LABELS[i]}</span><span>${displayName(pick.code)}</span><span class="team">${teamName(pick.team)}</span>`;
    list.appendChild(li);
  });
  const app = $('#app');
  app.innerHTML = '';
  app.appendChild(done);
}

async function submit() {
  if (picks.length !== 3) return;
  submitEl.disabled = true;
  statusEl.textContent = 'Envoi…';
  statusEl.classList.remove('error');
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [first, second, third] = picks.map(p => `${p.team}:${p.code}`);
    await addDoc(collection(db, 'matches', matchId, 'ballots'), {
      first, second, third,
      createdAt: serverTimestamp(),
    });
    // Fiche du match (composition) pour la page de résultats ; fusionnée, donc sans écraser les autres votants.
    await setDoc(doc(db, 'matches', matchId), {
      teamA: teamCodes.a, teamB: teamCodes.b,
      playersA: players.a.map(p => p.code), playersB: players.b.map(p => p.code),
      updatedAt: serverTimestamp(),
    }, {merge: true}).catch(() => { /* facultatif */ });
    try { localStorage.setItem(lockKey(), JSON.stringify(picks)); } catch { /* navigation privée */ }
    showDone(picks);
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Envoi impossible. Vérifiez votre connexion et réessayez.';
    statusEl.classList.add('error');
    submitEl.disabled = false;
  }
}

async function main() {
  if (!matchId || !params.get('pa') && !params.get('pb')) {
    $('#app').innerHTML = '<p class="empty">Ce lien de vote est incomplet.<br>Scannez le QR code affiché à l\'écran.</p>';
    return;
  }
  if (!firebaseConfig?.projectId || firebaseConfig.projectId.startsWith('VOTRE')) {
    console.warn('firebase-config.js n\'est pas renseigné : les votes ne pourront pas être envoyés.');
  }
  await loadData();
  players = {a: parsePlayers(params.get('pa')), b: parsePlayers(params.get('pb'))};
  let already = null;
  try { already = JSON.parse(localStorage.getItem(lockKey()) || 'null'); } catch { /* ignore */ }
  if (already?.length === 3) {
    showDone(already);
    return;
  }
  $('#subtitle').textContent = `${teamName('a')} vs ${teamName('b')} · choisissez vos trois étoiles, dans l'ordre.`;
  render();
  submitEl.addEventListener('click', submit);
}

main().catch(e => {
  console.error(e);
  $('#app').innerHTML = '<p class="empty">Impossible de charger la page de vote.</p>';
});

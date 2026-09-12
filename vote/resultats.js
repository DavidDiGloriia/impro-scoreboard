// Résultats des votes : connexion Google (adresses autorisées dans firestore.rules), puis dépouillement par match.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getFirestore, collection, getDocs, query, orderBy, limit} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {firebaseConfig} from './firebase-config.js';

const POINTS = [3, 2, 1];
const TOP = 8;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const $ = (sel) => document.querySelector(sel);
const signinEl = $('#signin'), signoutEl = $('#signout'), matchEl = $('#match'), refreshEl = $('#refresh'), countEl = $('#count'), statusEl = $('#status'), tableEl = $('#table');
const copyNewsletterEl = $('#copy-newsletter'), drawEl = $('#draw'), drawResultEl = $('#draw-result');

/** Adresses laissées pour le tirage au sort, dédoublonnées, pour le match affiché. */
let emails = [];
/** Parmi elles, celles qui ont coché l'inscription à la newsletter. */
let newsletterEmails = [];

let meta = {players: [], teams: {}};
let matches = [];

async function loadData() {
  const [joueurs, equipes] = await Promise.all([
    fetch('data/joueurs.json').then(r => r.json()),
    fetch('data/equipes.json').then(r => r.json()),
  ]);
  meta = {players: joueurs, teams: equipes};
}

function displayName(code) {
  const p = meta.players.find(p => (p.prenom || '') + (p.nom || '') === code);
  return p ? `${p.alias || p.prenom || ''}${p.nom ? ' ' + p.nom : ''}`.trim() || code : code;
}

async function loadMatches() {
  const snap = await getDocs(query(collection(db, 'matches'), orderBy('updatedAt', 'desc'), limit(30)));
  matches = snap.docs.map(d => ({id: d.id, ...d.data()}));
  matchEl.innerHTML = matches.map(m => `<option value="${m.id}">${m.id}</option>`).join('');
  matchEl.hidden = refreshEl.hidden = !matches.length;
  if (!matches.length) statusEl.textContent = 'Aucun vote enregistré pour le moment.';
  else await tally();
}

async function tally() {
  const match = matches.find(m => m.id === matchEl.value);
  if (!match) return;
  statusEl.textContent = 'Dépouillement…';
  const snap = await getDocs(collection(db, 'matches', match.id, 'ballots'));
  const scores = new Map();
  for (const d of snap.docs) {
    const b = d.data();
    [b.first, b.second, b.third].forEach((key, i) => {
      if (!key) return;
      const s = scores.get(key) || {key, points: 0, stars: [0, 0, 0]};
      s.points += POINTS[i];
      s.stars[i] += 1;
      scores.set(key, s);
    });
  }
  const rows = [...scores.values()]
    .sort((x, y) => y.points - x.points || y.stars[0] - x.stars[0] || y.stars[1] - x.stars[1] || y.stars[2] - x.stars[2])
    .slice(0, TOP);
  emails = [...new Set(snap.docs.map(d => d.data().email).filter(Boolean))];
  newsletterEmails = [...new Set(snap.docs.map(d => d.data()).filter(b => b.newsletter === true && b.email).map(b => b.email))];
  countEl.textContent = `${snap.size} bulletin${snap.size > 1 ? 's' : ''} · ${emails.length} adresse${emails.length > 1 ? 's' : ''} pour le tirage`
    + ` · ${newsletterEmails.length} newsletter`;
  drawEl.hidden = !emails.length;
  copyNewsletterEl.hidden = !newsletterEmails.length;
  drawResultEl.textContent = '';
  statusEl.textContent = '';
  tableEl.innerHTML = `
    <table>
      <thead><tr><th>#</th><th>Joueur</th><th>Équipe</th><th class="num">Points</th><th class="num">1<sup>res</sup></th><th class="num">2<sup>es</sup></th><th class="num">3<sup>es</sup></th></tr></thead>
      <tbody>${rows.map((r, i) => {
        const [side, code] = [r.key.slice(0, 1), r.key.slice(2)];
        const teamCode = side === 'a' ? match.teamA : match.teamB;
        const team = meta.teams[teamCode];
        return `<tr class="${i < 3 ? 'top' : ''}">
          <td class="rank">${i + 1}</td>
          <td>${displayName(code)}</td>
          <td><span class="team-tag" style="background:${team?.couleur || '#888'}"></span>${team?.nom || teamCode || ''}</td>
          <td class="num">${r.points}</td><td class="num">${r.stars[0]}</td><td class="num">${r.stars[1]}</td><td class="num">${r.stars[2]}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
}

signinEl.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    statusEl.textContent = `Connexion refusée : ${e.message}`;
    statusEl.classList.add('error');
  }
});
signoutEl.addEventListener('click', async () => {
  await signOut(auth);
  // Retour à l'état initial : plus de match, plus de tableau, plus d'adresses en mémoire.
  matches = []; emails = []; newsletterEmails = [];
  matchEl.innerHTML = ''; tableEl.innerHTML = ''; countEl.textContent = ''; drawResultEl.textContent = '';
  matchEl.hidden = refreshEl.hidden = copyNewsletterEl.hidden = drawEl.hidden = true;
  statusEl.textContent = 'Déconnecté.';
  statusEl.classList.remove('error');
});
matchEl.addEventListener('change', tally);
copyNewsletterEl.addEventListener('click', async () => {
  await navigator.clipboard.writeText(newsletterEmails.join('\n'));
  statusEl.textContent = `${newsletterEmails.length} adresse${newsletterEmails.length > 1 ? 's' : ''} newsletter copiée${newsletterEmails.length > 1 ? 's' : ''}.`;
});
// Tirage au sort parmi toutes les adresses laissées (newsletter cochée ou non), une chance par adresse.
drawEl.addEventListener('click', () => {
  const winner = emails[Math.floor(Math.random() * emails.length)];
  drawResultEl.textContent = winner ? `Gagnant : ${winner}` : '';
});
refreshEl.addEventListener('click', () => loadMatches().catch(showError));

function showError(e) {
  console.error(e);
  statusEl.textContent = e.code === 'permission-denied'
    ? 'Accès refusé : cette adresse Google n\'est pas dans la liste des organisateurs (firestore.rules).'
    : `Erreur : ${e.message}`;
  statusEl.classList.add('error');
}

onAuthStateChanged(auth, async (user) => {
  signinEl.hidden = !!user;
  signoutEl.hidden = !user;
  if (!user) return;
  statusEl.textContent = `Connecté : ${user.email}`;
  statusEl.classList.remove('error');
  try {
    await loadData();
    await loadMatches();
  } catch (e) {
    showError(e);
  }
});

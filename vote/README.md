# Vote des étoiles

Page de vote sur téléphone, ouverte par le QR code de l'écran « Votez » du video-switcher.
Le QR code contient l'identifiant du match et la composition des deux équipes : l'app de projection
reste hors ligne, seule la page de vote a besoin d'internet.

## Contenu

- `index.html`, `vote.js`, `vote.css` : la page de vote (trois étoiles classées, 3-2-1 points).
- `resultats.html`, `resultats.js` : dépouillement, réservé à l'organisation (connexion Google).
- `firebase-config.js` : configuration du projet Firebase, à renseigner (voir plus bas).
- `firestore.rules` : règles de sécurité Firestore, à coller dans la console Firebase.
- `data/` et `photos/` : générés par `npm run vote:build` (copie de `joueurs.json`, `equipes.json` et vignettes 320 px). Non versionnés.

## Mise en place (une fois)

1. **Firebase** : créer un projet sur https://console.firebase.google.com, activer **Firestore** (mode production)
   et **Authentication > Google**. Dans *Paramètres du projet > Vos applications*, ajouter une application Web et
   recopier sa configuration dans `firebase-config.js`.
2. **Règles** : dans *Firestore > Règles*, coller le contenu de `firestore.rules` et adapter la liste des adresses
   Google autorisées à lire les résultats (`isOrganizer`).
3. **Domaines autorisés** : dans *Authentication > Paramètres > Domaines autorisés*, ajouter `daviddigloriia.github.io`.
4. **GitHub Pages** : le workflow `.github/workflows/vote-pages.yml` déploie le dossier à chaque push sur `main`
   qui touche la page, les données ou les photos. Il active Pages tout seul au premier passage ; sinon,
   *Settings > Pages > Source : GitHub Actions*.

L'adresse de la page est `https://daviddigloriia.github.io/impro-scoreboard/` (constante `VOTE_BASE_URL`
dans `src/app/constants/vote.constants.ts`).

## Le soir du match

1. Composition des équipes saisie dans le video-switcher.
2. Bouton **VOTE ÉTOILES** : l'écran affiche le QR code. Le laisser le temps du vote, par exemple pendant la
   dernière pause.
3. Résultats : bouton **Voir les résultats** du panneau, ou `resultats.html`, connexion Google, choisir le match.

Un téléphone ne peut voter qu'une fois par match (verrou dans le navigateur, contournable en navigation privée :
on reste sur un vote de spectacle, pas une élection).

## Tester en local

```
npm run vote:serve
```

puis ouvrir l'adresse affichée avec les paramètres d'un match, par exemple
`http://localhost:4300/?m=test&a=lions&b=aigles&pa=S%C3%A9bastienLothe:42:capitaine,Cl%C3%A9menceX:6&pb=DavidDi%20Gloria:5`.
Sans `firebase-config.js` renseigné, la page s'affiche mais l'envoi échoue.

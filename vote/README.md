# Vote des étoiles

Page de vote sur téléphone, ouverte par le QR code de l'écran « Votez » du video-switcher.
Le QR code contient l'identifiant du match et la composition des deux équipes : l'app de projection
reste hors ligne, seule la page de vote a besoin d'internet.

## Contenu

- `index.html`, `vote.js`, `vote.css` : la page de vote (trois étoiles classées, 3-2-1 points).
- `resultats.html`, `resultats.js` : dépouillement, réservé à l'organisation (connexion Google).
- `firebase-config.js` : configuration du projet Firebase, à renseigner (voir plus bas).
- `firestore.rules` : règles de sécurité Firestore, à coller dans la console Firebase.
- `data/`, `photos/` et `layout/` : générés par `npm run vote:build` (copie de `joueurs.json`, `equipes.json`, vignettes 320 px
  et décors d'équipe `assets/layout`). Non versionnés.

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

Une seule voix par téléphone et par match : une empreinte d'appareil (identifiant aléatoire gardé dans le
navigateur) sert d'identifiant au bulletin, et les règles refusent un second bulletin pour la même empreinte.
Contournable en vidant le stockage du navigateur : c'est un frein aux doublons, pas une élection. Un filtrage par
adresse IP demanderait un serveur, donc la formule payante Firebase.

Le votant peut laisser son adresse e-mail (facultatif) pour « tenter de gagner 2 places pour un prochain match »,
et cocher une case pour s'inscrire aussi à la newsletter (champ `newsletter: true` dans le bulletin, uniquement avec
une adresse). La page de résultats compte les adresses, copie celles du tirage ou celles de la newsletter dans le
presse-papiers, et tire un gagnant au sort.

Après modification de `firestore.rules`, recoller le fichier dans la console Firebase (*Firestore > Règles*),
sinon les bulletins avec `newsletter` sont refusés.

## Tester en local

```
npm run vote:apercu
```

ouvre `http://localhost:4300/apercu` : la page de vote dans un cadre au format téléphone, avec un match d'exemple
(équipes et nombre de joueurs au choix) et un QR code pour l'ouvrir sur un vrai téléphone connecté au même Wi-Fi.
Les fichiers de `vote/` sont servis tels quels, sans cache : modifier, recharger. Un envoi écrit un vrai bulletin
dans un match d'essai dont l'identifiant finit par `-apercu`.

Pour servir le dossier tel quel, sans la page d'aperçu :

```
npm run vote:serve
```

puis ouvrir l'adresse affichée avec les paramètres d'un match, par exemple
`http://localhost:4300/?m=test&a=lions&b=aigles&pa=S%C3%A9bastienLothe:42:capitaine,Cl%C3%A9menceX:6&pb=DavidDi%20Gloria:5`.
Sans `firebase-config.js` renseigné, la page s'affiche mais l'envoi échoue.

Pour revoter depuis le même navigateur pendant les tests, ajouter `&reset=1` à l'adresse : le vote précédent et
l'empreinte d'appareil sont oubliés, un nouveau bulletin est donc accepté.

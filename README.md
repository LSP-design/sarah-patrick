# Sarah & Patrick Wedding Website

Site statique de mariage, basé sur les deux prompts fournis et le modèle
Geometric Watercolor du site https://withjoy.com/bruner/.

## Utilisation locale

```sh
python3 -m http.server 4173
```

Ouvrir http://localhost:4173. Aucun build ni dépendance applicative n'est nécessaire.

## Contenu et comportement

- Deux colonnes 60/40 sur desktop ; disposition verticale à 900 px et moins.
- Polices Lobster, Playfair Display et Inter chargées depuis Google Fonts.
- Décorations SVG bleu et or, barre translucide, animations au défilement et hover.
- Navigation Accueil, Horaire & Lieu et Get the app, avec liens Joy fonctionnels.
- Fenêtre d'invitation accessible au clavier ; fermeture par Échap ou clic extérieur.
- Compteur depuis le 18 mai 2024 à minuit, heure de Toronto, mis à jour chaque seconde.
- Respect de la préférence système pour réduire les animations.

Le nom Sarah & Patrick et le dépôt actuel font référence. Les consignes de finition
du prompt Bruner & Famille sont appliquées à ce site.

## Éléments à personnaliser

`assets/couple.jpg` est le gradient provisoire demandé. Le remplacer par la vraie
photo du couple. La date du 18 mai 2024 et le handle `sarah-patrick` sont conservés
tels que fournis dans les prompts.

Le formulaire présente l'interface d'invitation ; il ne recherche pas une liste
d'invités et n'enregistre pas de réponses. Aucun compte Joy ou backend d'invitations
n'a été fourni. Un message invite les visiteurs à contacter Sarah et Patrick.

## Vérifications

Comparer visuellement au modèle avec les noms et la photo provisoire adaptés.
Tester les largeurs 1440, 1024, 901, 900, 768, 600, 390, 320 et 844 px :
absence de débordement, visibilité des deux panneaux, menu, navigation, défilement,
compteur, validation du nom et gestion du focus de la fenêtre d'invitation.

## Déploiement Vercel

Importer https://github.com/LSP-design/sarah-patrick dans https://vercel.com/new.
Choisir le preset **Other**, laisser la commande de build vide et définir le dossier
de sortie à `.`. `vercel.json` configure les fichiers statiques et le fallback HTML.

Ou, depuis un compte authentifié :

```sh
npx vercel login
npx vercel --prod
```

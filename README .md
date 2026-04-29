# 🔗 LinkMe — Gestionnaire de liens sociaux

> Une application web fullstack permettant à chaque utilisateur de centraliser et partager tous ses liens de réseaux sociaux via une page de profil publique personnalisée.

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Base de données](#base-de-données)
- [API REST](#api-rest)
- [Installation](#installation)
- [Lancement avec Docker](#lancement-avec-docker)
- [Variables d'environnement](#variables-denvironnement)
- [Auteur](#auteur)

---

## Aperçu

**LinkMe** est une application de type *Linktree* : chaque utilisateur inscrit obtient une page publique (`/MyLinks/:user_name`) qui liste tous ses liens sociaux (Instagram, Twitter, LinkedIn, GitHub, etc.) sous forme de carte visuelle avec photo de profil.

Une interface de gestion privée permet d'ajouter, modifier et supprimer ses liens en temps réel grâce à un système de **Server-Sent Events (SSE)**.

---

## Fonctionnalités

- **Inscription / Connexion** sécurisées avec hachage `bcrypt` et sessions persistantes via `passport.js`
- **Page de profil publique** accessible sans authentification à l'adresse `/MyLinks/:user_name`
- **Tableau de bord privé** pour gérer ses liens (ajout, modification, suppression)
- **Upload de photo de profil** (stockage binaire en base de données)
- **Mise à jour en temps réel** via Server-Sent Events (SSE) — les modifications sont poussées à tous les clients connectés sans rechargement de page
- **Modification du profil** (nom, prénom, email) depuis le dashboard
- **Changement de mot de passe** sécurisé (vérification de l'ancien mot de passe requis)
- Interface **dark/light mode** (bouton de bascule)
- **Partage de profil** rapide via bouton dédié
- Déploiement **Docker** clé en main (app + base SQL Server)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Runtime | Node.js 20 |
| Framework serveur | Express 5 |
| Templating | Handlebars (`express-handlebars`) |
| ORM | Prisma 7 |
| Base de données | Microsoft SQL Server 2022 |
| Authentification | Passport.js (stratégie locale) |
| Sessions | `express-session` + `memorystore` |
| Sécurité | `helmet`, `bcrypt`, `cors` |
| Temps réel | Server-Sent Events (SSE) |
| Conteneurisation | Docker + Docker Compose |
| Styles | CSS vanilla (par page) |
| Icônes | Font Awesome |

---

## Architecture du projet

```
projet_socials/
├── server.js                    # Point d'entrée — configuration Express, routes principales
├── package.json
├── prisma/
│   └── schema.prisma            # Schéma de base de données (User, Link, Image, Icon)
├── prisma.config.ts
├── src/
│   ├── prisma.js                # Instance Prisma partagée
│   ├── controllers/
│   │   └── globalController.js  # Logique métier de toutes les routes API
│   ├── middlewares/
│   │   ├── auth.js              # Middlewares de protection des routes (connecté/déconnecté)
│   │   ├── sse.js               # Middleware Server-Sent Events (temps réel)
│   │   └── validation.js        # Validation des entrées (email, mot de passe, texte)
│   ├── models/
│   │   ├── global.js            # Fonctions d'accès à la BDD via Prisma
│   │   └── seed.js              # Script de population initiale
│   ├── routes/
│   │   └── global.js            # Définition de toutes les routes /api/*
│   ├── services/
│   │   └── auth.js              # Configuration Passport.js (stratégie locale + sérialisation)
│   └── validators/
│       └── validation.js        # Fonctions de validation pures (email, mdp, texte)
├── views/
│   ├── layouts/
│   │   └── main.handlebars      # Layout HTML de base
│   ├── accueil.handlebars       # Page de profil publique
│   ├── client.handlebars        # Dashboard utilisateur (privé)
│   ├── login.handlebars         # Page de connexion
│   └── register.handlebars      # Page d'inscription
├── public/
│   ├── scripts/                 # JavaScript côté client
│   │   ├── accueil.js           # Logique de la page publique
│   │   ├── client.js            # Logique du dashboard (SSE, gestion des liens)
│   │   ├── login.js             # Formulaire de connexion
│   │   ├── register.js          # Formulaire d'inscription
│   │   └── validation.js        # Validation côté client
│   └── style/                   # Feuilles CSS par page
│       ├── root.css
│       ├── index.css            # Styles de la page profil publique
│       ├── client.css           # Styles du dashboard
│       ├── login.css
│       └── register.css
├── Documentation/
│   └── guide_prisma.md          # Référence complète des requêtes Prisma
├── Dockerfile                   # Build multi-stage Node.js 20 Alpine
├── Docker-compose.yaml          # Orchestration app + SQL Server
└── init.sql                     # Initialisation de la base de données
```

---

## Base de données

Le schéma Prisma définit 4 modèles :

```
User
 ├── id_user     (PK, auto-incrémenté)
 ├── user_name   (unique)
 ├── name
 ├── prenom
 ├── email
 ├── password    (haché avec bcrypt)
 ├── created     (date d'inscription)
 ├── Link[]      (relation 1→N)
 └── Image?      (relation 1→1)

Link
 ├── id          (PK)
 ├── title       (nom affiché)
 ├── url         (lien cible)
 ├── icon        (classe Font Awesome)
 └── id_user     (FK → User)

Image
 ├── id          (PK)
 ├── name        (nom du fichier)
 ├── data        (Bytes — stockage binaire)
 ├── type        (MIME type)
 └── id_user     (FK → User, unique)

Icon
 ├── id          (PK)
 ├── title       (nom du réseau social)
 └── icon        (classe Font Awesome)
```

---

## API REST

Toutes les routes sont préfixées par `/api`.

### Authentification

| Méthode | Route | Auth requise | Description |
|---|---|---|---|
| `POST` | `/api/connexion` | Non | Connexion (Passport local) |
| `POST` | `/api/deconnexion` | Oui | Déconnexion |

### Utilisateurs

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/user` | Récupérer l'utilisateur connecté |
| `GET` | `/api/users` | Liste de tous les utilisateurs |
| `GET` | `/api/user/name?user_name=` | Rechercher par nom d'utilisateur |
| `GET` | `/api/user/id?id=` | Rechercher par ID |
| `GET` | `/api/user/user_names` | Liste de tous les user_name |
| `POST` | `/api/user/add` | Créer un compte |
| `PATCH` | `/api/user/update` | Modifier le profil (name, prenom, email…) |
| `PATCH` | `/api/user/update/password` | Changer le mot de passe |
| `DELETE` | `/api/user/delete` | Supprimer un compte |

### Liens

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/links` | Liste de tous les liens |
| `POST` | `/api/link/add` | Ajouter un lien |
| `PATCH` | `/api/link/update` | Modifier un lien (titre) |
| `DELETE` | `/api/link/delete` | Supprimer un lien |

### Images

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/image/add` | Uploader une photo de profil |
| `PATCH` | `/api/image/update` | Remplacer la photo de profil |

### Icônes & Temps réel

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/icons` | Liste des icônes disponibles |
| `GET` | `/api/stream` | Connexion SSE (push temps réel) |

---

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) >= 20
- [Microsoft SQL Server](https://www.microsoft.com/fr-fr/sql-server) (local ou Azure)
- npm

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/YvanJaures/projet_socials.git
cd projet_socials

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres (voir section Variables d'environnement)

# 4. Appliquer le schéma en base de données
npx prisma generate
npx prisma db push

# 5. (Optionnel) Peupler la base avec les données initiales
node ./src/models/seed.js

# 6. Lancer le serveur en développement
npm run dev

# ou en production
npm start
```

L'application sera disponible sur `http://localhost:<PORT>`.

---

## Lancement avec Docker

Le projet inclut un `Docker-compose.yaml` qui orchestre deux services :
- **`app`** — l'application Node.js (port `5001`)
- **`mssql`** — Microsoft SQL Server 2022 Express (port `1433`)

```bash
# Construire et démarrer les conteneurs
docker compose up --build

# Démarrer en arrière-plan
docker compose up -d --build
```

> **Note :** L'application attend automatiquement 50 secondes que SQL Server soit prêt, puis génère le client Prisma, applique le schéma et démarre le serveur.

L'application sera accessible sur `http://localhost:5001`.

Pour arrêter :

```bash
docker compose down
```

Pour supprimer également les données persistantes :

```bash
docker compose down -v
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Environnement
NODE_ENV=development

# Port du serveur
PORT=5001

# Secret de session (chaîne aléatoire longue)
SESSION_SECRET=votre_secret_ici

# URL de connexion Prisma / SQL Server
DATABASE_URL="sqlserver://<HOST>:<PORT>;database=<DB_NAME>;user=<USER>;password=<PASSWORD>;encrypt=true;trustServerCertificate=true"
```

---
PORT=********
SESSION_SECRET=********
DATABASE_URL=**********
DB_SERVER=******
DB_DATABASE=*******
DB_USER=*******
DB_PASSWORD=*********
DB_NAME=******
DB_PORT=******
PRISMA_CLIENT_ENGINE_TYPE=*****
RENDER_URL=**********

## Auteur

**Yvan** — [GitHub @YvanJaures](https://github.com/YvanJaures)

---

*Généré à partir du code source du projet — [projet_socials](https://github.com/YvanJaures/projet_socials)*

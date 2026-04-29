/**
 * Projet Socials - Serveur principal
 * Application de gestion de liens sociaux avec Express.js
 * 
 * @module server
 * @description Point d'entrée de l'application serveur
 */

// Importation des modules de configuration
import 'dotenv/config' // Charge les variables d'environnement depuis .env
import express, { json } from 'express' // Framework web
import helmet from 'helmet' // Protection des headers HTTP
import cors from 'cors' // Cross-Origin Resource Sharing
import compression from 'compression' // Compression des réponses HTTP

// Importation des modules personnalisés
import './src/keepAlive.js' // Script de keep-alive pour éviter l'expiration du service
import {engine} from 'express-handlebars' // Moteur de templates
import Handlebars from 'handlebars'
import sse from './src/middlewares/sse.js' // Server-Sent Events pour les mises à jour en temps réel
import passport from 'passport' // Authentification
import session from 'express-session' // Gestion des sessions
import memorystore from 'memorystore' // Stockage en mémoire des sessions
import path from 'path';
import { fileURLToPath } from 'url';

// Importation des routes et contrôleurs
import router from './src/routes/global.js'
import { getIcons, getUserByName, getUsers } from './src/models/global.js'
import { connecterPage, deConnecterPage } from './src/middlewares/auth.js'

// ============================================
// CONFIGURATION DU SERVEUR
// ============================================

// Définition du mode de développement ou production
// Si NODE_ENV n'est pas défini, on considère qu'on est en développement
const dev = process.env.NODE_ENV !== "production";

// Port du serveur (défaut: 5001)
const PORT = process.env.PORT ;

// ============================================
// INITIALISATION D'EXPRESS
// ============================================

const app=express()

// Création du store de sessions avec memorystore
// Ce store garde les sessions en mémoire (adapté pour une instance unique)
const MemoryStore=memorystore(session)

/*
// Configuration de Helmet pour la sécurité des Content Security Policy
// Désactivé temporairement pour permettre Font Awesome
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://kit.fontawesome.com/2dd86e731d.js"],
    },
  })
);
*/

// ============================================
// MIDDLEWARES GLOBAUX
// ============================================

// CORS - Permet les requêtes cross-origin
app.use(cors())

// Compression - Compresse les réponses HTTP pour optimiser la bande passante
app.use(compression())

// JSON Parser - Permet de lire les corps de requêtes en format JSON
app.use(express.json())

// Configuration des sessions
app.use(session({
    // Nom du cookie de session
    name:process.env.npm_package_name,
    // Durée de vie du cookie (1 heure en millisecondes)
    cookie:{maxAge:3600000},
    // Store de sessions en mémoire avec nettoyage automatique toutes les heures
    store:new MemoryStore({checkPeriod:3600000}),
    // Renouvelle le cookie à chaque requête
    rolling:true,
    // Ne pas sauvegarder les sessions non modifiées
    resave:false,
    // Ne pas créer de session pour les utilisateurs non connectés
    saveUninitialized:false,
    // Secret pour signer les cookies de session (来自 .env)
    secret:process.env.SESSION_SECRET
}))

// ============================================
// CONFIGURATION DU MOTEUR DE TEMPLATES (HANDLEBARS)
// ============================================

// Initialisation de Handlebars comme moteur de vues
app.engine('handlebars', engine())
// Définition du format des fichiers de vues
app.set('view engine', 'handlebars')

// ============================================
// MIDDLEWARES SUPPLÉMENTAIRES
// ============================================

// Permet de traiter les données binaires (images) jusqu'à 50MB
app.use(express.raw({
  type: "application/octet-stream",
  limit: "50mb"
}))

// Passport - Initialisation de l'authentification
app.use(passport.initialize())
app.use(passport.session())

// SSE - Middleware pour les Server-Sent Events (mises à jour temps réel)
app.use(sse())

// ============================================
// CONFIGURATION DES CHEMINS
// ============================================

// Récupération du chemin du fichier courant (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définition du dossier des vues (templates Handlebars)
app.set('views', path.join(__dirname, 'views'));

// Configuration du dossier public (fichiers statiques)
// En production: utilise le dossier public à la racine
// En développement: utilise le dossier public local
const publicPath = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'public') 
    : path.join(__dirname, 'public');

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(publicPath));

/*
// Ancien code - Génération automatique des routes pour chaque utilisateur
// Conservé pour référence future
let users=await getUsers()
for(const user of users){
    let imageUrl = null
    if (user.Image) {
      const buffer = user.Image.data instanceof Buffer
        ? user.Image.data
        : Buffer.from(user.Image.data)

      imageUrl = `data:${user.Image.type};base64,${buffer.toString('base64')}`
    }
    app.get(`/${user.user_name}`,async(request,response)=>{
        response.status(200).render('accueil',{
            titre: `${user.name.toUpperCase()}`,
            styles:['/style/index.css'],
            scripts:['/scripts/accueil.js'],
            imgUrl:imageUrl,
            links:user.Link,
            user:user
        })
    })
}
*/

// ============================================
// ROUTES PUBLIQUES
// ============================================

/**
 * Route publique pour afficher le profil d'un utilisateur
 * Format: /MyLinks/:user_name
 * Affiche les liens sociaux publics d'un utilisateur
 */
app.get(`/MyLinks/:user_name`,async(request,response)=>{
    // Redirection si tentative d'accès aux pages réservées
    if(request.params.user_name==="login" || request.params.user_name==="signup") return
    
    // Récupération de l'utilisateur par son nom
    const user=await getUserByName(request.params.user_name)
    if(!user) return response.status(404).send('User not found')
    
    // Conversion de l'image de profil en base64 pour l'affichage
    let imageUrl = null
    if (user?.Image) {
      const buffer = user.Image.data instanceof Buffer
        ? user.Image.data
        : Buffer.from(user.Image.data)

      imageUrl = `data:${user.Image.type};base64,${buffer.toString('base64')}`
    }
    
    // Rendu de la page d'accueil publique
    response.status(200).render('accueil',{
        titre: `${user.name.toUpperCase()}`,
        styles:['/style/index.css'],
        scripts:['/scripts/accueil.js'],
        imgUrl:imageUrl,
        links:user.Link,
        user:user
    })
})
/**/

// ============================================
// ROUTES PROTÉGÉES (authentification requise)
// ============================================

/**
 * Page d'accueil - Tableau de bord utilisateur
 * Route protégée - nécessite une session active
 */
app.get('/',connecterPage, async (request, response) => {
    // Récupération des icônes disponibles pour les réseaux sociaux
    const icons=await getIcons()
    const user=request.user
    
    // Conversion de l'image de profil en base64
    let imageUrl = null
    if (user.Image) {
      const buffer = user.Image.data instanceof Buffer
        ? user.Image.data
        : Buffer.from(user.Image.data)

      imageUrl = `data:${user.Image.type};base64,${buffer.toString('base64')}`
    }
    
    // Rendu du tableau de bord client
    response.status(200).render('client', {
        titre: 'Socials',
        styles: ['/style/client.css','/style/index.css'],
        scripts: ['/scripts/client.js'],
        imgUrl:imageUrl,
        links:request.user.Link,
        user:request.user,
        icons:icons
    });
});

/**
 * Page de connexion
 * Route accessible uniquement aux utilisateurs non connectés
 */
app.get('/login',deConnecterPage, async (request, response) => {
    response.status(200).render('login', {
        titre: 'Log in',
        styles: ['/style/login.css'],
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js','/scripts/login.js']
    });
});

/**
 * Page d'inscription
 * Route accessible uniquement aux utilisateurs non connectés
 */
app.get('/signup',deConnecterPage, async (request, response) => {
    response.status(200).render('register', {
        titre: 'Sign up',
        styles: ['/style/register.css'],
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js','/scripts/register.js']
    });
});

// ============================================
// ROUTES API
// ============================================

// Montage des routes API sous le préfixe /api
app.use('/api',router)

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

app.listen(PORT, () => {
  console.log(`Serveur unique: http://localhost:${PORT} (dev=${dev})`);
});
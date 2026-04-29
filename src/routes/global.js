/**
 * ============================================
 * GLOBAL ROUTES - Définition des routes API
 * ============================================
 * 
 * Ce fichier définit toutes les routes de l'API REST.
 * Les routes sont montées sous le préfixe /api dans server.js
 * 
 * @description Routes API pour l'application Socials
 * @requires express
 * @requires ../controllers/globalController.js
 * @requires ../middlewares/auth.js
 */

import express from 'express'
import * as globalController from '../controllers/globalController.js'
import {deConnecterApi,connecterApi} from '../middlewares/auth.js'

// Création du routeur Express
const router=express.Router()

// ============================================
// ROUTES GET (LECTURE)
// ============================================

// Stream SSE pour les mises à jour en temps réel
router.get('/stream',globalController.stream)

// Récupération de toutes les icônes disponibles
router.get('/icons',globalController.getIconsC)

// Récupération de tous les liens
router.get('/links',globalController.getLinksC)

// Récupération de tous les utilisateurs
router.get('/users',globalController.getUsersC)

// Récupération d'un utilisateur par ID
router.get('/user',globalController.getUser)

// Récupération d'un utilisateur par nom
router.get('/user/name',globalController.getUserByNameC)

// Récupération de tous les noms d'utilisateurs
router.get('/user/user_names',globalController.getUsersNameC)

// Récupération d'un utilisateur par ID
router.get('/user/id',globalController.getUserByIdC)

// ============================================
// ROUTES POST (CRÉATION)
// ============================================

// Création d'un nouvel utilisateur
router.post('/user/add',globalController.addUserC)

// Ajout d'un nouveau lien social
router.post('/link/add',globalController.addLinkC)

// Ajout d'une image de profil
router.post('/image/add',globalController.addImageC)

// ============================================
// ROUTES PATCH (MODIFICATION)
// ============================================

// Mise à jour des informations utilisateur
router.patch('/user/update',globalController.updateUserC)

// Mise à jour du mot de passe
router.patch('/user/update/password',globalController.updatePasswordC)

// Mise à jour d'un lien
router.patch('/link/update',globalController.updateLinkC)

// Mise à jour de l'image de profil
router.patch('/image/update',globalController.updateImageC)

// ============================================
// ROUTES DELETE (SUPPRESSION)
// ============================================

// Suppression d'un utilisateur
router.delete('/user/delete',globalController.deleteUserC)

// Suppression d'un lien
router.delete('/link/delete',globalController.deleteLinkC)

// ============================================
// ROUTES D'AUTHENTIFICATION
// ============================================

// Connexion utilisateur
// Middleware deConnecterApi empêche les utilisateurs déjà connectés
router.post('/connexion',deConnecterApi,globalController.connexion)

// Déconnexion utilisateur
// Middleware connecterApi exige une session active
router.post('/deconnexion',connecterApi,globalController.deconnexion)

// Export du routeur pour utilisation dans server.js
export default router
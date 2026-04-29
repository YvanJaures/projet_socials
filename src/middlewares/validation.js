/**
 * ============================================
 * VALIDATION MIDDLEWARE - Validation des données entrantes
 * ============================================
 * 
 * Ce fichier contient les middlewares de validation qui vérifient
 * la validité des données envoyées par les clients avant traitement.
 * 
 * @description Middlewares de validation des requêtes
 * @requires ../validators/validation.js
 */

import { courrielEstValide,texteEstValide,commentEstValide,motDePasseEstvalide } from "../validators/validation.js";

/**
 * Middleware: passwordValide
 * Valide que le mot de passe respecte les critères de sécurité
 * 
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 * @param {Function} next - Fonction next
 */
export function passwordValide(request,response,next){
    if(motDePasseEstvalide(request.body.password)){
        return next()
    }
    response.status(400).end()
}

/**
 * Middleware: texteValide
 * Valide que le texte n'est pas vide et respecte la longueur max (250)
 * 
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 * @param {Function} next - Fonction next
 */
export function texteValide(request,response,next){
    if(texteEstValide(request.body.texte)){
        return next();
    }
    response.status(400).end();
}

/**
 * Middleware: commentValide
 * Valide qu'un commentaire respecte une longueur spécifique
 * 
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 * @param {Function} next - Fonction next
 */
export function commentValide(request,response,next){
    if(commentEstValide(request.body.comment,request.body.taille)){
        return next()
    }
    response.status(400).end()
}

/**
 * Middleware: courrielValide
 * Valide le format de l'adresse courriel
 * 
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 * @param {Function} next - Fonction next
 */
export function courrielValide(request, response, next) {
    if (courrielEstValide(request.body.email)) {
        return next();
    }
    response.status(400).end();
}

/**
 * Middleware: motDePasseValide
 * Valide que le mot de passe a au moins 8 caractères
 * 
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 * @param {Function} next - Fonction next
 */
export function motDePasseValide(request, response, next) {
    if (motDePasseEstvalide(request.body.password)) {
        return next();
    }
    response.status(400).end();
}
/**
 * ============================================
 * AUTH MIDDLEWARE - Gestion de l'authentification
 * ============================================
 * 
 * Ce fichier contient les middlewares de protection des routes
 * selon l'état d'authentification de l'utilisateur.
 * 
 * @description Middlewares de vérification d'authentification
 * @module auth
 */

/**
 * Middleware: connecterPage
 * Vérifie si l'utilisateur EST connecté
 * Redirige vers /login si non connecté
 * 
 * @param {import("express").Request} request - Requête Express
 * @param {import("express").Response} response - Réponse Express
 * @param {import("express").NextFunction} next - Fonction next
 */
export function connecterPage(request,response,next){
    if(request.user){
        return next()
    }
    response.redirect('/login')
}

/**
 * Middleware: deConnecterPage
 * Vérifie si l'utilisateur N'EST PAS connecté
 * Redirige vers la page d'accueil si déjà connecté
 * 
 * @param {import("express").Request} request - Requête Express
 * @param {import("express").Response} response - Réponse Express
 * @param {import("express").NextFunction} next - Fonction next
 */
export function deConnecterPage(request,response,next){
    if(!request.user){
        return next()
    }
    response.redirect('/')
}

/**
 * Middleware: connecterApi
 * Vérifie si l'utilisateur EST connecté (pour API)
 * Retourne 401 si non connecté
 * 
 * @param {import("express").Request} request - Requête Express
 * @param {import("express").Response} response - Réponse Express
 * @param {import("express").NextFunction} next - Fonction next
 */
export function connecterApi(request,response,next){
    if(request.user){
        return next()
    }
    response.status(401).end()
}

/**
 * Middleware: deConnecterApi
 * Vérifie si l'utilisateur N'EST PAS connecté (pour API)
 * Retourne 401 si déjà connecté
 * 
 * @param {import("express").Request} request - Requête Express
 * @param {import("express").Response} response - Réponse Express
 * @param {import("express").NextFunction} next - Fonction next
 */
export function deConnecterApi(request,response,next){
    if(!request.user){
        return next()
    }
    response.status(401).end()
}
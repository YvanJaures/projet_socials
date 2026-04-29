/**
 * ============================================
 * GLOBAL CONTROLLER - Contrôleurs de l'API
 * ============================================
 * 
 * Ce fichier contient tous les contrôleurs (fonctions de traitement des requêtes)
 * pour les routes API. Chaque export correspond à une action spécifique.
 * 
 * @description Contrôleurs pour les routes API REST
 * @requires passport (authentification)
 * @requires dotenv (variables d'environnement)
 * @requires ../models/global.js
 * @requires ../services/auth.js
 */

import '../services/auth.js'
import passport from 'passport';
import 'dotenv/config'
import {getUserByName,getUserById,addUser,
    updateUser,updatePassword,addLink,updateLink,
    deleteUser,deleteLink,getIcons,getLinks,getUsers,
    addImage,
    updateImage} from '../models/global.js'

// ============================================
// FONCTIONS SSE (SERVER-SENT EVENTS)
// ============================================

/**
 * Initialise le stream SSE pour les mises à jour en temps réel
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const stream=async (request, response) => {
    response.initStream();    
}

// ============================================
// FONCTIONS DE LECTURE (GET)
// ============================================

/**
 * Récupère toutes les icônes disponibles
 * @route GET /api/icons
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const getIconsC=async(request,response)=>{
    try{
        const icons=await getIcons()
        response.status(200).json(icons)
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Récupère tous les liens de tous les utilisateurs
 * @route GET /api/links
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const getLinksC=async(request,response)=>{
    try{
        const links=await getLinks()
        response.status(200).json(links)
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Récupère tous les utilisateurs avec leurs liens
 * @route GET /api/users
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const getUsersC=async(request,response)=>{
    try{
        const users=await getUsers()
        response.status(200).json(users)
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Récupère tous les noms d'utilisateurs
 * @route GET /api/user/user_names
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const getUsersNameC=async (request,response)=>{
    try{
        const usersName=(await getUsers()).map(user=>user.user_name)
        response.status(200).json(usersName)
    }catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Récupère l'utilisateur connecté (depuis la session)
 * @route GET /api/user
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const getUser=async(request,response)=>{
    try{
        const user=request.user
        response.status(200).json(user)
    }catch(error){
        response.status(400).json({error})
    }
}

/**
 * Récupère un utilisateur par son nom d'utilisateur
 * @route GET /api/user/name?user_name=xxx
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const getUserByNameC=async(request,response)=>{
    try{
        const user=await getUserByName(request.query.user_name)
        response.status(200).json(user)
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Récupère un utilisateur par son ID
 * @route GET /api/user/id?id=xxx
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 */
export const getUserByIdC=async(request,response)=>{
    try{
        const user=await getUserById(request.query.id)
        response.status(200).json(user)
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

// ============================================
// FONCTIONS DE CRÉATION (POST)
// ============================================

/**
 * Crée un nouvel utilisateur
 * @route POST /api/user/add
 * @param {Object} request - Requête Express (corps: user_name, name, prenom, prof_img, email, password)
 * @param {Object} response - Réponse Express
 */
export const addUserC=async(request,response)=>{
    try{
        await addUser(request.body.user_name,
            request.body.name,
            request.body.prenom,
            request.body.prof_img,
            request.body.email,
            request.body.password)
        response.status(201).end()    
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Ajoute un nouveau lien social
 * @route POST /api/link/add
 * @param {Object} request - Requête Express (corps: title, url, icon, id_user)
 * @param {Object} response - Réponse Express
 */
export const addLinkC=async(request,response)=>{
    try{
        const link=await addLink(request.body.title,
            request.body.url,
            request.body.icon,
            request.body.id_user)
        response.pushJson({
            data:{id:link.id,
                title:request.body.title,
                url:request.body.url,
                icon:request.body.icon,
                id_user:request.body.id_user}
        },'added-link')
        response.status(201).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Ajoute une image de profil
 * @route POST /api/image/add
 * @param {Object} request - Requête Express (en-têtes: x-name, x-mime-type, x-id; corps: données binaires)
 * @param {Object} response - Réponse Express
 */
export const addImageC=async (request,response)=>{
    try{
        await addImage(request.headers["x-name"],
            request.body,
            request.headers["x-mime-type"],
            parseInt(request.headers["x-id"])
        )
        
        response.status(201).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

// ============================================
// FONCTIONS DE MODIFICATION (PATCH)
// ============================================

/**
 * Met à jour les informations d'un utilisateur
 * @route PATCH /api/user/update
 * @param {Object} request - Requête Express (corps: user_name, alias, new_info)
 * @param {Object} response - Réponse Express
 */
export const updateUserC=async(request,response)=>{
    try{
        await updateUser(request.body.user_name,
            request.body.alias,
            request.body.new_info)
            response.pushJson({
            data:{user_name:request.body.user_name,
                alias:request.body.alias,
                new_info:request.body.new_info
            }
        },'updated-user')
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Met à jour le mot de passe d'un utilisateur
 * @route PATCH /api/user/update/password
 * @param {Object} request - Requête Express (corps: user_name, old_password, new_password)
 * @param {Object} response - Réponse Express
 */
export const updatePasswordC=async(request,response)=>{
    try{
        await updatePassword(request.body.user_name,
            request.body.old_password,
            request.body.new_password)
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Met à jour un lien social
 * @route PATCH /api/link/update
 * @param {Object} request - Requête Express (corps: id, title)
 * @param {Object} response - Réponse Express
 */
export const updateLinkC=async(request,response)=>{
    try{
        await updateLink(request.body.id,
            request.body.title)
        response.pushJson({
            data:{id:request.body.id,
                title:request.body.title
            }
        },'updated-link')
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Met à jour l'image de profil
 * @route PATCH /api/image/update
 * @param {Object} request - Requête Express (en-têtes: x-mime-type, x-id; corps: données binaires)
 * @param {Object} response - Réponse Express
 */
export const updateImageC=async (request,response)=>{
    try{
        const img = request.body 
        const type = request.headers["x-mime-type"]
        const id=parseInt(request.headers["x-id"])
        await updateImage(img,type,id
        )

        const imgUrl=`data:${type};base64,${img.toString('base64')}`
        response.pushJson({
            data:{
                data:imgUrl,
                type:type,
                id_user:id
            }
        },'updated-image')
        response.status(201).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

// ============================================
// FONCTIONS DE SUPPRESSION (DELETE)
// ============================================

/**
 * Supprime un utilisateur
 * @route DELETE /api/user/delete
 * @param {Object} request - Requête Express (corps: user_name)
 * @param {Object} response - Réponse Express
 */
export const deleteUserC=async(request,response)=>{
    try{
        await deleteUser(request.body.user_name)
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

/**
 * Supprime un lien social
 * @route DELETE /api/link/delete
 * @param {Object} request - Requête Express (corps: id)
 * @param {Object} response - Réponse Express
 */
export const deleteLinkC=async(request,response)=>{
    try{
        await deleteLink(request.body.id)
        response.pushJson({
            data:{id:request.body.id}
        },'deleted-link')
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}

// ============================================
// FONCTIONS D'AUTHENTIFICATION
// ============================================

/**
 * Connecte un utilisateur (authentification locale)
 * @route POST /api/connexion
 * @param {Object} request - Requête Express (corps: user_name, password)
 * @param {Object} response - Réponse Express
 * @param {Function} next - Fonction next d'Express
 */
export const connexion=async(request, response, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) return next(error);
        if (!user) return response.status(401).json(info);
        request.logIn(user, (error) => {
            if (error) return next(error);
            response.sendStatus(200);
        });
    })(request, response, next);
}

/**
 * Déconnecte l'utilisateur actuel
 * @route POST /api/deconnexion
 * @param {Object} request - Requête Express
 * @param {Object} response - Réponse Express
 * @param {Function} next - Fonction next d'Express
 */
export const deconnexion=async (request, response, next) => {
    request.logout((error) => {
        if (error) return next(error);
        response.status(200).end();
    });
}
/**
 * ============================================
 * AUTH SERVICE - Service d'authentification Passport
 * ============================================
 * 
 * Ce fichier configure Passport.js avec la stratégie d'authentification
 * locale (nom d'utilisateur et mot de passe).
 * Gère la sérialisation et désérialisation des utilisateurs.
 * 
 * @description Configuration de l'authentification avec Passport.js
 * @requires bcrypt (vérification des mots de passe)
 * @requires passport
 * @requires passport-local
 * @requires ../models/global.js
 */

import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy } from 'passport-local'
import {getUserByName } from '../models/global.js'

// ============================================
// CONFIGURATION DE LA STRATÉGIE LOCALE
// ============================================

// Configuration de la stratégie: utilise 'user_name' pour l'identifiant
// et 'password' pour le mot de passe
const config={
    usernameField:'user_name',
    passwordField:'password'
}

// Initialisation de la stratégie Passport avec authentification locale
passport.use(new Strategy(config,async(user_name,password,done)=>{
    try{
        // Récupération de l'utilisateur par son nom
        let client=await getUserByName(user_name)
        
        // Vérification de l'existence de l'utilisateur
        if(!client){
            return done(null,false,{erreur:'mauvais_name'})
        }
        
        // Vérification du mot de passe avec bcrypt
        const valid=await bcrypt.compare(password,client.password)
        if(!valid){
            return done(null,false,{erreur:'mauvais_password'})
        }
        
        // Succès: retourne l'utilisateur
        done(null,client)
    }catch(erreur){
        // Erreur lors de l'authentification
        done(erreur)
    }
}))

// ============================================
// SÉRIALISATION/DÉSÉRIALISATION
// ============================================

/**
 * Sérialisation: stocke l'identifiant utilisateur dans la session
 * @param {Object} client - Objet utilisateur
 * @param {Function} done - Callback de Passport
 */
passport.serializeUser((client,done)=>{
    done(null,client.user_name)
})

/**
 * Désérialisation: récupère l'utilisateur complet depuis la session
 * @param {string} user_name - Nom d'utilisateur stocké
 * @param {Function} done - Callback de Passport
 */
passport.deserializeUser(async(user_name,done)=>{
    try{
        const client =await getUserByName(user_name)
        done(null,client)
    }catch(erreur){
        done(erreur)
    }
})
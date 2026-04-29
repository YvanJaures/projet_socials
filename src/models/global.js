/**
 * ============================================
 * GLOBAL MODEL - Modèle de données principal
 * ============================================
 * 
 * Ce fichier contient toutes les fonctions d'accès à la base de données
 * pour la gestion des utilisateurs, liens, icônes et images.
 * 
 * @description Fonctions CRUD pour la base de données
 * @requires bcrypt (hachage des mots de passe)
 * @requires prisma (ORM)
 */

import bcrypt from 'bcrypt'
import {prisma} from '../prisma.js'

// ============================================
// FONCTIONS DE LECTURE (READ)
// ============================================

/**
 * Récupère toutes les icônes disponibles pour les réseaux sociaux
 * @returns {Promise<Array>} Liste des icônes
 */
export async function getIcons(){
    try {
        return await prisma.icon.findMany()
    } catch (error) {
        console.error("Erreur dans getIcons:", error)
        return []
    }
} 

/**
 * Récupère tous les liens de tous les utilisateurs
 * @returns {Promise<Array>} Liste des liens
 */
export async function getLinks(){
    try {
        return await prisma.link.findMany()
    } catch (error) {
        console.error("Erreur dans getLinks:", error)
        return []
    }
}

/**
 * Récupère tous les utilisateurs avec leurs liens et images
 * @returns {Promise<Array>} Liste des utilisateurs (sans mot de passe)
 */
export async function getUsers(){
    try {
        return await prisma.user.findMany({
            select:{
                user_name:true,
                name:true,
                prenom:true,
                created:true,
                prof_img:true,
                email:true,
                Link:{
                    select:{
                        id:true,
                        title:true,
                        icon:true,
                        url:true
                    }
                },
                Image:true
            }
        })
    } catch (error) {
        console.error("Erreur dans getUsers:", error)
        return []
    }
}

/**
 * Récupère un utilisateur par son nom d'utilisateur
 * Inclut les liens et l'image de profil
 * 
 * @param {string} user_name - Nom d'utilisateur
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null
 */
export async function getUserByName(user_name){
    try {
        return await prisma.user.findUnique({
            where:{
                user_name:user_name
            },
            select:{
                id_user:true,
                user_name:true,
                name:true,
                prenom:true,
                created:true,
                prof_img:true,
                email:true,
                password:true,  // Inclus pour l'authentification
                Link:{
                    select:{
                        id:true,
                        title:true,
                        icon:true,
                        url:true
                    }
                },
                Image:true
            }
        })
    } catch (error) {
        console.error("Erreur dans getUserByName:", error)
        return null
    }
}

/**
 * Récupère un utilisateur par son ID
 * 
 * @param {number} id_user - ID de l'utilisateur
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null
 */
export async function getUserById(id_user){
    try {
        return await prisma.user.findUnique({
            where:{
                id_user:id_user
            }
        })
    } catch (error) {
        console.error("Erreur dans getUserById:", error)
        return null
    }
}

// ============================================
// FONCTIONS DE CRÉATION (CREATE)
// ============================================

/**
 * Crée un nouvel utilisateur avec mot de passe hashé
 * 
 * @param {string} user_name - Nom d'utilisateur unique
 * @param {string} name - Nom de famille
 * @param {string} prenom - Prénom
 * @param {string} prof_img - URL de l'image de profil
 * @param {string} email - Adresse courriel
 * @param {string} password - Mot de passe en clair (sera hashé)
 */
export async function addUser(user_name,name,prenom,prof_img,email,password){
    try {
        // Hachage du mot de passe avec bcrypt (10 rounds)
        const hash_password=await bcrypt.hash(password,10)
        const date=new Date()
        
        await prisma.user.create({
            data:{
                user_name:user_name,
                name:name,
                prenom:prenom,
                created:date,
                prof_img:prof_img,
                email:email,
                password:hash_password
            }
        });
    } catch (error) {
        console.error("Erreur dans addUser:", error)
        throw error
    }
}

/**
 * Ajoute un nouveau lien social pour un utilisateur
 * 
 * @param {string} title - Titre du lien
 * @param {string} url - URL du lien
 * @param {string} icon - Nom de l'icône Font Awesome
 * @param {number} id_user - ID de l'utilisateur propriétaire
 * @returns {Promise<Object>} Lien créé
 */
export async function addLink(title,url,icon,id_user){
    try {
        return await prisma.link.create({
            data:{
                title:title,
                url:url,
                icon:icon,
                id_user:id_user
            }
        })
    } catch (error) {
        console.error("Erreur dans addLink:", error)
        throw error
    }
}

/**
 * Ajoute une image de profil pour un utilisateur
 * 
 * @param {string} name - Nom du fichier
 * @param {Buffer} data - Données binaires de l'image
 * @param {string} type - Type MIME de l'image
 * @param {number} id_user - ID de l'utilisateur
 * @returns {Promise<Object>} Image créée
 */
export async function addImage(name,data,type,id_user){
    try {
        const index=await prisma.image.create({
            data:{
                name:name,
                data:data,
                type:type,
                id_user:id_user
            }
        })
        return index
    } catch (error) {
        console.error("Erreur dans addImage:", error)
        throw error
    }
}

// ============================================
// FONCTIONS DE MISE À JOUR (UPDATE)
// ============================================

/**
 * Met à jour les informations d'un utilisateur
 * 
 * @param {string} user_name - Nom d'utilisateur
 * @param {string} alias - Champ à modifier (name, prenom, email, prof_img)
 * @param {string} new_info - Nouvelle valeur
 */
export async function updateUser(user_name,alias,new_info){
    try {
        switch(alias.toLowerCase()){
            case "name":
                await prisma.user.update({
                    where:{ user_name:user_name },
                    data:{ name:new_info }
                });
                break;
            case "prenom":
                await prisma.user.update({
                    where:{ user_name:user_name },
                    data:{ prenom:new_info }
                });
                break;
            case "email":
                await prisma.user.update({
                    where:{ user_name:user_name },
                    data:{ email:new_info }
                });
                break;
            case "prof_img":
                await prisma.user.update({
                    where:{ user_name:user_name },
                    data:{ prof_img:new_info }
                });
                break;
            default:
                await prisma.user.update({
                    where:{ user_name:user_name },
                    data:{ phone:new_info }
                });
                break;
        }
    } catch (error) {
        console.error("Erreur dans updateUser:", error)
        throw error
    }
}

/**
 * Met à jour le mot de passe d'un utilisateur
 * Vérifie l'ancien mot de passe avant modification
 * 
 * @param {string} user_name - Nom d'utilisateur
 * @param {string} old_password - Ancien mot de passe
 * @param {string} new_password - Nouveau mot de passe
 * @returns {Promise<string>} "ok", "mauvais_password" ou "utilisateur_non_trouve"
 */
export async function updatePassword(user_name,old_password,new_password){
    try {
        const client=await getUserByName(user_name)
        if(!client){
            return "utilisateur_non_trouve"
        }
        // Vérification de l'ancien mot de passe
        if(await bcrypt.compare(old_password,client.password)){
            await prisma.user.update({
                where:{ user_name:user_name },
                data:{ password:await bcrypt.hash(new_password,10) }
            })
            return "ok"
        }
        else{
            return "mauvais_password"
        }
    } catch (error) {
        console.error("Erreur dans updatePassword:", error)
        throw error
    }
}

/**
 * Met à jour l'image de profil d'un utilisateur
 * 
 * @param {Buffer} data - Nouvelles données binaires de l'image
 * @param {string} type - Type MIME de l'image
 * @param {number} id_user - ID de l'utilisateur
 */
export async function updateImage(data,type,id_user){
    try {
        await prisma.image.update({
            where:{ id_user:id_user },
            data:{ data:data, type:type }
        })
    } catch (error) {
        console.error("Erreur dans updateImage:", error)
        throw error
    }
}

/**
 * Met à jour le titre d'un lien
 * 
 * @param {number} id - ID du lien
 * @param {string} title - Nouveau titre
 */
export async function updateLink(id,title){
    try {
        await prisma.link.update({
            where:{ id:id },
            data:{ title:title }
        })
    } catch (error) {
        console.error("Erreur dans updateLink:", error)
        throw error
    }
}

// ============================================
// FONCTIONS DE SUPPRESSION (DELETE)
// ============================================

/**
 * Supprime un utilisateur et toutes ses données associées
 * 
 * @param {string} user_name - Nom d'utilisateur à supprimer
 */
export async function deleteUser(user_name){
    try {
        await prisma.user.delete({
            where:{ user_name:user_name }
        })
    } catch (error) {
        console.error("Erreur dans deleteUser:", error)
        throw error
    }
}

/**
 * Supprime un lien social
 * 
 * @param {number} id - ID du lien à supprimer
 */
export async function deleteLink(id){
    await prisma.link.delete({
        where:{ id:id }
    })
}
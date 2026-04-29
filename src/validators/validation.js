/**
 * ============================================
 * VALIDATORS - Fonctions de validation des données
 * ============================================
 * 
 * Ce fichier contient les fonctions de validation utilisées
 * pour vérifier la validité des données saisies par les utilisateurs.
 * 
 * @description Fonctions de validation côté serveur
 */

/**
 * Valide qu'un texte n'est pas vide et respecte la longueur max (250 caractères)
 * 
 * @param {string} texte - Le texte à valider
 * @returns {boolean} true si valide, false sinon
 */
export function texteEstValide(texte){
    // Vérification: doit être une chaîne non vide de 1 à 250 caractères
    return typeof texte==='string' &&
     texte.trim().length>0 &&
     texte.trim().length<=250;
}

/**
 * Valide qu'un commentaire respecte une longueur maximale personnalisée
 * 
 * @param {string} texte - Le commentaire à valider
 * @param {number} taille - Longueur maximale autorisée
 * @returns {boolean} true si valide, false sinon
 */
export function commentEstValide(texte,taille){
    return typeof texte==='string' &&
     texte.trim().length>0 &&
     texte.trim().length<=taille;
}

/**
 * Valide le format d'une adresse courriel
 * Utilise une expression régulière complète pour la validation
 * 
 * @param {string} courriel - L'adresse courriel à valider
 * @returns {boolean} true si valide, false sinon
 */
export function courrielEstValide(courriel){
    // Expression régulière RFC 5322 simplifiée pour validation d'email
    return typeof courriel==='string' &&
        courriel.match(/(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
}

/**
 * Valide qu'un mot de passe a au moins 8 caractères
 * 
 * @param {string} motDePasse - Le mot de passe à valider
 * @returns {boolean} true si valide, false sinon
 */
export function motDePasseEstvalide(motDePasse){
    return typeof motDePasse==='string' &&
        motDePasse.length>=8
}

/**
 * Valide le format d'une date de naissance (format: jj/mm/aaaa)
 * Accepte les dates valides et le 29 février pour les années bissextiles
 * 
 * @param {string} naissance - La date de naissance à valider
 * @returns {boolean} true si valide, false sinon
 */
export function NaissanceEstValide(naissance){
    return typeof naissance==='string' && naissance.match(/^(?:(?:31\/(?:01|03|05|07|08|10|12))|(?:29|30)\/(?:01|03|04|05|06|07|08|09|10|11|12)|(?:0[1-9]|1\d|2[0-8])\/(?:0[1-9]|1[0-2]))\/(?:19|20)\d\d$|^29\/02\/(?:(?:19|20)(?:04|08|[2468][048]|[13579][26])|2000)$/)
}

/**
 * Valide qu'un nom de pays ne contient que des lettres, espaces, tirets
 * Longueur: 2 à 56 caractères
 * 
 * @param {string} pays - Le nom du pays à valider
 * @returns {boolean} true si valide, false sinon
 */
export function paysEstValide(pays){
    return typeof pays==='string' && pays.trim().match(/^[a-zA-ZÀ-ÿ\s\-']{2,56}$/)
}

/**
 * Valide le format d'un numéro de téléphone
 * Formats acceptés: (123) 456-7890, 123-456-7890, +1 123 456 7890
 * 
 * @param {string} tel - Le numéro de téléphone à valider
 * @returns {boolean} true si valide, false sinon
 */
export function telEstValide(tel){
    return typeof tel==='string' && tel.trim().match(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
}


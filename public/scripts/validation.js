export function texteEstValide(texte){
    //return Array.isArray(texte) //Exemple pour valider le type tableau
    return typeof texte==='string' &&
     texte.trim().length>0 &&
     texte.trim().length<=250;
}
export function commentEstValide(texte,taille){
    //return Array.isArray(texte) //Exemple pour valider le type tableau
    return typeof texte==='string' &&
     texte.trim().length>0 &&
     texte.trim().length<=taille;
}
export function courrielEstValide(courriel){
    return typeof courriel==='string' &&
        courriel.match(/(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
}

export function motDePasseEstvalide(motDePasse){
    return typeof motDePasse==='string' &&
        motDePasse.length>=8
}
export function NaissanceEstValide(naissance){
    return typeof naissance==='string' && naissance.match(/^(?:(?:31\/(?:01|03|05|07|08|10|12))|(?:29|30)\/(?:01|03|04|05|06|07|08|09|10|11|12)|(?:0[1-9]|1\d|2[0-8])\/(?:0[1-9]|1[0-2]))\/(?:19|20)\d\d$|^29\/02\/(?:(?:19|20)(?:04|08|[2468][048]|[13579][26])|2000)$/)
}
export function paysEstValide(pays){
    return typeof pays==='string' && pays.trim().match(/^[a-zA-ZÀ-ÿ\s\-']{2,56}$/)

}
export function telEstValide(tel){
    return typeof tel==='string' && tel.trim().match(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
}


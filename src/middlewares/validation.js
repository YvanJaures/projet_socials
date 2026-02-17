import { courrielEstValide,texteEstValide,commentEstValide,motDePasseEstvalide } from "../validators/validation.js";
export function passwordValide(request,response,next){
    if(motDePasseEstvalide(request.body.password)){
        return next()
    }
    response.status(400).end()
}
export function texteValide(request,response,next){
    if(texteEstValide(request.body.texte)){
        return next();
    }
    response.status(400).end();
}
export function commentValide(request,response,next){
    if(commentEstValide(request.body.comment,request.body.taille)){
        return next()
    }
    response.status(400).end()
}
export function courrielValide(request, response, next) {
    if (courrielEstValide(request.body.email)) {
        return next();
    }

    response.status(400).end();
}

export function motDePasseValide(request, response, next) {
    if (motDePasseEstvalide(request.body.password)) {
        return next();
    }

    response.status(400).end();
}
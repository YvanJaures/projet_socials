/**
 * 
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
export function connecterPage(request,response,next){
    if(request.user){
        return next()
    }
    response.redirect('/')
}
/**
 * 
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
export function deConnecterPage(request,response,next){
    if(!request.user){
        return next()
    }
    response.redirect('/')
}
/**
 * 
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
export function connecterApi(request,response,next){
    if(request.user){
        return next()
    }
    response.status(401).end()
}
/**
 * 
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
export function deConnecterApi(request,response,next){
    if(!request.user){
        return next()
    }
    response.status(401).end()
}
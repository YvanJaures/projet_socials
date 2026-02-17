import '../services/auth.js'
import passport from 'passport';
import 'dotenv/config'
import {getUserByName,getUserById,addUser,
    updateUser,updatePassword,addLink,updateLink,
    deleteUser,deleteLink,getIcons,getLinks,getUsers} from '../models/global.js'

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
export const addUserC=async(request,response)=>{
    try{
        await addUser(request.body.user_name,
            request.body.prenom,
            request.body.created,
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
export const updateUserC=async(request,response)=>{
    try{
        await updateUser(request.body.user_name,
            request.body.alias,
            request.body.new_info)
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}
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
export const addLinkC=async(request,response)=>{
    try{
        await addLink(request.body.title,
            request.body.url,
            request.body.icon,
            request.body.id_user)
        response.status(201).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}
export const updateLinkC=async(request,response)=>{
    try{
        await updateLink(request.body.id,
            request.body.title)
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}
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
export const deleteLinkC=async(request,response)=>{
    try{
        await deleteLink(request.body.id)
        response.status(200).end()
    }
    catch(error){
        response.status(400).end()
        console.log(error)
    }
}
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
export const deconnexion=async (request, response, next) => {
    request.logout((error) => {
        if (error) return next(error);
        response.status(200).end();
    });
}
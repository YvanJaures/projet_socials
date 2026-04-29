import bcrypt from 'bcrypt'
import {prisma} from '../prisma.js'

export async function getIcons(){
    try {
        return await prisma.icon.findMany()
    } catch (error) {
        console.error("Erreur dans getIcons:", error)
        return []
    }
} 
export async function getLinks(){
    try {
        return await prisma.link.findMany()
    } catch (error) {
        console.error("Erreur dans getLinks:", error)
        return []
    }
}
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
                password:true,
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
export async function addUser(user_name,name,prenom,prof_img,email,password){
    try {
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
export async function updateUser(user_name,alias,new_info){
    try {
        switch(alias.toLowerCase()){
            case "name":
                await prisma.user.update({
                    where:{
                        user_name:user_name
                    },
                    data:{
                        name:new_info
                    }
                });
                break;
            case "prenom":
                await prisma.user.update({
                    where:{
                        user_name:user_name
                    },
                    data:{
                        prenom:new_info
                    }
                });
                break;
            case "email":
                await prisma.user.update({
                    where:{
                        user_name:user_name
                    },
                    data:{
                        email:new_info
                    }
                });
                break;
            case "prof_img":
                await prisma.user.update({
                    where:{
                        user_name:user_name
                    },
                    data:{
                        prof_img:new_info
                    }
                });
                break;
            default:
                await prisma.user.update({
                    where:{
                        user_name:user_name
                    },
                    data:{
                        phone:new_info
                    }
                });
                break;
        }
    } catch (error) {
        console.error("Erreur dans updateUser:", error)
        throw error
    }
    
}
export async function updatePassword(user_name,old_password,new_password){
    try {
        const client=await getUserByName(user_name)
        if(!client){
            return "utilisateur_non_trouve"
        }
        if(await bcrypt.compare(old_password,client.password)){
            await prisma.user.update({
                where:{
                    user_name:user_name
                },
                data:{
                    password:await bcrypt.hash(new_password,10)
                }
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
export async function updateImage(data,type,id_user){
    try {
        await prisma.image.update({
            where:{
                id_user:id_user
            },
            data:{
                data:data,
                type:type
            }
        })
    } catch (error) {
        console.error("Erreur dans updateImage:", error)
        throw error
    }
}
export async function updateLink(id,title){
    try {
        await prisma.link.update({
            where:{
                id:id
            },
            data:{
                title:title
            }
        })
    } catch (error) {
        console.error("Erreur dans updateLink:", error)
        throw error
    }
}
export async function deleteUser(user_name){
    try {
        await prisma.user.delete({
            where:{
                user_name:user_name
            }
        })
    } catch (error) {
        console.error("Erreur dans deleteUser:", error)
        throw error
    }
}
export async function deleteLink(id){
    await prisma.link.delete({
        where:{
            id:id
        }
    })
}
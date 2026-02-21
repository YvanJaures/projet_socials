import bcrypt from 'bcrypt'
import {prisma} from '../prisma.js'

export async function getIcons(){
    return await prisma.icon.findMany()
} 
export async function getLinks(){
    return await prisma.link.findMany()
}
export async function getUsers(){
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
}
export async function getUserByName(user_name){
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
}
export async function getUserById(id_user){
    return await prisma.user.findUnique({
        where:{
            id_user:id_user
        }
    })
}
export async function addUser(user_name,name,prenom,prof_img,email,password){
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
}
export async function updateUser(user_name,alias,new_info){
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
    
}
export async function updatePassword(user_name,old_password,new_password){
    const client=await getUserByName(user_name)
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
}
export async function addLink(title,url,icon,id_user){
    return await prisma.link.create({
        data:{
            title:title,
            url:url,
            icon:icon,
            id_user:id_user
        }
    })
}
export async function addImage(name,data,type,id_user){
    const index=await prisma.image.create({
        data:{
            name:name,
            data:data,
            type:type,
            id_user:id_user
        }
    })
    return index
}
export async function updateImage(data,type,id_user){
    await prisma.image.update({
        where:{
            id_user:id_user
        },
        data:{
            data:data,
            type:type
        }
    })
}
export async function updateLink(id,title){
    await prisma.link.update({
        where:{
            id:id
        },
        data:{
            title:title
        }
    })
}
export async function deleteUser(user_name){
    await prisma.user.delete({
        where:{
            user_name:user_name
        }
    })
}
export async function deleteLink(id){
    await prisma.link.delete({
        where:{
            id:id
        }
    })
}
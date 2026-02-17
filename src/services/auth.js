import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy } from 'passport-local'
import {getUserByName } from '../models/global.js'

const config={
    usernameField:'user_name',
    passwordField:'password'
}

passport.use(new Strategy(config,async(user_name,password,done)=>{
    try{
        let client=await getUserByName(user_name)
        if(!client){
            return done(null,false,{erreur:'mauvais_name'})
            
        }
        const valid=await bcrypt.compare(password,client.password)
        if(!valid){
            return done(null,false,{erreur:'mauvais_password'})
        }
        done(null,client)
    }catch(erreur){
        done(erreur)
    }

}))
passport.serializeUser((client,done)=>{
    done(null,client.user_name)
})
passport.deserializeUser(async(user_name,done)=>{
    try{
        const client =await getUserByName(user_name)
        done(null,client)
    }catch(erreur){
        done(erreur)
    }
})
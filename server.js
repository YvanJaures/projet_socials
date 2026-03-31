import 'dotenv/config'
import express, { json } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import {engine} from 'express-handlebars'
import Handlebars from 'handlebars'
import sse from './src/middlewares/sse.js'
import passport from 'passport'
import session from 'express-session'
import memorystore from 'memorystore'
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes/global.js'
import { getIcons, getUserByName, getUsers } from './src/models/global.js'
import { connecterPage, deConnecterPage } from './src/middlewares/auth.js'
// Defini si nous sommes en production ou en developpement
const dev = process.env.NODE_ENV !== "production";

const PORT = process.env.PORT ;

const app=express()
const MemoryStore=memorystore(session)
/*
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://kit.fontawesome.com/2dd86e731d.js"],
    },
  })
);
*/
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(session({
    name:process.env.npm_package_name,
    cookie:{maxAge:3600000},
    store:new MemoryStore({checkPeriod:3600000}),
    rolling:true,
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET
}))

// Appel de notre handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.use(express.raw({
  type: "application/octet-stream",
  limit: "50mb"
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(sse())
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
//app.use(express.static('public'))
const publicPath = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'public') 
    : path.join(__dirname, 'public');

app.use(express.static(publicPath));
/*
let users=await getUsers()
for(const user of users){
    let imageUrl = null
    if (user.Image) {
      const buffer = user.Image.data instanceof Buffer
        ? user.Image.data
        : Buffer.from(user.Image.data)

      imageUrl = `data:${user.Image.type};base64,${buffer.toString('base64')}`
    }
    app.get(`/${user.user_name}`,async(request,response)=>{
        response.status(200).render('accueil',{
            titre: `${user.name.toUpperCase()}`,
            styles:['/style/index.css'],
            scripts:['/scripts/accueil.js'],
            imgUrl:imageUrl,
            links:user.Link,
            user:user
        })
    })
}
*/
app.get(`/MyLinks/:user_name`,async(request,response)=>{
    if(request.params.user_name==="login" || request.params.user_name==="signup") return
    const user=await getUserByName(request.params.user_name)
    if(!user) return response.status(404).send('User not found')
    let imageUrl = null
    if (user?.Image) {
      const buffer = user.Image.data instanceof Buffer
        ? user.Image.data
        : Buffer.from(user.Image.data)

      imageUrl = `data:${user.Image.type};base64,${buffer.toString('base64')}`
    }
    response.status(200).render('accueil',{
        titre: `${user.name.toUpperCase()}`,
        styles:['/style/index.css'],
        scripts:['/scripts/accueil.js'],
        imgUrl:imageUrl,
        links:user.Link,
        user:user
    })
})
/**/
app.get('/',connecterPage, async (request, response) => {
    const icons=await getIcons()
    const user=request.user
    let imageUrl = null
    if (user.Image) {
      const buffer = user.Image.data instanceof Buffer
        ? user.Image.data
        : Buffer.from(user.Image.data)

      imageUrl = `data:${user.Image.type};base64,${buffer.toString('base64')}`
    }
    response.status(200).render('client', {
        titre: 'Socials',
        styles: ['/style/client.css','/style/index.css'],
        scripts: ['/scripts/client.js'],
        imgUrl:imageUrl,
        links:request.user.Link,
        user:request.user,
        icons:icons
    });
});

app.get('/login',deConnecterPage, async (request, response) => {
    response.status(200).render('login', {
        titre: 'Log in',
        styles: ['/style/login.css'],
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js','/scripts/login.js']
    });
});

app.get('/signup',deConnecterPage, async (request, response) => {
    response.status(200).render('register', {
        titre: 'Sign up',
        styles: ['/style/register.css'],
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js','/scripts/register.js']
    });
});

app.use('/api',router)

app.listen(PORT, () => {
  console.log(`Serveur unique: http://localhost:${PORT} (dev=${dev})`);
});
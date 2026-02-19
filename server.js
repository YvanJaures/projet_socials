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
import { getIcons, getUsers } from './src/models/global.js'
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

const users=await getUsers()
for(const user of users){
    app.get(`/${user.user_name}`,async(request,response)=>{
        response.status(200).render('accueil',{
            titre: `${user.name.toUpperCase()}`,
            scripts:['/scripts/accueil.js'],
            links:user.Link,
            user:user
        })
    })
}

/**/
app.get('/',connecterPage, async (request, response) => {
    const icons=await getIcons()
    response.status(200).render('client', {
        titre: 'Socials',
        styles: ['/style/client.css'],
        scripts: ['/scripts/client.js'],
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
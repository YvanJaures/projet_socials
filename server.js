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
      scriptSrc: ["'self'", "https://kit.fontawesome.com"],
    },
  })
);*/
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

app.get('/client_page', async (request, response) => {
    response.status(200).render('accueil', {
        titre: 'Accueil',
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js']
    });
});
app.get('/', async (request, response) => {
    response.status(200).render('client', {
        titre: 'Socials',
        styles: ['/style/client.css'],
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js']
    });
});

app.get('/login', async (request, response) => {
    response.status(200).render('login', {
        titre: 'Log in',
        styles: ['/style/login.css'],
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js']
    });
});

app.get('/signup', async (request, response) => {
    response.status(200).render('register', {
        titre: 'Sign up',
        styles: ['/style/register.css'],
        scripts: ['https://kit.fontawesome.com/2dd86e731d.js']
    });
});

app.use('/api',router)

app.listen(PORT, () => {
  console.log(`Serveur unique: http://localhost:${PORT} (dev=${dev})`);
});
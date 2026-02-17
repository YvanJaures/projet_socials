import { texteEstValide } from "./validation.js"
const usernameI=document.getElementById('username')
console.log(usernameI)
const passwordI=document.getElementById('password')
console.log(passwordI)
const errorI=document.getElementsByClassName('error')[0]
const form=document.getElementsByClassName('login-form')[0]

async function login(){
    errorI.classList.remove('show')
    let user_name=usernameI.value
    let password=passwordI.value
    if(!texteEstValide(user_name) || !texteEstValide(password)){
        errorI.textContent="valeur invalide"
        errorI.classList.toggle('show')
        return
    }
    const response=await fetch('/api/connexion',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({user_name,password})
    })
    if(response.ok){
        location.replace(`/`)
    }
    else if(response.status===401){
        errorI.innerText='Adresse courriel ou mot de passe incorrect'
        errorI.classList.add('show')
    }
}
form.addEventListener('submit',async (e)=>{
    e.preventDefault()
    await login()
})

import { emailEstValide, texteEstValide ,motDePasseEstvalide} from "./validation.js"

const user_nameI=document.getElementById('user_name')
const emailI=document.getElementById('email')
const nameI=document.getElementById('name')
const prenomI=document.getElementById('prenom')
const passwordI=document.getElementById('password')
const cPasswordI=document.getElementById('confirm-password')
const imgI=document.getElementById('img_profil')
const imgDiv=document.getElementsByClassName('img')[0]
const errors=document.getElementsByClassName('error')
const form=document.getElementsByClassName('login-form')[0]
const user_names=await (async ()=>{
    const response=await fetch('/api/user/user_names')
    if(response.ok){
        return await response.json()
    }
})()
let isWrong=false
console.log(user_names)
let nameF=""
let dataF=[]
let typeF=''
let idF=user_names.lenght+1
form.addEventListener('submit',async (e)=>{
    e.preventDefault()
    errors[6].classList.remove('show')
    if(!texteEstValide(user_nameI.value)||!texteEstValide(emailI.value)
        ||!texteEstValide(nameI.value) ||!texteEstValide(prenomI.value)
        || !texteEstValide(passwordI.value) 
        || !texteEstValide(cPasswordI.value) || !texteEstValide(imgDiv.textContent)){
        errors[6].classList.add('show')
        errors[6].textContent='veuillez remplir tous les champs'
        return
    }
    if(!emailEstValide(emailI.value)){
        errors[6].classList.add('show')
        errors[6].textContent='Email incorrect'
        return
    }
    if(!texteEstValide(imgDiv.textContent)){
        errors[6].classList.add('show')
        errors[6].textContent='veuillez choisir une image'
        return
    }
    if(!isWrong){
        await createUser()
        location.replace('/login')
    }
})
cPasswordI.addEventListener('input',(e)=>{
    e.preventDefault()
    isWrong=false
    errors[5].classList.remove('show')
    errors[5].style.color='red'
    if(passwordI.value!==cPasswordI.value){
        isWrong=true
        errors[5].classList.add('show')
        errors[5].textContent='mot de passe non identique'
        errors[5].style.color='red'
        return
    }else{
        isWrong=false
        errors[5].classList.add('show')
        errors[5].textContent='mot de passe identique'
        errors[5].style.color='green'
        return
    }
})
passwordI.addEventListener('input',(e)=>{
    e.preventDefault()
    isWrong=false
    errors[4].classList.remove('show')
    errors[4].style.color='red'
    if(!motDePasseEstvalide(passwordI.value)){
        isWrong=true
        errors[4].classList.add('show')
        errors[4].textContent='moins de 8 caractères'
        errors[4].style.color='red'
        return
    }else{
        isWrong=false
        errors[4].classList.add('show')
        errors[4].textContent='mot de passe correct'
        errors[4].style.color='green'
        return
    }
})
user_nameI.addEventListener('input',(e)=>{
    isWrong=false
    e.preventDefault()
    errors[0].classList.remove('show')
    let user_name=user_nameI.value
    user_names.map((name)=>{
        console.log(name)
        if(name.startsWith(user_name)){
            isWrong=true
            errors[0].classList.add('show')
            errors[0].textContent='username non disponible'
            errors[0].style.color='red'
        }else{
            errors[0].textContent='username disponible'
            errors[0].style.color='green'
            errors[0].classList.add('show')
        }
        
    })
})
emailI.addEventListener('input',(e)=>{
    e.preventDefault()
    isWrong=false
    errors[1].classList.remove('show')
    errors[1].style.color='red'
    if(!emailEstValide(emailI.value)){
        isWrong=true
        errors[1].classList.add('show')
        errors[1].textContent='email incorrecte'
        errors[1].style.color='red'
        return
    }else{
        isWrong=false
        errors[1].classList.add('show')
        errors[1].textContent='email correcte'
        errors[1].style.color='green'
        return
    }
})
imgI.addEventListener('change',async (e)=>{
    e.preventDefault()
    errors[6].classList.remove('show')
    const img=imgI.files[0]
    if(!img){
        errors[6].classList.add('show')
        errors[6].textContent='Aucune selection'
        return
    }
    if(!img.type.startsWith('image/')){
        errors[6].classList.add('show')
        errors[6].textContent="format de fichier incorrect"
        return
    }
    const name=nameI.value+" image"
    const data=await img.arrayBuffer()
    console.log(img)
    imgDiv.textContent=img.name
    dataF=data
    nameF=name
    typeF=img.type
    idF  =user_names.length+1
})
async function createUser(){
    const user_name=user_nameI.value
    const name=nameI.value
    const prenom=prenomI.value
    const prof_img='/assets/avatar_profil_1.png'
    const email=emailI.value
    const password=passwordI.value
    const response=await fetch('/api/user/add',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({user_name,name,prenom,prof_img,email,password})
    })
    if(response.ok){
        await addImage(nameF,dataF,typeF,idF)
    }
}
async function addImage(name,data,type,id_user){
    await fetch('/api/image/add', {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Mime-Type": type,
      "X-id":id_user,
      "X-name":name
    },
    body: data
  })
}


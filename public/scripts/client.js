import { texteEstValide,emailEstValide } from "./validation.js"

const imgI=document.getElementById('prof-change')
const imgP=document.getElementById('image_profile')
const form=document.getElementsByClassName('add')[0]
const titleI=document.getElementById('title')
const linkI=document.getElementById('link')
const selects=document.getElementById('socials')
const errorsI=document.getElementsByClassName('error')
const listUl=document.getElementsByClassName('middle')[0]
const lignesI=document.getElementsByClassName('info-line')
const checksI=document.getElementsByClassName('check-line')
const tab=document.getElementById('tab-body')
const editI=document.getElementById('edit_title')
const modifyB=document.getElementById('modify')
const deleteB=document.getElementById('delete')

const modifyUserB=document.getElementById('update-button')
const formUser=document.getElementsByClassName('update-user')[0]
const modifyUserI=document.getElementById('update')
const cancelUpdate=document.getElementsByClassName('fa-close')[0]
const selectUser=document.getElementById('updated-alias')
const popUp=document.getElementsByClassName('pop-up')[0]
const popMessage=document.getElementById('mess')
const popJauge=document.getElementById('range')

const client=await getUser()
const source=new EventSource('/api/stream')
let id=0
let selected={}

async function showMessage(message){
    popMessage.textContent=message
    popJauge.style.width='100%'
    popUp.classList.add('show')
    setTimeout(()=>{
        for(let i=100;i>=0;i-=10){

            popJauge.style.width=i+"%"
        }
    },500) 
    setTimeout(()=>{
       popUp.classList.remove('show')
    },5500)   
}
const nightMode=document.getElementsByClassName('fa-moon')[0]
const share=document.getElementsByClassName('fa-share')[0]
let mode='day'

showMessage('Bienvenue '+client.name)

cancelUpdate.addEventListener('click',(e)=>{
    e.preventDefault()
    selectUser.value=""
    modifyUserI.value=""
    modifyUserB.classList.remove('hide')
    formUser.classList.remove('show')
})
nightMode.addEventListener('click',(e)=>{
    if(mode==='day'){
        mode='night'
        document.getElementsByTagName('body')[0].style.setProperty('background','url(/assets/Desert_Bloom_night.png)')
        document.getElementsByTagName('body')[0].style.setProperty('background-size','cover')
        document.getElementsByTagName('body')[0].style.setProperty('background-repeat','no-repeat')
        document.getElementsByTagName('body')[0].style.setProperty('background-attachment','fixed')
        return
    }
    mode='day'
    document.getElementsByTagName('body')[0].style.setProperty('background','url(/assets/Desert_Bloom_Arizona.png)')
    document.getElementsByTagName('body')[0].style.setProperty('background-size','cover')
    document.getElementsByTagName('body')[0].style.setProperty('background-repeat','no-repeat')
    document.getElementsByTagName('body')[0].style.setProperty('background-attachment','fixed')
})
share.addEventListener('click',async (e)=>{
    if(client){
        await navigator.clipboard.writeText(window.location.host+'/'+client.user_name)
            showMessage('Url copier dans le presse papier')
        return
    }
    await navigator.clipboard.writeText(window.location.href)
    
})

for(let i=0;i<checksI.length;i++){
    checksI[i].addEventListener('change',()=>{
        if(checksI[i].checked){
            selected= lignesI[i]
            editI.value=lignesI[i].children[2].textContent
        }
    })
}

modifyUserB.addEventListener('click',(e)=>{
    formUser.classList.add('show')
    modifyUserB.classList.add('hide')
})
deleteB.addEventListener('click',(e)=>{
    if(!selected.id){
        return
    }
    deleteLink()
})
modifyB.addEventListener('click',(e)=>{
    updateLink()
})
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    addLink()
})
formUser.addEventListener('submit',(e)=>{
    e.preventDefault()
    updateUser()
})
imgI.addEventListener('change',async (e)=>{
    e.preventDefault()
    const img=imgI.files[0]
    if(!img){
        return
    }
    if(!img.type.startsWith('image/')){
        return
    }
    const data=await img.arrayBuffer()
    await updateImage(data,img.type,client.id_user)
})
source.addEventListener('added-link',(e)=>{
    const data=(JSON.parse(e.data)).data
    tab.innerHTML+=`
        <tr class="info-line" id="${data.id}">
            <td><input type="checkbox" class="check-line"></td>
            <td>${data.icon}</td>
            <td>${data.title}</td>
            <td>${data.url}</td>
        </tr>
    `
    listUl.innerHTML+=`
        <li class="link" id="li${data.id}">
            <a href="${data.url}">
                <i class="fa fa-${data.icon}"></i>
                <p>${data.title}</p>
            </a>
        </li>
    `
})
source.addEventListener('deleted-link',(e)=>{
    const data=(JSON.parse(e.data)).data
    tab.removeChild(selected)
    listUl.removeChild(document.getElementById(`li${data.id}`))
})
source.addEventListener('updated-link',(e)=>{
    const data=(JSON.parse(e.data)).data
    document.getElementById(`${data.id}`).children[2].textContent=data.title
    document.getElementById(`li${data.id}`).children[0].children[1].textContent=data.title
})
source.addEventListener('updated-user',(e)=>{
    const data=(JSON.parse(e.data)).data
    switch(data.alias){
        case 'email':
            document.getElementById('email_profile').textContent=data.new_info
            break
        case 'prenom':
            document.getElementById('name_profile').textContent=client.name+' '+data.new_info
            break
        default:
            document.getElementById('name_profile').textContent=data.new_info+' '+client.prenom
            break
    }
})
source.addEventListener('updated-image',(e)=>{
    const data=(JSON.parse(e.data)).data
    if(data){
        imgP.src=data.data
        return
    }
    console.log('pas de donnée')
})
async function deleteLink(){
    id=Number.parseInt(selected.id)
    const response=await fetch('/api/link/delete',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id})
    })
    if(response.ok){
        showMessage('Lien supprimé avec succès')
    }
}
export async function getUser(){
    const response=await fetch('/api/user')
    if(response.ok){
        return await response.json()
    }
}
async function addLink(){
    errorsI[2].classList.remove('show')
    const title=titleI.value
    const url=linkI.value
    let icon=selects.value.toLowerCase()
    const id_user=client.id_user
  
    if(!texteEstValide(title) || !texteEstValide(url)){
        errorsI[2].textContent="valeure incorrecte"
        errorsI[2].classList.add('show')
        return
    }
    if(icon=="autre"){
        icon="link"
    }
    const response=await  fetch('/api/link/add',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({title,url,icon,id_user})
    })
    if(response.ok){
        showMessage('Lien créé avec succès')
        titleI.textContent=""
        linkI.textContent=""
    }
}
async function updateLink(){
    errorsI[3].classList.remove('show')
    const id=Number.parseInt(selected.id)
    const title=editI.value
    if(!texteEstValide(title)){
        errorsI[3].textContent="valeure incorrecte"
        errorsI[3].classList.add('show')
        return
    }
    const response=await fetch('/api/link/update',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id,title})
    })
    if(response.ok){
        showMessage('Modification de titre avec succès')
        editI.value=""
    }
}
async function updateUser(){
    errorsI[4].classList.remove('show')
    const alias=    selectUser.value
    const new_info= modifyUserI.value
    const user_name=client.user_name
    if(!texteEstValide(new_info)){
        errorsI[4].textContent='Valeure incorrecte'
        errorsI[4].classList.add('show')
        return
    }
    if(alias==='email'){
        if(!emailEstValide(new_info)){

            errorsI[4].textContent='email incorrecte'
            errorsI[4].classList.add('show')
            return 
        }
    }
    const response=await fetch('/api/user/update',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({user_name,alias,new_info})
    })
    if(response.ok){
        showMessage('Modification de compte éffectuer avec succès')
        modifyUserB.classList.remove('hide')
        formUser.classList.remove('show')
        selectUser.value=""
        modifyUserI.value=""

    }
}
async function updateImage(data,type,id_user){
    const response=await fetch('/api/image/update', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Mime-Type": type,
      "X-id":id_user
    },
    body: data
  })
    if(response.ok){
        showMessage('Image de profil modifié')
    }
}





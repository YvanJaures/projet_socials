import { texteEstValide } from "./validation.js"

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
const client=await getUser()
  console.log(client)
const source=new EventSource('/api/stream')
let id=0
let selected={}
for(let i=0;i<checksI.length;i++){
    console.log(checksI[i])
    console.log(client)

    checksI[i].addEventListener('change',()=>{
        if(checksI[i].checked){
            selected= lignesI[i]
            editI.value=lignesI[i].children[2].textContent
            console.log(selected)
        }
    })
}
deleteB.addEventListener('click',(e)=>{
    deleteLink()
})
modifyB.addEventListener('click',(e)=>{
    updateLink()
})
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    console.log('heyh')
    addLink()
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
async function deleteLink(){
    console.log(selected)
    id=Number.parseInt(selected.id)
    console.log(id)
    const response=await fetch('/api/link/delete',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id})
    })
    if(response.ok){
        alert('suppression')
    }
}
async function getUser(){
    const response=await fetch('/api/user')
    if(response.ok){
        return await response.json()
    }
}
async function addLink(){
    errorsI[0].classList.remove('show')
    const title=titleI.value
    const url=linkI.value
    const icon=selects.value.toLowerCase()
    const id_user=client.id_user
  
    if(!texteEstValide(title) || !texteEstValide(url)){
        errorsI[0].textContent="valeure incorrecte"
        errorsI[0].classList.add('show')
        return
    }
    const response=await  fetch('/api/link/add',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({title,url,icon,id_user})
    })
    if(response.ok){
        alert('Created link')
        titleI.textContent=""
        linkI.textContent=""
    }
}
async function updateLink(){
    const id=Number.parseInt(selected.id)
    console.log(selected)
    console.log(id)
    const title=editI.value
    const response=await fetch('/api/link/update',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id,title})
    })
    if(response.ok){
        alert('modification de titre')
        editI.value=""
    }
}




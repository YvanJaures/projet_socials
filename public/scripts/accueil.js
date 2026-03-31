const listUl=document.getElementsByClassName('middle')[0]
const imgP=document.getElementById('image_profile')
const source=new EventSource('/api/stream')
const popUp=document.getElementsByClassName('pop-up')[0]
const popMessage=document.getElementById('mess')
const popJauge=document.getElementById('range')

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

source.addEventListener('updated-image',(e)=>{
    const data=(JSON.parse(e.data)).data
    if(data){
        imgP.src=data.data
        return
    }
    console.log('pas de donnée')
})
source.addEventListener('added-link',(e)=>{
    const data=(JSON.parse(e.data)).data
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
    listUl.removeChild(document.getElementById(`li${data.id}`))
})
source.addEventListener('updated-link',(e)=>{
    const data=(JSON.parse(e.data)).data
    document.getElementById(`li${data.id}`).children[0].children[1].textContent=data.title
})
const nightMode=document.getElementsByClassName('fa-moon')[0]
const share=document.getElementsByClassName('fa-share')[0]
let mode='day'
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
    
    await navigator.clipboard.writeText(window.location.href)
    await showMessage('Lien copié dans le presse-papier!')
    
})

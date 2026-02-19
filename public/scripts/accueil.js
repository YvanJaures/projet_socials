const listUl=document.getElementsByClassName('middle')[0]
const source=new EventSource('/api/stream')

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
const deleteButton = document.querySelector("#delete-button")
const messageDiv = document.querySelector('#message')
const thumbText = document.querySelectorAll('#likeButton')

Array.from(thumbText).forEach((element)=>{
    element.addEventListener('click', addLike)
})

deleteButton.addEventListener('click', _ => {
    fetch('/blogPost', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: ''
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        if (data === 'No blank posts at this time') {
            messageDiv.textContent = 'No blank posts to delete'
        } else {
            window.location.reload()  
        }
    })
})

// async function addLike(){
//     const sName = this.parentNode.childNodes[1].innerText
//     const bMessage = this.parentNode.childNodes[3].innerText
//     const tLikes = Number(this.parentNode.childNodes[5].innerText)
//     try{
//         const response = await fetch('addOneLike', {
//             method: 'put',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//               'nameS': sName,
//               'messageS': bMessage,
//               'likesS': tLikes
//             })
//           })
//         const data = await response.json()
//         console.log(data)
//         location.reload()

//     }catch(err){
//         console.log(err)
//     }
// }

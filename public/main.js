const deleteButton = document.querySelector("#delete-button")
const messageDiv = document.querySelector('#message')
const thumbText = document.querySelectorAll('#likeButton')
const deletePosts = document.querySelectorAll('#deletePost')
const post = document.querySelectorAll('#eachPost')

// console.log(post)

Array.from(thumbText).forEach((element)=>{
    element.addEventListener('click', addLike)
})

Array.from(deletePosts).forEach((element)=>{
    element.addEventListener('click', deletePost)
})

async function deletePost(){
    const itemID = this.parentNode.childNodes[1].innerText
    console.log(itemID)
    try{
        const response = await fetch('dashboard/deletePost', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'ObjectId': `${itemID}`
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
async function addLike(){
    const itemID = this.parentNode.childNodes[1].innerText
    const tLikes = Number(this.parentNode.childNodes[11].innerText)
    try{
        const response = await fetch('dashboard/addOneLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'ObjectId': itemID,
                'likesS': tLikes
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}


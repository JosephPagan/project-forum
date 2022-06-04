const deleteButton = document.querySelector("#delete-button")
const messageDiv = document.querySelector('#message')

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
const url = 'http://192.168.100.5:5000'
window.addEventListener('DOMContentLoaded', async () => {
    if (!user) return location.href = '/client'
    const lastSelectedChat = localStorage.getItem('chat')
    const sideBar = document.querySelector('.sideBar')
    const response = await (await fetch(url + '/chats?id=' + user.id)).json()
    const headingAvatarIcon = document.querySelector('.heading-avatar-icon')
    const replySend = document.querySelector('.reply-send');
    
                    // initialize 
    // avatar
    const avatar = document.createElement('img')
    avatar.src = user.avatar
    headingAvatarIcon.append(avatar)

    // last clicked chat
    if (lastSelectedChat == null){
        conversation.style.display = 'none'
    } else {
        changeChat(JSON.parse(lastSelectedChat))
    }

    let { chats } = response;
    chats.forEach(async chat => {
        const chatUser = await (await fetch(url + '/users?id=' + chat.id)).json()

        const body = createUser(chatUser)
        sideBar.append(body)
    })

    const composeSideBar = document.querySelector('.compose-sideBar')
    // all chats
    let allChats = await (await fetch(url + '/users')).json();
    allChats.forEach(chat => {
        if (chat.id != user.id){
            const body = createUser(chat)
            composeSideBar.append(body)
        }
    })

    replySend.addEventListener('click', async () => {
        const comment = document.querySelector('#comment');
        let text = comment.value.trim();
        if (!text) return

        const data = JSON.parse(localStorage.getItem('chat'))
        let response = await (await fetch(url + '/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                users: [ user.id, data.id ],
                from: data.id,
                text
            })
        })).json()
        
        if (response.OK == false) {
            return alert(response.message)
        }

        console.log(response);

        comment.value = null
    })
})
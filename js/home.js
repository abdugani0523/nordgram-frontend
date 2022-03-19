const url = 'http://localhost:4500'
let userId = sessionStorage.getItem('userId')
const conversation = document.querySelector('.conversation')
const conversationM = document.querySelector('#conversation')
let allUsers
let chats
let response
let messagesLength;

window.addEventListener('DOMContentLoaded', async () => {
    // check
    let user = await (await fetch(url + `/users?id=${userId}`)).json()
    if (!user.ok) {
        sessionStorage.removeItem('userId')
        return (location.href = '/')
    }
    user = user.data

    const sideBar = document.querySelector('.sideBar')
    const headingAvatarIcon = document.querySelector('.heading-avatar-icon')
    const replySend = document.querySelector('.reply-send')

    // initialize
    // avatar
    const composeSideBar = document.querySelector('.compose-sideBar')
    const avatar = document.createElement('img')
    avatar.src = user.avatar
    headingAvatarIcon.append(avatar)

    // implement chats
    setInterval(async () => {
        response = await (await fetch(url + `/chats?member=${userId}`)).json()
        const to = sessionStorage.getItem('chatId')
        let { data } = response

        // get new user update
        let { data: dataT } = await (await fetch(url + '/users')).json()
        if (allUsers?.length != dataT.length || chats?.length != data.length) {
            allUsers = dataT
            composeSideBar.innerHTML = null
            allUsers.forEach((someuser) => {
                const find = response?.data?.find(
                    (item) => item?.partner == someuser.id
                )
                if (someuser.id != user.id && !find) {
                    const body = createUser(someuser)
                    composeSideBar.append(body)
                }
            })
        }

        // get new chat update
        if (chats?.length != data.length) {
            chats = data
            sideBar.innerHTML = null
            chats.forEach(async (chat) => {
                const { data: partner } = await (
                    await fetch(url + '/users?id=' + chat.partner)
                ).json()

                const body = createUser(partner)
                sideBar.append(body)
            })
        }

        const currentChat = data.find(chat => chat.partner == to)
        if (messagesLength != currentChat?.messages?.length) {
            updateMessages(currentChat.messages)
        }

    }, 500)

    replySend.addEventListener('click', async () => {
        const comment = document.querySelector('#comment')
        let text = comment.value.trim()
        const to = sessionStorage.getItem('chatId')
        if (!to) return alert('Warning!')
        if (!text) return

        let response = await (
            await fetch(url + '/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: +userId,
                    to: +to,
                    text,
                }),
            })
        ).json()

        if (response.OK == false) {
            return alert(response.message)
        }

        comment.value = null
    })

    // search boxes
    const searchText = document.querySelector('#searchText')
    const composeText = document.querySelector('#composeText')
    searchText.addEventListener('keyup', () =>
        filterSideBar(sideBar, searchText.value)
    )
    composeText.addEventListener('keyup', () =>
        filterSideBar(composeSideBar, composeText.value)
    )
})

function filterSideBar(side, input) {
    for (let child of side.children) {
        const span = child.querySelectorAll('span')
        let fullname = ''
        span.forEach((item) => (fullname += item.textContent))
        if (!fullname.toLowerCase().includes(input.toLowerCase())) {
            child.setAttribute('style', 'display:none;')
        } else {
            child.removeAttribute('style')
        }
    }
}

async function changeChat(data) {
    conversation.removeAttribute('style')

    // get needed elements
    const headingAvatarIcon = document.querySelectorAll(
        '.heading-avatar-icon'
    )[1]
    const headingNameMeta = document.querySelector('.heading-name-meta')

    // change ui
    headingAvatarIcon.firstElementChild.setAttribute('src', data.avatar)
    headingNameMeta.textContent = data.firstname + ' ' + data.lastname

    // change messages
    conversationM.innerHTML = null

    // get messages
    const findMessages = response?.data?.find((item) => item.partner == data.id)

    if (!findMessages) return

    let { messages } = findMessages

    updateMessages(messages)
}

function createElements(...tags) {
    return tags.map((tag) => document.createElement(tag))
}

function createUser(data) {
    let [
        body,
        avatar,
        avatarIcon,
        icon,
        main,
        row,
        name,
        nameMeta,
        time,
        pullRight,
    ] = createElements(
        'div',
        'div',
        'div',
        'img',
        'div',
        'div',
        'div',
        'span',
        'div',
        'span'
    )
    body.classList.add('row', 'sideBar-body')
    avatar.classList.add('col-sm-3', 'col-xs-3', 'sideBar-avatar')
    avatarIcon.classList.add('avatar-icon')
    main.classList.add('col-sm-9', 'col-xs-9', 'sideBar-main')
    row.classList.add('row')
    name.classList.add('col-sm-8', 'col-xs-8', 'sideBar-name')
    nameMeta.classList.add('name-meta')
    time.classList.add('col-sm-4', 'col-xs-4', 'pull-right', 'sideBar-time')
    pullRight.classList.add('time-meta', 'pull-right')
    icon.src = data.avatar

    nameMeta.textContent = data.firstname + ' ' + data.lastname
    pullRight.textContent = '@' + data.username

    avatarIcon.append(icon)
    avatar.append(avatarIcon)
    name.append(nameMeta)
    time.append(pullRight)
    row.append(name, time)
    main.append(row)
    body.append(avatar, main)

    body.addEventListener('click', () => {
        // save to localstorage
        sessionStorage.setItem('chatId', data.id)
        changeChat(data)
    })

    return body
}

function updateMessages(messages) {
    messagesLength = messages.length
    conversationM.innerHTML = null
    messages.forEach((message) => {
        let who = 'receiver'
        if (message.from == userId) who = 'sender'

        let [messageBody, messageMain, messageOwner, messageText, messageTime] =
            createElements('div', 'div', 'div', 'div', 'span')

        messageBody.classList.add('row', 'message-body')
        messageMain.classList.add('col-sm-12', 'message-main-' + who)
        messageOwner.classList.add(who)
        messageText.classList.add('message-text')
        messageTime.classList.add('message-time', 'pull-right')

        messageText.textContent = message.text
        messageTime.textContent = message.date.localeTime

        messageOwner.append(messageText, messageTime)
        messageMain.append(messageOwner)
        messageBody.append(messageMain)
        conversationM.append(messageBody)
    })
}
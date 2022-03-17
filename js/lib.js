const conversation = document.querySelector('.conversation') 
const user = JSON.parse(localStorage.getItem('user'))

function createUser(data){
    let [ body, avatar, avatarIcon, icon, main, row, name, nameMeta, time, pullRight] = createElements('div', 'div', 'div', 'img', 'div', 'div', 'div', 'span', 'div', 'span')
    body.classList.add("row", "sideBar-body")
    avatar.classList.add("col-sm-3", "col-xs-3", "sideBar-avatar")
    avatarIcon.classList.add("avatar-icon")
    main.classList.add("col-sm-9", "col-xs-9", "sideBar-main")
    row.classList.add("row")
    name.classList.add("col-sm-8", "col-xs-8", "sideBar-name")
    nameMeta.classList.add("name-meta");
    time.classList.add("col-sm-4", "col-xs-4", "pull-right", "sideBar-time");
    pullRight.classList.add("time-meta", "pull-right");
    icon.src = data.avatar;

    nameMeta.textContent = data.username;
    pullRight.textContent = "19:00"

    avatarIcon.append(icon)
    avatar.append(avatarIcon)
    name.append(nameMeta)
    time.append(pullRight)
    row.append(name, time)
    main.append(row)
    body.append(avatar, main)

    body.addEventListener('click', () => {
        console.log('Hello I am ' + data.username);
        
        // save to localstorage
        localStorage.setItem('chat', JSON.stringify(data))
        changeChat(data)
    })

    return body
}

async function changeChat(data){
    // get needed elements
    console.log(conversation.style.display);
    if (conversation.style.display == 'none') {
        conversation.style.display = 'block';
        console.log(true);
    }
    
    const headingAvatarIcon = document.querySelectorAll('.heading-avatar-icon')[1];
    const headingNameMeta = document.querySelector('.heading-name-meta');
    
    // change ui
    headingAvatarIcon.firstElementChild.setAttribute('src', data.avatar);
    headingNameMeta.textContent = data.username

    // change messages
    const conversationM = document.querySelector('#conversation');
    conversationM.innerHTML = null

    // get messages
    let response = await (await fetch(url + '/messages?users=' + user.id + ',' + data.id)).json()
    if (response.OK == false) {
        response = await (await fetch(url + '/messages?users=' + data.id + ',' + user.id)).json()
    }

    if (response.OK != true) return
    
    let { messages } = response
    console.log(messages);

    messages.forEach(message => {
        let who = "sender";
        if (message.from == user.id){
            who = 'receiver';
        }
        let [messageBody, messageMain, messageOwner, messageText, messageTime] = createElements('div', 'div', 'div', 'div', 'span')

        messageBody.classList.add('row', 'message-body')
        messageMain.classList.add('col-sm-12', 'message-main-' + who)
        messageOwner.classList.add(who)
        messageText.classList.add('message-text')
        messageTime.classList.add('message-time', 'pull-right')
        
        messageText.textContent = message.text
        messageTime.textContent = 'Sun'

        messageOwner.append(messageText, messageTime)
        messageMain.append(messageOwner)
        messageBody.append(messageMain)
        conversationM.append(messageBody)
    })
}

function createElements(...tags){
    return tags.map(tag => document.createElement(tag))
}
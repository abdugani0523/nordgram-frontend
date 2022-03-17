window.addEventListener('DOMContentLoaded', async () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const signInForm = document.querySelector('#sign-in')
    const signUpForm = document.querySelector('#sign-up')

    // is already sign in? 
    if (localStorage.getItem("user")){
        return location.href = 'home-page.html'
    }

    // get usernames

    signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));

    signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

    signInForm.addEventListener('submit',async event => {
        // freeze
        event.preventDefault()

        const [ username, password ] = document.querySelectorAll('#sign-in input')
        let find = await (await fetch(url + `/users?username=${username.value}&password=${password.value}`)).json()
        console.log(find);


        if (!find.OK) return alert('Incorrect username or password!')

        window.localStorage.setItem('user', JSON.stringify(find))

        location.href = 'home-page.html'

        // clear input
        username.value = null
        password.value = null
    })

    const [ username, age, password ] = document.querySelectorAll('#sign-up input')
    username.addEventListener('input', async () => {
        let find = await (await fetch(url + `/users?username=${username.value}`)).json()
        if (find.OK){
            return username.style.border = '2px solid red'
        }
        username.style.border = 'none'
    })

    password.addEventListener('input', async () => {
        if (password.value.length < 5) return password.style.border = '2px solid red'

        if (password.value.length < 8) return password.style.border = '2px solid yellow'
        
        password.style.border = 'none'
    })
    signUpForm.addEventListener('submit',async event => {
        // freeze
        event.preventDefault()

        let find = await (await fetch(url + `/users?username=${username.value}`)).json()
        if (find.OK) return alert('This username already exists!')
        if (password.value.length < 8) return alert(' The password must be strong!')
        console.log(url + '/users');
        let response = await (await fetch(url + '/users', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                age: +age.value,
                password: password.value 
            })
        })).json()
        window.localStorage.setItem('user', JSON.stringify(response.data))

        // location.href = 'home-page.html'

        // clear input
        username.value = null
        password.value = null
        age.value = null
    })
    
})
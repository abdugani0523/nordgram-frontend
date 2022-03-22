const url = 'https://nordgram-backend.herokuapp.com'
window.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId')
    if (userId) return (location.href = '/home')

    const logInForm = document.querySelector('#login form')
    const signUpForm = document.querySelector('#signup form')

    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const [firstname, lastname, username, age, password] = document.querySelectorAll('#register')
        const gender = document.querySelector('#gender')

        if (username.value.includes(' ')) return alert('Invalid username!')

        const newUser = {
            firstname: firstname.value,
            lastname: lastname.value,
            age: +age.value,
            username: username.value,
            password: password.value,
            gender: gender.value == 'male' ? true : false,
        }

        const response = await (
            await fetch(url + '/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            })
        ).json()
        if (!response.ok)
            return alert('This username already exists! ' + response.msg)

        setUser(response.data.id)
    })

    logInForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const [username, password] = document.querySelectorAll('#signin')

        const response = await (
            await fetch(
                url +
                    `/users?username=${username.value}&password=${password.value}`
            )
        ).json()
        if (!response.ok) return alert('Incorrect username or password!')

        setUser(response.data.id)
    })
})

function setUser(userId) {
    sessionStorage.setItem('userId', userId)
    location.href = '/home'
}


const LoginRequest = async function Login(username,password) {
    let res = await fetch("http://127.0.0.1:4001/login", {
        method: "POST",
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(res => res.json())
    .catch(error => {
        console.log(error)
    })
    return res
}
module.exports = {
    LoginRequest: LoginRequest
}

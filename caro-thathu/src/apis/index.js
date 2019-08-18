
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
const RegisterRequest = function Register(username,password,email) {
    console.log(username,password,email);
    let res = fetch("http://127.0.0.1:4001/register", {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "username": username,
            "password": password,
            "email": email
        })
    })
    .then(res => res)
    .catch(error => {
        console.log(error)
    })
    return res;
    // axios.post(`http://127.0.0.1:4001/register`,{
    //         username: username,
    //         password: password,
    //         email: email
    // })
    // .then(res=>{
    //     console.log(res);
    //     console.log(res.data);
    // })
}
module.exports = {
    LoginRequest: LoginRequest,
    RegisterRequest: RegisterRequest
}


const LoginRequest = async function Login(username,password) {
    console.log("API: LoginRequest");
    let res = await fetch("http://127.0.0.1:4001/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(res => res.json())
    .catch(error => {
        console.log(error)
        return null;
    })
    return res;
}
const RegisterRequest = async function Register(username,password,email) {
    console.log('API: RegisterRequest');
    let res = await fetch("http://127.0.0.1:4001/register", {
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
        console.log(error);
    })
    return res;
}

const LeaderboardRequest = async (token)=>{
    console.log('API: LeaderboardRequest');
    let res = await fetch("http://127.0.0.1:4001/register",{
        method:'GET',
        headers:{'Authorization':token}
    })
    .then((users)=>{
        return users.json();
    })
    .catch(err=>{
        console.log(err);
    })
    return res;
}
const WaitingRoomGamesRequest = async (token)=>{
    console.log('API: WaitingRoomGamesRequest');
    let res = await fetch("http://127.0.0.1:4001/waitinggames",{
        method:'GET',
        headers:{'Authorization':token}
    })
    .then((roomGames)=>{
        return roomGames.json();
    })
    .catch(err=>{
        console.log(err);
    })
    return res;
}
module.exports = {
    LoginRequest: LoginRequest,
    RegisterRequest: RegisterRequest,
    LeaderboardRequest:LeaderboardRequest,
    WaitingRoomGamesRequest:WaitingRoomGamesRequest
}

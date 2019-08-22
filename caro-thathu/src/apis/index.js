
import axios from 'axios'

export const LoginRequest = async function Login(username,password) {
    console.log("API: LoginRequest");
    let data = {
        username: username,
        password: password
    }
    let config={
        headers:{
            'Content-Type': 'application/json'
        }
    }
    let res = await axios.post("http://127.0.0.1:4001/login",data,config)
    .then(res=>  res.data)
    .catch(error=>{
        console.log(error)
        return null;
    })
    return res;
}
export const RegisterRequest = async function Register(username,password,email) {
    console.log('API: RegisterRequest');
    let data = {
        username: username,
        password: password,
        email: email
    }
    let config={
        headers:{
            'Content-Type': 'application/json'
        }
    }
    let res = await axios.post("http://127.0.0.1:4001/register",data,config)
    .then(res => res.data)
    .catch(error => {
        console.log(error);
        return null;
    })
    return res;

}

export const LeaderboardRequest = async (token)=>{
    console.log('API: LeaderboardRequest');
    let config={
        headers:{
            'Authorization':token
        }
    }
    let res = await axios.get("http://127.0.0.1:4001/leaderboard",config)
    .then(res => res.data)
    .catch(error => {
        console.log(error);
        return null;
    })
    return res;

}
export const WaitingRoomGamesRequest = async (token)=>{
    console.log('API: WaitingRoomGamesRequest');
    let config={
        headers:{
            'Authorization':token
        }
    }
    let res = await axios.get("http://127.0.0.1:4001/games",config)
    .then(res => res.data)
    .catch(error => {
        console.log(error);
        return null;
    })
    return res;

}
export const CreateRoomGameRequest = async(token,hostId,hostName,bettingGolds)=>{
    console.log("API: CreateRoomGameRequest");
    let data={
        host_id:hostId,
        host_name:hostName,
        betting_golds:bettingGolds
    }
    let config={
        headers:{
            'Authorization':token
        }
    }
    let res = await axios.post("http://127.0.0.1:4001/games",data,config)
    .then(res => res.data)
    .catch(error => {
        console.log(error);
        return null;
    })
    return res;
    
}


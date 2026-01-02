import axios from "axios"




export  async function signUp(email:String,username:String,password:String){
        const res = await axios.post('http://localhost:8080/api/v1/auth/signup',{email,password,username},{withCredentials:true});
}


export  async function logIn(email:String,password:String){
        const res = await axios.post('http://localhost:8080/api/v1/auth/login',{email,password},{withCredentials:true});
        console.log(res);
        
}
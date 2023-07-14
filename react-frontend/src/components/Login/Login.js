import React, { useEffect, useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import "../../styles/login.css"
function Login() {
  const nav=useNavigate();
  const[username,setUsername]=useState('');
  const[password,setpassword]=useState('');
  const[user,setUser]=useState('');
  const fetchData = () => {
    return fetch("http://localhost:8080/login/get")
    .then((response) => response.json())
    .then((data) => setUser(data));
  }
  useEffect(() => {
    fetchData();
  },[])
  const authenticate=(e)=>{
    e.preventDefault();
  const usercheck = user.find(user => (user.username === username && user.password === password));
 if(username.length===0){
  alert("Enter Username")
 }
 else if(password.length===0){
  alert("Enter password")
 }
  else if(!usercheck){
    alert("Wrong Username or Password!")
  }
  else {
    nav("/home")
  }
}
  return (
    <div id="login-body">
    <div className="login-form">
    <div className="container">
      <div className="header">
      <h1>Bus Management System</h1>
        <p>Enter Credentials For Login</p>
      </div>
      <form>
        <div className="input">
          <i class="ri-user-fill"></i>
          <input type="text" onChange={(e)=>setUsername(e.target.value)} placeholder="Username" />
        </div>
        <div className="input">
        <i class="ri-key-fill"></i>
          <input type="password" onChange={(e)=>setpassword(e.target.value)} placeholder="Password" />
        </div>
        <input onClick={authenticate} className="signup-btn" type="submit" value="LOGIN" />
      </form>
    </div>
  </div>
  </div>
  )
}

export default Login;
import React, { useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import './Login.css';
import Home from './Home.js'
import Register from './Register.js'
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const goToHome = (user) => {
    navigate('/home');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: email,
        password: password,
    }, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000/'
        }
    });
      console.log(response.data)
      goToHome(response.data);
    } catch (error) {
      console.error(error.response)
      alert('Login failed, please try again');
    }
  };

  return (
    <div id="App">
      <div id="login-container">
        <h2>Login</h2>
        <form>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="button" onClick={handleLogin}>
            Login
          </button>
          <button type="button" onClick={goToRegister}>
            Register
          </button>
          <Routes>
            <Route path="/home" element={<Home />}/>
            <Route path="/register" element={<Register />}/>
          </Routes>
        </form>
      </div>
    </div>
  );
}

export default Login;
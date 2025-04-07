import React, { useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import './Login.css';
import Home from './Home.js'
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/home');
  };
  const [buttonColor1, setButtonColor1] = useState('red');
  const [buttonColor2, setButtonColor2] = useState('red');

  const goToLogin = () => {
    navigate('/')
  }
  
  const handleCalibrationClick = async () => {
    // Change the button color to green when clicked
    {axios.get('http://127.0.0.1:8000/start_calibration')
      .then(response => {
          console.log(response)
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
      };
    //alert("Please download calibration software at: https://github.com/faiz625/Capstone-2023 and enter the email you will use to register");
  };

  const handleFaceRecognitionClick = async () => {
    // Change the button color to green when clicked
    {axios.get('http://127.0.0.1:8000/start_faceRecognition')
      .then(response => {
          console.log(response)
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
      };
    //alert("Please download calibration software at: https://github.com/faiz625/Capstone-2023 and enter the email you will use to register");
  };

  const handleRegister = async () => {
    if (email.includes("@") && password.length > 6 && confirmPassword === password) {
      try {
        const response = await axios.post('http://localhost:5000/register', {
          username: email,
          password: password,
        });
  
        //console.log(response.data); // Log the server response
        alert('Registration Complete');
        goToLogin();
      } catch (error) {
        alert('Registration failed:', error.response);
      }
    } else {
      alert('Error: Registration credentials are incorrect');
    }
  };

  return (
    
    <div id="App">
      <div id="login-container">
        <h2>Register</h2>
        <form>
          <label htmlFor="username">Email:</label>
          <input
            type="text"
            id="username"
            name="username"
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

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div>
            <button
              style={{ border: `2px solid ${buttonColor1}`, color: buttonColor1 }}
              onClick={handleCalibrationClick}
            >
              Mouse Calibration
            </button>
          </div>
          
          <div>
            <button
              style={{ border: `2px solid ${buttonColor2}`, color: buttonColor2 }}
              onClick={handleFaceRecognitionClick}
            >
              Facial Recognition
            </button>
          </div>
          <button type="button" onClick={handleRegister}>
            Register
          </button>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </form>
      </div>
    </div>
  );
}

export default Register;
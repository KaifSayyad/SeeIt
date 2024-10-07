import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
import { toast } from 'react-toastify';
import '../assets/styles/Login.css';
import api from '../services/api';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // To navigate between routes


  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);


  const handleLogin = async () => {
    if (email && password) {
      try {
        console.log('wating for response');
        const response = await api.post(`/auth/login`, {
          email : email,
          password : password
        });
        console.log('response', response);
        localStorage.setItem('userId', response.data.userId);
        window.location.href = '/upload';
      } catch (err) {
        console.log(err.response?.data?.message || 'An error occurred');
        toast.error(err.response?.data?.message || 'An error occurred', {
          position: 'top-center',
          autoClose: 4000,
        });
      }
    }
  };

  const handleNavigateSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="form-container">
      <form className="form-card">
        <h2>Login</h2>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="button" onClick={handleLogin} className="form-button"> Login </button>
        <button type="button" onClick={handleNavigateSignup} className="signup-button"> Sign Up </button>
      </form>
    </div>
  );
};

export default Login;

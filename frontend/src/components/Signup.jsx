import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/styles/Signup.css';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();


  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", { position: 'top-center', autoClose: 4000 });
      return;
    }

    try {
      const response = await api.post(`/auth/signup`, {
        name : name,
        email : email,
        password : password
      });
      localStorage.setItem('userId', response.data.userId);
      window.location.href = '/upload';
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred', {
        position: 'top-center',
        autoClose: 4000,
      });
    }
  };

  const handleNavigateLogin = () => {
    navigate('/');
  }

  return (
    <div className="form-container">
      <form className="form-card">
        <h2>Signup</h2>
        <div className="input-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="button" onClick={handleSignup} className="form-button">Signup</button>
        <button type="button" onClick={handleNavigateLogin} className="form-button" >Login</button>
      </form>
    </div>
  );
};

export default Signup;

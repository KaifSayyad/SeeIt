import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import HomeScreen from './components/HomeScreen';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ImageUpload from './components/ImageUpload';
import ImagesPage from './components/ImagesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<ImageUpload />} />
          <Route path="/images" element={<ImagesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

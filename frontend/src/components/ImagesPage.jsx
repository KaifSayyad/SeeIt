import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
// import api from '../services/api';
import '../assets/styles/ImagesPage.css';

const ImagesPage = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Replace 'userId' with the actual user ID from local storage or context
        const userId = localStorage.getItem('userId');
        // console.log('Found userId', userId);
        if (!userId) {
          setError('User not logged in.');
          return;
        }

        const response = await axios.get(`${API_URL}/images/getImages/${userId}`);
        setImages(response.data.images);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch images.');
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="images-page-container">
      <h1>Your Images</h1>
      {error && <p>Error: {error}</p>}
      <div className="image-grid">
        {images.length > 0 ? (
          images.map((url, index) => (
            <div key={index} className="image-card">
              <img src={url} alt={`Image ${index}`} />
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
  
};

export default ImagesPage;

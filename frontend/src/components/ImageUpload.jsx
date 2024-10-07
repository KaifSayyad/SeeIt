import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
// import api from '../services/api';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/ImageUpload.css';
import axios from 'axios';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const isImageUploadedRef = useRef(false); // Use ref for isImageUploaded state
  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Set image preview URL
      setError('');
      isImageUploadedRef.current = false; // Reset ref
      setAudioUrl(null);
    } else {
      setImage(null);
      setImagePreview(null); // Clear preview
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image to upload.');
      toast.error('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      // Upload image and get the audio stream
      console.log('Sending image to server....');
      const response = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expect a binary blob for audio
      });

      // Create a URL for the audio blob
      const audioBlob = response.data;
      const audioUrl = window.URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // Play the audio
      const audioElement = new Audio(audioUrl);
      audioElement.play();

      // Mark image as uploaded
      isImageUploadedRef.current = true;
      toast.success('Image uploaded successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
      toast.error('Upload failed.');
    }
  };

  const handleSave = async () => {
    if (!image) {
      setError('Please upload an image before saving.');
      toast.error('Please upload an image before saving.');
      return;
    }

    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', userId); // Append userId to formData

    try {
      // Send the image to the backend to be saved
      await axios.post(`${API_URL}/images/save`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Image saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save the image.');
      toast.error('Failed to save the image.');
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreview && (
        <div style={{ marginTop: '20px' }}>
          <p>Image Preview:</p>
          <img src={imagePreview} alt="Preview" style={{ width: '300px', height: 'auto' }} />
        </div>
      )}
      <button onClick={handleUpload} style={{ marginTop: '20px' }}>Upload</button>
      {audioUrl && (
        <div>
          <p>Audio generated from image:</p>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
      {isImageUploadedRef.current && (
        <button onClick={handleSave} style={{ marginTop: '20px' }}>Save Image</button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ImageUpload;

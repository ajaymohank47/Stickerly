// src/App.js
import React, { useState, useRef } from 'react';
import './App.css';

const stickersList = [
  'https://placekitten.com/160/160',
  'https://placebear.com/160/160',
  'https://placebeard.it/160x160',
];

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function makeStickers(file) {
    setError('');
    setTimeout(() => {
      setStickers(stickersList);
    }, 1500);
  }

  const onFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImageFile(null);
      setStickers([]);
      return;
    }
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setImageFile(URL.createObjectURL(file));
    makeStickers(file);
  };

  const onClear = () => {
    setImageFile(null);
    setStickers([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="container">
      <h1>💕 Stickerly 💕</h1>

      <div className="controls">
        <label className="custom-file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            ref={fileInputRef}
          />
          Upload Photo
        </label>

        <button onClick={onClear} disabled={!imageFile}>
          Clear
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="preview-area">
        <div className="preview-wrapper">
          <div className="preview">
            {imageFile ? (
              <img src={imageFile} alt="Uploaded" className="preview-img" />
            ) : (
              <div className="placeholder">Upload your photo here!</div>
            )}
          </div>
          <p className="note">Original Photo</p>
        </div>

        <div className="preview-wrapper">
          <div className="preview">
            {stickers.length > 0 ? (
              stickers.map((src, i) => (
                <div key={i} className="sticker-card">
                  <img src={src} alt={`Sticker ${i + 1}`} className="sticker-img" />
                  <a href={src} download={`sticker-${i + 1}.png`} className="download-link">
                    Download
                  </a>
                </div>
              ))
            ) : (
              <div className="placeholder">Stickers will appear here</div>
            )}
          </div>
          <p className="note">Your Special Stickers</p>
        </div>
      </div>

      <p className="footer-note">Made with 💕 for you.</p>
    </div>
  );
}

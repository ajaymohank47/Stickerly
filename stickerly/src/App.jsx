// src/App.js
import React, { useState, useRef } from 'react';
import './App.css';

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStickers([]);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setStickers([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setStickers([]);

    const formData = new FormData();
    formData.append('photo', imageFile);
    formData.append('variants', 4);

    try {
      console.log('🎨 Generating kawaii stickers...');
      const res = await fetch('http://localhost:4000/api/generate-stickers', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Sticker generation failed');
      }

      if (!data.stickers || data.stickers.length === 0) {
        throw new Error('No stickers were generated');
      }

      console.log(`✅ Generated ${data.stickers.length} kawaii stickers!`);
      setStickers(data.stickers);
    } catch (err) {
      console.error('❌ Sticker generation error:', err);
      setError(err.message || 'Failed to generate stickers. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>💕 Stickerly 💕</h1>

      <div className="controls">
        <label className="custom-file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          Upload Photo
        </label>

        <button onClick={handleSubmit} disabled={!imageFile || loading}>
          {loading ? 'Creating Kawaii Magic...' : 'Make Kawaii Sticker'}
        </button>

        <button onClick={handleClear} disabled={!imageFile && !stickers.length}>
          Clear
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="preview-area">
        <div className="preview-wrapper">
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded" className="preview-img" />
          ) : (
            <div className="placeholder">Upload your photo here!</div>
          )}
          <p className="note">Original Photo</p>
        </div>

        <div className="preview-wrapper">
          {stickers.length > 0 ? (
            <div className="preview">
              {stickers.map((src, i) => (
                <div key={i} className="sticker-card">
                  <img src={src} alt={`Sticker ${i + 1}`} className="sticker-img" />
                  <a
                    href={src}
                    download={`sticker-${i + 1}.png`}
                    className="download-link"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder">
              {loading ? 'Creating kawaii magic... ✨' : 'Your cute kawaii sticker will appear here!'}
            </div>
          )}
          <p className="note">Your Cute Kawaii Sticker</p>
        </div>
      </div>

      <p className="footer-note">Made with 💕 for you.</p>
    </div>
  );
}

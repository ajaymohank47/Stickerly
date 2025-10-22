import { useState, useRef } from 'react';
import './App.css';

// Free AI-powered kawaii sticker generator - no API keys needed!

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



  // Generate kawaii sticker using multiple free AI services
  const generateKawaiiSticker = async () => {
    const kawaiiPrompts = [
      "kawaii chibi anime girl with annoyed pouty expression, oversized head, tiny body, huge sparkling eyes with star highlights, thick black outlines, adorable purple hoodie, plain white background, chibi proportions, anime art style, sticker design, masterpiece quality",
      "cute kawaii anime character with annoyed expression, big head small body, huge eyes with highlights, bold clean outlines, vibrant pastel colors, soft shading for depth, white background, chibi style, high quality",
      "kawaii chibi person with annoyed face, oversized head, tiny body, sparkling eyes, cute pouty expression, thick black borders, colorful anime style, white background, sticker design, detailed",
      "anime kawaii girl annoyed expression, chibi proportions, big sparkling eyes, bold outlines, vibrant colors, exaggerated cute features, white background, sticker style, masterpiece"
    ];

    const randomPrompt = kawaiiPrompts[Math.floor(Math.random() * kawaiiPrompts.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    // Try multiple free AI services
    const services = [
      {
        name: "Pollinations AI",
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(randomPrompt)}?width=512&height=512&seed=${randomSeed}&model=flux&enhance=true`
      },
      {
        name: "Pollinations AI Alt",
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(randomPrompt)}?width=512&height=512&seed=${randomSeed + 1}&model=turbo`
      },
      {
        name: "Pollinations AI Backup",
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent("kawaii anime sticker annoyed expression chibi style")}?width=512&height=512&seed=${randomSeed + 2}`
      }
    ];

    for (const service of services) {
      try {
        console.log(`🔄 Trying ${service.name}...`);
        
        const response = await fetch(service.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/png, image/jpeg, image/*'
          },
          timeout: 30000
        });

        if (response.ok && response.headers.get('content-type')?.includes('image')) {
          const blob = await response.blob();
          
          // Check if the image is valid (not too small)
          if (blob.size > 5000) {
            console.log(`✅ SUCCESS! Generated kawaii with ${service.name} (${blob.size} bytes)`);
            return URL.createObjectURL(blob);
          }
        }
        
        console.log(`⚠️ ${service.name} failed, trying next...`);
      } catch (error) {
        console.log(`❌ ${service.name} error: ${error.message}`);
        continue;
      }
    }

    throw new Error('All AI services failed. Please try again!');
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setStickers([]);

    try {
      console.log('🎨 Generating kawaii sticker with AI...');
      
      // Generate kawaii sticker (no need for image analysis, just create kawaii art)
      const stickerUrl = await generateKawaiiSticker();
      
      setStickers([stickerUrl]);
      console.log('✅ Kawaii sticker generated successfully!');
      
    } catch (err) {
      console.error('❌ Sticker generation error:', err);
      setError(err.message || 'Failed to generate kawaii sticker. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="header-section">
        <h1>💕 Stickerly 💕</h1>
        <p className="subtitle">✨ Free AI Kawaii Sticker Generator ✨</p>
      </div>

      <div className={`controls ${loading ? 'loading-state' : ''}`}>
        <label className="custom-file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          📸 Upload Photo
        </label>

        <button onClick={handleSubmit} disabled={!imageFile || loading}>
          {loading ? '🎨 Creating Kawaii Magic...' : '✨ Make Kawaii Sticker'}
        </button>

        <button onClick={handleClear} disabled={!imageFile && !stickers.length}>
          🗑️ Clear All
        </button>
      </div>

      {error && <p className="error">❌ {error}</p>}

      <div className="preview-area">
        <div className="preview-wrapper">
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded" className="preview-img" />
          ) : (
            <div className="placeholder">
              <div className="upload-icon">📷</div>
              <p>Upload any photo!</p>
              <p style={{fontSize: '0.9rem', opacity: 0.7}}>We'll create kawaii magic ✨</p>
            </div>
          )}
          <p className="note">📸 Original Photo</p>
        </div>

        <div className="preview-wrapper">
          {stickers.length > 0 ? (
            <div className="preview">
              {stickers.map((src, i) => (
                <div key={i} className="sticker-card sticker-success">
                  <img src={src} alt={`Kawaii Sticker ${i + 1}`} className="sticker-img" />
                  <a
                    href={src}
                    download={`kawaii-sticker-${i + 1}.png`}
                    className="download-link"
                  >
                    💾 Download Sticker
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder">
              <div className="magic-icon">
                {loading ? '🎨' : '🌟'}
              </div>
              <p>
                {loading ? 'Creating kawaii magic... ✨' : 'Your adorable kawaii sticker will appear here! 🥰'}
              </p>
              {loading && <p style={{fontSize: '0.9rem', opacity: 0.7}}>This may take 10-30 seconds...</p>}
            </div>
          )}
          <p className="note">🎨 Your Kawaii Creation</p>
        </div>
      </div>



      <p className="footer-note">Made with 💕 and AI magic ✨</p>
    </div>
  );
}
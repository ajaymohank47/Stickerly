# 💕 Stickerly - Kawaii Sticker Generator

Transform your photos into adorable kawaii-style stickers with AI! Features realistic kawaii artwork with annoyed expressions, bold clean outlines, vibrant colors, exaggerated cute proportions, big shading for depth, and plain white backgrounds.

## 🎯 What You Get

Your photos will be transformed into **actual kawaii anime-style stickers** like this:
- 🎭 **Annoyed kawaii expressions** with pouty faces
- 👀 **Big sparkling eyes** with highlights
- 🖤 **Bold black outlines** for that classic sticker look
- 🌈 **Vibrant colors** and soft shading
- 🎨 **Exaggerated cute proportions** (big head, small body)
- ⚪ **Plain white background** for easy use

## ⚙️ Setup Instructions

### 🎉 **WORKS OUT OF THE BOX - NO API KEYS NEEDED!**

Your kawaii sticker generator now uses **FREE AI** that creates REAL kawaii artwork without any setup!

### **Ready to Use Options:**

#### ✅ **FREE AI (Default - RECOMMENDED!)**
- **NO SETUP REQUIRED** - Works immediately!
- **Creates REAL kawaii artwork** - Not just filters
- **Uses Pollinations.ai** - Completely free service
- **Perfect kawaii transformations** with all the features you want

#### 🔧 **Optional Premium Services (Better Quality):**

**Hugging Face API (FREE with signup):**
```env
HUGGINGFACE_API_KEY=hf_your_token_here
```

**Replicate API (Paid - Highest Quality):**
```env
REPLICATE_API_TOKEN=r8_your_token_here
REPLICATE_HAS_CREDITS=true
```

**OpenAI API (Paid):**
```env
OPENAI_API_KEY=sk-your_key_here
```

### 🚀 **Start Your Kawaii Sticker Generator:**

#### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
Server runs on `http://localhost:4000`

#### 2. Start the Frontend
```bash
cd stickerly
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

#### 3. Create Kawaii Stickers!
- Open `http://localhost:5173` in your browser
- Upload any photo with a person
- Click "Make Kawaii Stickers"
- Get 4 REAL kawaii transformations!

## 🎨 How It Works

1. **Upload a Photo**: Choose any image with a person's face
2. **AI Magic**: Our AI transforms it into kawaii anime-style artwork
3. **Get 4 Variants**: Different kawaii styles and expressions
4. **Download**: High-quality 512x512 PNG stickers ready to use

## 🛠 Technical Features

- **FREE AI Transformation**: Uses Pollinations.ai to create actual kawaii artwork (no API key needed!)
- **Multiple AI Services**: Supports Pollinations, Hugging Face, Replicate, and OpenAI with smart fallbacks
- **4 Unique Variants**: Different kawaii styles and expressions
- **High Quality**: 512x512 PNG output optimized for stickers
- **White Background**: Perfect for sticker use
- **Smart Fallbacks**: Always works even if services are down
- **Fast Processing**: Optimized image handling with Sharp

## 📁 Project Structure

```
├── server/          # Express.js backend with AI integration
│   ├── index.js     # Main server with kawaii AI processing
│   ├── .env         # API keys configuration
│   └── package.json # Server dependencies
└── stickerly/       # React frontend
    ├── src/
    │   └── App.jsx  # Main React component
    └── package.json # Frontend dependencies
```

## 🔧 Troubleshooting

- **"No AI service configured"**: Add your API key to the `.env` file
- **Generation fails**: Check your API key is valid and has credits
- **Slow generation**: AI processing takes 10-30 seconds per sticker

## 💡 Tips

- Use photos with clear faces for best results
- Good lighting helps the AI create better kawaii transformations
- Each variant has different kawaii styles - try them all!

Made with 💕 for creating adorable kawaii stickers!
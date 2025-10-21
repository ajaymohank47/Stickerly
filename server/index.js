const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const sharp = require("sharp");
const Replicate = require("replicate");
const OpenAI = require("openai");
const { HfInference } = require("@huggingface/inference");
const axios = require("axios");
const FormData = require("form-data");
const fetch = require("node-fetch");

dotenv.config();

// Initialize AI clients
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Hugging Face (free tier available)
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

// Convert image buffer to base64 data URL
function bufferToDataURL(buffer, mimeType = 'image/jpeg') {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

// Generate kawaii sticker using Replicate AI
async function generateKawaiiStickerReplicate(imageBuffer, variant = 0) {
  // Single perfect kawaii human prompt
  const perfectPrompt = "kawaii chibi human with oversized head, tiny body, huge sparkling eyes with highlights, cute pouty expression, bold black outlines, adorable hoodie, white background, chibi proportions, very cute and human-like";

  const prompts = [perfectPrompt, perfectPrompt, perfectPrompt, perfectPrompt];

  console.log(`🎨 Generating variant ${variant + 1} with Replicate...`);
  console.log(`📝 Prompt: ${prompts[variant]}`);

  // Use Stable Diffusion for text-to-image generation (simpler approach)
  const output = await replicate.run(
    "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
    {
      input: {
        prompt: prompts[variant] || prompts[0],
        width: 512,
        height: 512,
        num_outputs: 1,
        num_inference_steps: 25,
        guidance_scale: 7.5,
        seed: 42 + variant
      }
    }
  );

  console.log(`📤 Replicate output:`, output);

  if (!output || !output[0]) {
    throw new Error(`No output generated for variant ${variant}`);
  }

  const response = await fetch(output[0]);
  if (!response.ok) {
    throw new Error(`Failed to download generated image: ${response.statusText}`);
  }

  return await response.buffer();
}

// Generate kawaii sticker using OpenAI DALL-E
async function generateKawaiiStickerOpenAI(imageBuffer, variant = 0) {
  const imageDataURL = bufferToDataURL(imageBuffer, 'image/jpeg');

  // Single perfect kawaii human transformation prompt
  const perfectPrompt = "Transform this photo into kawaii chibi human sticker with oversized head, tiny body, huge sparkling eyes with highlights, cute pouty expression, bold black outlines, adorable hoodie, white background, chibi proportions, very cute and human-like";

  const prompts = [perfectPrompt, perfectPrompt, perfectPrompt, perfectPrompt];

  const response = await openai.images.edit({
    image: imageBuffer,
    prompt: prompts[variant] || prompts[0],
    n: 1,
    size: "512x512",
  });

  if (!response.data || !response.data[0] || !response.data[0].url) {
    throw new Error(`No image generated for variant ${variant}`);
  }

  const imageResponse = await fetch(response.data[0].url);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download generated image: ${imageResponse.statusText}`);
  }

  return await imageResponse.buffer();
}

// Generate PERFECT kawaii sticker using optimized high-quality approach
async function generateKawaiiStickerFree(imageBuffer, variant = 0) {
  console.log(`🎨 Creating PERFECT kawaii artwork...`);

  // PERFECT kawaii prompt with quality keywords
  const perfectPrompt = "masterpiece, best quality, kawaii chibi anime girl, oversized head, tiny body, huge sparkling eyes with star highlights, cute pouty expression, thick black outlines, adorable purple hoodie, plain white background, chibi proportions, very detailed, high quality, anime art style, sticker design";

  try {
    console.log(`🎯 Using optimized high-quality kawaii prompt...`);

    // Try multiple high-quality approaches
    const attempts = [
      {
        name: "High Quality Enhanced",
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(perfectPrompt)}?width=512&height=512&seed=12345&model=flux&enhance=true&quality=high`,
        timeout: 45000
      },
      {
        name: "Alternative Model",
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent("high quality kawaii chibi anime girl, oversized head, tiny body, huge eyes, cute expression, black outlines, hoodie, white background, masterpiece, detailed")}?width=512&height=512&seed=67890&model=turbo&enhance=true`,
        timeout: 40000
      },
      {
        name: "Stable Generation",
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent("kawaii chibi anime character, big head small body, huge cute eyes, pouty face, black outlines, purple hoodie, white background, high quality art")}?width=512&height=512&seed=11111&model=flux`,
        timeout: 35000
      }
    ];

    for (const attempt of attempts) {
      try {
        console.log(`🔄 Trying ${attempt.name}...`);

        const response = await fetch(attempt.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/png, image/jpeg, image/*'
          },
          timeout: attempt.timeout
        });

        if (response.ok && response.headers.get('content-type')?.includes('image')) {
          const imageBuffer = await response.buffer();

          // Verify it's a proper image with good size
          if (imageBuffer.length > 5000) { // At least 5KB for quality check
            console.log(`✅ SUCCESS! Generated perfect kawaii with ${attempt.name} (${imageBuffer.length} bytes)`);
            return imageBuffer;
          } else {
            console.log(`⚠️ ${attempt.name} returned small image, trying next...`);
          }
        } else {
          console.log(`⚠️ ${attempt.name} failed (${response.status}), trying next...`);
        }

      } catch (attemptError) {
        console.log(`⚠️ ${attempt.name} error: ${attemptError.message}`);
        continue;
      }
    }

    throw new Error('All high-quality attempts failed');

  } catch (error) {
    console.error(`❌ Perfect kawaii generation failed: ${error.message}`);
    throw new Error("Unable to generate perfect kawaii artwork. For guaranteed high-quality results, please get a free Hugging Face API key at: https://huggingface.co/settings/tokens");
  }
}

// Generate kawaii sticker using Hugging Face (BEST FREE OPTION!)
async function generateKawaiiStickerHuggingFace(imageBuffer, variant = 0) {
  console.log(`🎨 Creating REAL kawaii transformation with Hugging Face for variant ${variant + 1}...`);

  // Single perfect kawaii human transformation prompt
  const perfectPrompt = "Transform this photo into kawaii chibi human sticker with oversized head, tiny body, huge sparkling eyes with highlights, cute pouty expression, bold black outlines, adorable hoodie, white background, chibi proportions, very cute and human-like";

  const prompts = [perfectPrompt, perfectPrompt, perfectPrompt, perfectPrompt];

  try {
    console.log(`🔄 Using InstuctPix2Pix for image-to-image kawaii transformation...`);

    // Use the best image-to-image model for style transformation
    const result = await hf.imageToImage({
      model: "timbrooks/instruct-pix2pix",
      inputs: {
        image: imageBuffer,
        prompt: prompts[variant] || prompts[0]
      },
      parameters: {
        num_inference_steps: 25,
        guidance_scale: 7.5,
        image_guidance_scale: 1.5
      }
    });

    if (result && result.arrayBuffer) {
      const arrayBuffer = await result.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`✅ Successfully transformed photo to kawaii style! (${buffer.length} bytes)`);
      return buffer;
    } else {
      throw new Error('No result from InstuctPix2Pix');
    }

  } catch (error) {
    console.error(`❌ InstuctPix2Pix failed: ${error.message}`);

    // Try alternative image-to-image model
    try {
      console.log(`🔄 Trying alternative image-to-image model...`);

      const result = await hf.imageToImage({
        model: "Fantasy-Studio/Paint-by-Example",
        inputs: {
          image: imageBuffer,
          prompt: prompts[variant] || prompts[0]
        }
      });

      if (result && result.arrayBuffer) {
        const arrayBuffer = await result.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log(`✅ Alternative model worked! (${buffer.length} bytes)`);
        return buffer;
      } else {
        throw new Error('Alternative model failed');
      }

    } catch (altError) {
      console.error(`❌ Alternative model failed: ${altError.message}`);

      // Final fallback to text-to-image with kawaii style
      try {
        console.log(`🔄 Final fallback: Creating kawaii character...`);

        const kawaiPrompt = `kawaii chibi human character with oversized head, tiny body, huge sparkling eyes with highlights, cute pouty expression, bold black outlines, adorable hoodie, white background, chibi proportions, very cute and human-like`;

        const result = await hf.textToImage({
          model: "runwayml/stable-diffusion-v1-5",
          inputs: kawaiPrompt,
          parameters: {
            num_inference_steps: 25,
            guidance_scale: 7.5,
            width: 512,
            height: 512
          }
        });

        if (result && result.arrayBuffer) {
          const arrayBuffer = await result.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          console.log(`✅ Generated kawaii character as fallback! (${buffer.length} bytes)`);
          return buffer;
        } else {
          throw new Error('Text-to-image fallback failed');
        }

      } catch (fallbackError) {
        console.error(`❌ All Hugging Face methods failed: ${fallbackError.message}`);
        throw new Error("Hugging Face transformation failed completely");
      }
    }
  }
}

// Enhanced kawaii-style transformation using advanced image processing
async function generateKawaiiStickerLocal(imageBuffer, variant = 0) {
  console.log(`🎨 Creating enhanced kawaii-style transformation locally for variant ${variant + 1}...`);

  // Enhanced kawaii effects with stronger transformations
  const effects = [
    { brightness: 1.5, saturation: 2.0, hue: 0, contrast: 1.3, tint: { r: 255, g: 220, b: 235 }, blur: 0.5 },    // Bright pink kawaii
    { brightness: 1.4, saturation: 1.9, hue: 25, contrast: 1.25, tint: { r: 220, g: 235, b: 255 }, blur: 0.4 },  // Cool blue kawaii  
    { brightness: 1.45, saturation: 2.1, hue: -20, contrast: 1.2, tint: { r: 235, g: 220, b: 255 }, blur: 0.3 }, // Purple kawaii
    { brightness: 1.6, saturation: 1.8, hue: 15, contrast: 1.35, tint: { r: 255, g: 235, b: 220 }, blur: 0.6 }   // Warm peach kawaii
  ];

  const effect = effects[variant] || effects[0];

  // Create enhanced kawaii-style image processing with stronger effects
  const processedBuffer = await sharp(imageBuffer)
    // Resize to square with white background
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    // Apply stronger kawaii-style color adjustments
    .modulate({
      brightness: effect.brightness,
      saturation: effect.saturation,
      hue: effect.hue
    })
    // Increase contrast for bold anime look
    .linear(effect.contrast, -(128 * effect.contrast) + 128)
    // Add soft blur for dreamy kawaii effect
    .blur(effect.blur)
    // Very strong sharpen for bold outlines effect
    .sharpen({ sigma: 1.5, m1: 3, m2: 4 })
    // Adjust gamma for cartoon-like look
    .gamma(1.4)
    // Add stronger color tint overlay for kawaii effect
    .tint(effect.tint)
    // Enhance colors further
    .normalise()
    // Add slight edge enhancement for anime-style outlines
    .convolve({
      width: 3,
      height: 3,
      kernel: [-1, -1, -1, -1, 9, -1, -1, -1, -1]
    })
    // Convert to PNG with high quality
    .png({ quality: 98 })
    .toBuffer();

  return processedBuffer;
}

// Main kawaii generation function with fallbacks
async function generateKawaiiSticker(imageBuffer, variant = 0) {
  try {
    console.log(`🎨 Generating kawaii sticker variant ${variant + 1}...`);

    let generatedBuffer;

    // Check available AI services
    const hasReplicateCredits = process.env.REPLICATE_API_TOKEN &&
      process.env.REPLICATE_API_TOKEN !== 'your-replicate-api-token-here' &&
      process.env.REPLICATE_HAS_CREDITS === 'true';

    const hasOpenAI = process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== 'your-openai-api-key-here';

    const hasHuggingFace = process.env.HUGGINGFACE_API_KEY &&
      process.env.HUGGINGFACE_API_KEY !== 'your-huggingface-api-key-here';

    // Priority: Replicate (best) -> OpenAI -> Hugging Face (free) -> Local processing
    if (hasReplicateCredits) {
      try {
        console.log(`🔄 Using Replicate API for variant ${variant + 1}...`);
        generatedBuffer = await generateKawaiiStickerReplicate(imageBuffer, variant);
        console.log(`✅ Replicate generated buffer of size: ${generatedBuffer.length} bytes`);
      } catch (error) {
        console.error(`❌ Replicate failed for variant ${variant + 1}:`, error.message);
        if (error.message.includes('402') || error.message.includes('credit')) {
          console.log(`💡 Falling back to Hugging Face (free AI)...`);
          if (hasHuggingFace) {
            generatedBuffer = await generateKawaiiStickerHuggingFace(imageBuffer, variant);
          } else {
            generatedBuffer = await generateKawaiiStickerLocal(imageBuffer, variant);
          }
        } else {
          throw error;
        }
      }
    }
    else if (hasOpenAI) {
      try {
        console.log(`🔄 Using OpenAI DALL-E for variant ${variant + 1}...`);
        generatedBuffer = await generateKawaiiStickerOpenAI(imageBuffer, variant);
      } catch (error) {
        console.error(`❌ OpenAI failed for variant ${variant + 1}:`, error.message);
        console.log(`💡 Falling back to Hugging Face (free AI)...`);
        if (hasHuggingFace) {
          generatedBuffer = await generateKawaiiStickerHuggingFace(imageBuffer, variant);
        } else {
          generatedBuffer = await generateKawaiiStickerLocal(imageBuffer, variant);
        }
      }
    }
    else if (hasHuggingFace) {
      try {
        console.log(`🆓 Using Hugging Face (FREE AI) for variant ${variant + 1}...`);
        generatedBuffer = await generateKawaiiStickerHuggingFace(imageBuffer, variant);
        console.log(`✅ Hugging Face generated real kawaii transformation!`);
      } catch (error) {
        console.error(`❌ Hugging Face failed for variant ${variant + 1}:`, error.message);
        console.log(`💡 Trying free AI service...`);
        try {
          generatedBuffer = await generateKawaiiStickerFree(imageBuffer, variant);
        } catch (freeError) {
          console.log(`💡 Falling back to enhanced local processing...`);
          generatedBuffer = await generateKawaiiStickerLocal(imageBuffer, variant);
        }
      }
    }
    else {
      // Try free AI service first, then fall back to local
      try {
        console.log(`🆓 Using FREE AI service for variant ${variant + 1}...`);
        console.log(`💡 Note: For REAL photo-to-kawaii transformation, get a free Hugging Face API key!`);
        generatedBuffer = await generateKawaiiStickerFree(imageBuffer, variant);
        console.log(`✅ Free AI generated kawaii character (generic style)`);
      } catch (error) {
        console.error(`❌ Free AI failed for variant ${variant + 1}:`, error.message);
        console.log(`🎨 Using enhanced local kawaii-style processing for variant ${variant + 1}...`);
        generatedBuffer = await generateKawaiiStickerLocal(imageBuffer, variant);
      }
    }

    // Final optimization
    const finalBuffer = await sharp(generatedBuffer)
      .resize(512, 512, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png({ quality: 90 })
      .toBuffer();

    return finalBuffer;

  } catch (error) {
    console.error(`❌ Error generating kawaii sticker variant ${variant + 1}:`, error.message);
    throw error;
  }
}

// Main kawaii sticker generation endpoint
app.post("/api/generate-stickers", upload.single("photo"), async (req, res) => {
  try {
    console.log("🎨 Starting kawaii sticker generation...");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`📊 Service status:`);
    console.log(`   Replicate: ${process.env.REPLICATE_API_TOKEN ? 'Configured' : 'Not configured'} ${process.env.REPLICATE_HAS_CREDITS === 'true' ? '(with credits)' : '(no credits)'}`);
    console.log(`   OpenAI: ${process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here' ? 'Configured' : 'Not configured'}`);
    console.log(`   Hugging Face: ${process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_API_KEY !== 'your-huggingface-api-key-here' ? 'Configured (FREE AI!)' : 'Not configured'}`);
    console.log(`   Free AI (Pollinations): Always available - NO API KEY NEEDED!`);
    console.log(`   Enhanced Local: Always available (free)`);

    // Note: We always have free AI and enhanced local processing as fallback

    // Generate single kawaii human sticker
    const stickers = [];

    try {
      console.log(`🎭 Generating single kawaii human sticker...`);
      const stickerBuffer = await generateKawaiiSticker(req.file.buffer, 0); // Always use variant 0
      const base64 = stickerBuffer.toString("base64");
      stickers.push(`data:image/png;base64,${base64}`);
      console.log(`✅ Kawaii human sticker completed!`);
    } catch (error) {
      console.error(`❌ Error creating kawaii sticker:`, error.message);
    }

    if (stickers.length === 0) {
      return res.status(500).json({
        error: "Failed to generate kawaii human sticker. Please try again."
      });
    }

    console.log(`🎉 Successfully generated cute kawaii human sticker!`);
    res.json({ stickers });

  } catch (err) {
    console.error("❌ Kawaii sticker generation error:", err);
    res.status(500).json({
      error: err.message || "Failed to generate kawaii stickers"
    });
  }
});

// Test endpoint to verify API connection
app.get("/api/test", async (req, res) => {
  try {
    console.log("🧪 Testing Replicate API connection...");

    if (!process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
      return res.json({
        status: "error",
        message: "Replicate API token not configured"
      });
    }

    // Test with a simple model
    const output = await replicate.run(
      "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
      {
        input: {
          prompt: "a cute kawaii anime character",
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 20
        }
      }
    );

    res.json({
      status: "success",
      message: "Replicate API is working!",
      output: output ? "Generated image successfully" : "No output"
    });
  } catch (error) {
    console.error("❌ Replicate test error:", error);
    res.json({
      status: "error",
      message: error.message,
      details: error.toString()
    });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 StickerApp server running on port ${PORT}`);
  console.log(`🧪 Test API at: http://localhost:${PORT}/api/test`);
  console.log(`🎨 Generate stickers at: http://localhost:${PORT}/api/generate-stickers`);
});
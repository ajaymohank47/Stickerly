// Test Replicate API directly
const Replicate = require("replicate");
require('dotenv').config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function testReplicate() {
  try {
    console.log('🧪 Testing Replicate API...');
    console.log('🔑 Token:', process.env.REPLICATE_API_TOKEN ? `${process.env.REPLICATE_API_TOKEN.substring(0, 10)}...` : 'Missing');
    
    const output = await replicate.run(
      "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
      {
        input: {
          prompt: "a cute kawaii anime character with big eyes",
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 20
        }
      }
    );

    console.log('✅ Success! Output:', output);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Full error:', error);
  }
}

testReplicate();
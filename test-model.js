const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const genAI = new GoogleGenerativeAI('AIzaSyAacSITOeLCLEbh5QZRMdCJLJmgi3XqHi8');
  try {
    const models = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent('test');
    console.log(models);
  } catch (err) {
    console.error("Direct error:", err);
  }
}
run();

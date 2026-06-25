import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hi');
    console.log(`Success for ${modelName}:`, result.response.text().slice(0, 10));
  } catch (error) {
    console.log(`Error for ${modelName}:`, error.message);
  }
}

async function run() {
  await testModel('gemini-pro');
  await testModel('gemini-1.5-pro');
  await testModel('gemini-1.5-pro-latest');
  await testModel('gemini-1.5-flash');
  await testModel('gemini-1.5-flash-latest');
}

run();

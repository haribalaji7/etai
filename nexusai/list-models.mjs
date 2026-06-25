import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

async function listModels() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  data.models.forEach(m => {
    if (m.name.includes('gemini')) {
      console.log(m.name);
    }
  });
}

listModels();

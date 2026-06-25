import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { prompt, systemPrompt, responseFormat } = await req.json();

    // Retrieve Gemini API key from environment (prefer private variable)
    const apiKey =
      (process.env.GEMINI_API_KEY?.trim() ??
        process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ??
        process.env.NEXT_PUBLIC_GEMINI_KEY?.trim() ??
        '').trim();

    // Return a clear client error if the key is missing or placeholder
    if (!apiKey || apiKey === 'your_key_here') {
      return new Response(
        JSON.stringify({ error: 'Gemini API key is not configured.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    async function tryGenerateContent(mName: string) {
      const model = genAI.getGenerativeModel({
        model: mName,
        systemInstruction: systemPrompt || 'You are a helpful enterprise AI assistant.',
        generationConfig: {
          responseMimeType: responseFormat === 'json' ? 'application/json' : 'text/plain',
        },
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    // Try primary model, fallback to widely available model
    let text: string;
    try {
      text = await tryGenerateContent('gemini-2.5-pro');
    } catch {
      try {
        text = await tryGenerateContent('gemini-1.5-pro');
      } catch {
        text = '';
      }
    }

    if (responseFormat === 'json') {
      if (!text || !text.trim()) {
        // Return a mock fallback so the UI isn't broken
        return new Response(
          JSON.stringify([
            { title: 'Review Revenue Metrics', description: 'Revenue growth is strong at +24%. Schedule a strategy session to capitalize on this trend.', priority: 'High', action: 'View Report' },
            { title: 'Monitor Churn Rate', description: 'Churn is low at 1.2% but proactive engagement can reduce it further.', priority: 'Medium', action: 'Analyze' },
            { title: 'Reduce Server Load', description: 'Server load at 85% is approaching critical. Consider scaling resources.', priority: 'Low', action: 'Optimize' },
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Clean possible markdown wrappers around JSON
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      // Verify the cleaned string is valid JSON
      try {
        const parsed = JSON.parse(cleanJson);
        return new Response(JSON.stringify(parsed), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (jsonErr) {
        console.error('JSON parse error from Gemini:', jsonErr);
        console.error('Raw Gemini text (first 500 chars):', text.slice(0, 500));
        // Fallback to mock data on parse failure
        return new Response(
          JSON.stringify([
            { title: 'Review Revenue Metrics', description: 'Revenue growth is strong at +24%. Schedule a strategy session to capitalize on this trend.', priority: 'High', action: 'View Report' },
            { title: 'Monitor Churn Rate', description: 'Churn is low at 1.2% but proactive engagement can reduce it further.', priority: 'Medium', action: 'Analyze' },
            { title: 'Reduce Server Load', description: 'Server load at 85% is approaching critical. Consider scaling resources.', priority: 'Low', action: 'Optimize' },
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Default plain‑text response wrapped in JSON
    return new Response(JSON.stringify({ result: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('AI Generate Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process AI request';

    // Determine appropriate status code based on error type
    let status = 500;
    if (/429|quota|rate.?limit/i.test(message)) {
      status = 429;
    } else if (/API key|not found|invalid|unauthorized/i.test(message)) {
      status = 401;
    } else if (/SAFETY|blocked|not permitted/i.test(message)) {
      status = 422;
    } else if (/PERMISSION_DENIED|forbidden/i.test(message)) {
      status = 403;
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

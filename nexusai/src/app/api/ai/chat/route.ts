import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { messages, agentRole, systemPrompt } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_KEY || '';
    if (!apiKey || apiKey === 'your_key_here') {
      return new Response(
        JSON.stringify({ error: 'Gemini API key is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt || `You are a helpful AI Assistant acting as: ${agentRole || 'General Assistant'}.`
    });

    // Format history for Gemini
    let formattedHistory: any[] = [];
    if (Array.isArray(messages)) {
      formattedHistory = messages.map((m: any) => {
        if (m.role && m.parts) {
          return {
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: m.parts
          };
        }
        const role = m.sender === 'user' ? 'user' : 'model';
        const text = m.text || m.content || '';
        return {
          role,
          parts: [{ text }]
        };
      });
    }

    if (formattedHistory.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Gemini API with streaming
    const result = await model.generateContentStream({
      contents: formattedHistory
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err: any) {
          console.error('Error during streaming:', err);
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // Stream simulator
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const text = `Received prompt: "${message}". Processed parameters successfully. Starting execution pipeline... Done.`;
        // stream character by character
        for (let i = 0; i < text.length; i++) {
          controller.enqueue(encoder.encode(text[i]));
          await new Promise(r => setTimeout(r, 15));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

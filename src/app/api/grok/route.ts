import { NextRequest, NextResponse } from 'next/server';
import { xai } from '@ai-sdk/xai';
import { streamText } from 'ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create a flood-aware context for the AI
    const floodContext = `You are an expert AI assistant specializing in flood risk assessment and disaster management for Northern Namibia.
    You have access to geospatial data about flood zones, population centers, river monitoring stations, and weather patterns.
    Provide helpful, accurate information about flood risks, preparedness, and response strategies.`;

    const enhancedPrompt = `${floodContext}\n\nUser query: ${prompt}`;

    const result = await streamText({
      model: xai('grok-2-1212'),
      prompt: enhancedPrompt,
    });

    // Convert the stream to a string for JSON response
    let responseText = '';
    for await (const textPart of result.textStream) {
      responseText += textPart;
    }

    return NextResponse.json({
      response: responseText,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Grok AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
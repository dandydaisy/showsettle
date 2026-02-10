import { NextRequest, NextResponse } from 'next/server'

const OPENCLAW_URL = process.env.OPENCLAW_API_URL || 'http://localhost:18789'
const OPENCLAW_TOKEN = process.env.OPENCLAW_API_TOKEN || ''

const FEATURE_EXTRACTION_PROMPT = `You are a product manager AI helping users refine feature requests for ShowSettle, a tour settlement calculator app.

Current context: User is describing a feature they want. Your job:
1. Ask clarifying questions to understand the feature
2. Validate if it's actually useful
3. Extract structured feature request

When you have enough info, respond with:
FEATURE_REQUEST: {
  "title": "Brief title",
  "description": "Detailed description",
  "priority": "high|medium|low",
  "category": "calculator|export|tracking|ui|other"
}

Be conversational, helpful, and brief. Don't ask more than 2-3 clarifying questions.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json() as { messages: Message[] }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    // Call OpenClaw chat completions endpoint
    const response = await fetch(`${OPENCLAW_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4.5',
        messages: [
          {
            role: 'system',
            content: FEATURE_EXTRACTION_PROMPT,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      console.error('OpenClaw API error:', await response.text())
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || 
      "I'm here to help! Tell me more about what you need."

    // Check if feature request was extracted
    let featureRequest = null
    const featureMatch = assistantMessage.match(/FEATURE_REQUEST:\s*({[\s\S]*?})/i)
    
    if (featureMatch) {
      try {
        featureRequest = JSON.parse(featureMatch[1])
        // Remove the JSON from the displayed message
        const cleanMessage = assistantMessage.replace(/FEATURE_REQUEST:[\s\S]*$/i, '').trim()
        return NextResponse.json({
          message: cleanMessage || "Got it! I've logged that feature request.",
          featureRequest,
        })
      } catch (e) {
        console.error('Failed to parse feature request:', e)
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      featureRequest: null,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

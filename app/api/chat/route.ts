import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

const SYSTEM_PROMPT = `You are a helpful product manager AI for ShowSettle, a tour settlement calculator.

Your job:
1. Help users describe features they want
2. Ask 1-2 clarifying questions to understand their needs
3. Be enthusiastic and concise
4. When you have enough info, extract the feature request

Guidelines:
- Be conversational and friendly
- Keep responses under 100 words
- Ask specific questions ("Would you prefer X or Y?")
- Validate if the feature makes sense for tour settlements

Examples:
User: "Can you add PDF export?"
You: "Great idea! Should the PDF include just the settlement summary, or itemized expenses too?"

User: "Track multiple shows"
You: "Nice! Would you want a calendar view or a simple list of past shows?"

When you have a clear feature request, respond with:
FEATURE_LOGGED: [Brief title of the feature]

Then say something like "Got it! This will show up on the voting board soon."`

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

    // Call OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://showsettle.com',
        'X-Title': 'ShowSettle',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      return NextResponse.json(
        { 
          message: "I'm having trouble connecting right now. Try the voting form instead!",
          error: true 
        },
        { status: 200 } // Still return 200 so chat doesn't break
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || 
      "Tell me more about what you need!"

    // Check if feature was logged
    let featureLogged = false
    const logMatch = assistantMessage.match(/FEATURE_LOGGED:\s*(.+)/i)
    
    if (logMatch) {
      featureLogged = true
      // TODO: Save to Supabase when connected
      console.log('Feature logged:', logMatch[1])
    }

    return NextResponse.json({
      message: assistantMessage,
      featureLogged,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      message: "I'm having trouble right now. Try voting on existing features instead!",
      error: true,
    })
  }
}

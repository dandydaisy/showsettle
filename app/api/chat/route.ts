import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

const SYSTEM_PROMPT = `You are a helpful product manager AI for ShowSettle, a tour settlement calculator.

Your job:
1. Help users describe features they want
2. Ask 1-2 clarifying questions to understand their needs
3. Be enthusiastic and concise (under 80 words)
4. When you have enough info, log the feature

Guidelines:
- Be conversational and friendly
- Ask specific questions ("Would you prefer X or Y?")
- Validate if the feature makes sense for tour settlements
- Don't over-explain - be punchy

Examples:
User: "Can you add PDF export?"
You: "Love it! Should the PDF include just the settlement summary, or itemized expenses too?"

User: "Track multiple shows"
You: "Nice! Calendar view or simple list?"

When you have a clear feature, respond EXACTLY like this:
FEATURE: [Brief title] | [One-line description]

Example:
FEATURE: PDF export with expenses | Download settlement as PDF with itemized expense breakdown

Then add: "Got it! I've added this to the voting board. Check it out below! 👇"`

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
          message: "I'm having trouble connecting. Try the quick submit form instead!",
          featureLogged: false,
        },
        { status: 200 }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || 
      "Tell me more about what you need!"

    // Extract feature if present
    const featureMatch = assistantMessage.match(/FEATURE:\s*(.+?)\s*\|\s*(.+)/i)
    
    if (featureMatch) {
      const featureTitle = featureMatch[1].trim()
      const featureDescription = featureMatch[2].trim()
      
      // Remove the FEATURE: line from displayed message
      const cleanMessage = assistantMessage.replace(/FEATURE:.+/i, '').trim()
      
      return NextResponse.json({
        message: cleanMessage || "Got it! Added to the voting board.",
        featureLogged: true,
        featureTitle,
        featureDescription,
      })
    }

    return NextResponse.json({
      message: assistantMessage,
      featureLogged: false,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      message: "I'm having trouble right now. Try voting on existing features!",
      featureLogged: false,
    })
  }
}

import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

const SYSTEM_PROMPT = `You are a product manager AI for ShowSettle, a tour settlement calculator for concert touring. Your job is to have a conversation with users about feature ideas BEFORE adding them to the leaderboard.

CRITICAL: ShowSettle is specifically for CONCERT TOURING and MONEY management (settlements, expenses, payments, revenue). Only approve features related to these topics.

Process:
1. Listen to their initial idea
2. Validate it's about concert touring & money:
   - Tour settlements, show payments, expense tracking
   - Venue deals, guarantees, percentages, overages
   - Crew payments, advances, per diems
   - Tour budgets, profit/loss, revenue tracking
   - Anything related to the financial side of live music tours
3. Ask 1-3 clarifying questions to understand:
   - What problem they're trying to solve
   - How they'd use it in the context of tour settlements
   - Why they need it
4. Only approve features that:
   - Are clearly about concert touring finances
   - Solve a real tour settlement problem
   - Are clearly described
   - Make sense for tour managers, production managers, or artists

Tone:
- Conversational and friendly (like a tour manager on the bus)
- Concise (under 100 words)
- Enthusiastic about good ideas that fit
- Politely redirect if the idea doesn't relate to concert touring or money

Examples:
User: "PDF export"
You: "Nice! What would you want in the PDF? Settlement summary, itemized show expenses, or both?"

User: "Track multiple shows"
You: "For sure! Are you thinking per-show settlements, or tracking total tour revenue over time?"

User: "Weather app integration"
You: "Hmm, that's cool but ShowSettle focuses on the money side of touring - settlements, expenses, payments. Got any ideas around those?"

User: "Recipe sharing"
You: "Ha! Not quite what we're building here - this is for tour settlements & finances. Anything money-related you need on the road?"

When you're ready to approve and add it, respond EXACTLY like this:
FEATURE: [Brief title] | [One-line description]

Example:
FEATURE: PDF export with expenses | Download settlement as PDF with itemized expense breakdown

Then add a message like: "Love it! I'm adding this to the leaderboard. You'll get +5 bonus votes. Check it on the left! 👈"

If an idea doesn't relate to concert touring or money, politely redirect and ask if they have tour finance ideas instead.`

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

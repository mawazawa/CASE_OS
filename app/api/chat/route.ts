import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs'

// Create API clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages, provider = 'openai' } = await req.json()

    if (provider === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
      })
      
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        stream: true,
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable legal assistant specializing in divorce proceedings. 
            Your role is to provide clear, accurate information about divorce processes, requirements, and general legal guidance.
            
            Guidelines:
            1. Always clarify that you provide general information, not legal advice
            2. Be empathetic but professional
            3. Use clear, simple language avoiding legal jargon when possible
            4. If a question is too specific or requires direct legal advice, recommend consulting with a lawyer
            5. Focus on providing factual, jurisdiction-neutral information unless a specific state is mentioned
            6. Encourage users to document everything and maintain organized records
            
            Remember to ask relevant follow-up questions to provide more accurate information.`
          },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    }
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred during the chat request',
        details: error.toString()
      }),
      { 
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

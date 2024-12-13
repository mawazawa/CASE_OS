"use client"

import { useChat } from "ai/react"
import { ChatMessage } from "@/components/ui/chat-message"
import { Button } from "@/components/ui/button"
import { IconSend } from "@/components/ui/icons"
import { useRef } from "react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your legal assistant specializing in divorce proceedings. How can I help you today? Remember, I can provide general information and guidance, but I cannot offer specific legal advice.",
        },
      ],
    })

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }
    }
  }

  // Handle textarea height adjustment
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
    // Auto-adjust height
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="py-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 focus-within:border-blue-600">
              <textarea
                ref={inputRef}
                className="w-full resize-none bg-transparent px-4 py-2.5 focus:outline-none"
                placeholder="Ask a question about divorce proceedings..."
                rows={1}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSubmit(e as any)
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 p-2"
            >
              <IconSend />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

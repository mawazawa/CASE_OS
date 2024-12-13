import { cn } from "@/lib/utils"
import { Message } from "ai"
import { IconUser } from "./icons"

export function ChatMessage({ message, ...props }: { message: Message }) {
  return (
    <div
      className={cn("flex items-start gap-4 py-4", {
        "flex-row-reverse": message.role === "user",
      })}
      {...props}
    >
      <div
        className={cn(
          "rounded-full p-2 w-8 h-8 flex items-center justify-center",
          message.role === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600"
        )}
      >
        {message.role === "user" ? (
          <IconUser />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        )}
      </div>
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[85%] prose prose-sm",
          message.role === "user"
            ? "bg-blue-600 text-white prose-invert"
            : "bg-gray-100 text-gray-600"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"

import { usePort } from "@plasmohq/messaging/hook"

import "./style.css"

import { CandleLLM } from "~llm/candle-llm"

enum ChatMessageType {
  User = "User",
  AI = "AI"
}

interface ChatMessage {
  from: ChatMessageType
  message: string
}

// Components taken from https://github.com/ahmadbilaldev/langui

const SideBar = () => {
  return (
    <aside className="flex">
      <div className="flex h-screen w-12 flex-col items-center space-y-8 border-r border-slate-300 bg-slate-950 py-8 dark:border-slate-700 sm:w-16">
        <a href="#" className="mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-blue-600"
            fill="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24">
            <path d="M20.553 3.105l-6 3C11.225 7.77 9.274 9.953 8.755 12.6c-.738 3.751 1.992 7.958 2.861 8.321A.985.985 0 0012 21c6.682 0 11-3.532 11-9 0-6.691-.9-8.318-1.293-8.707a1 1 0 00-1.154-.188zm-7.6 15.86a8.594 8.594 0 015.44-8.046 1 1 0 10-.788-1.838 10.363 10.363 0 00-6.393 7.667 6.59 6.59 0 01-.494-3.777c.4-2 1.989-3.706 4.728-5.076l5.03-2.515A29.2 29.2 0 0121 12c0 4.063-3.06 6.67-8.046 6.965zM3.523 5.38A29.2 29.2 0 003 12a6.386 6.386 0 004.366 6.212 1 1 0 11-.732 1.861A8.377 8.377 0 011 12c0-6.691.9-8.318 1.293-8.707a1 1 0 011.154-.188l6 3A1 1 0 018.553 7.9z"></path>
          </svg>
        </a>
        {/* New conversation */}
        <a
          href="#"
          className="rounded-lg p-1.5 text-slate-500 transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8 9h8"></path>
            <path d="M8 13h6"></path>
            <path d="M12.01 18.594l-4.01 2.406v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5"></path>
            <path d="M16 19h6"></path>
            <path d="M19 16v6"></path>
          </svg>
        </a>
        {/* Conversations */}
        <a
          href="#"
          className="rounded-lg bg-blue-100 p-1.5 text-blue-600 transition-colors duration-200 dark:bg-slate-800 dark:text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"></path>
            <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"></path>
          </svg>
        </a>
      </div>
      {/* Second Column */}
      <div className="h-screen w-52 overflow-y-auto bg-slate-950 py-8 sm:w-60">
        <div className="flex items-start">
          <h2 className="inline px-5 text-lg font-medium text-slate-800 dark:text-slate-200">
            Chats
          </h2>
        </div>

        <div className="mx-2 mt-8 space-y-4">
          <button className="flex w-full flex-col gap-y-2 rounded-lg bg-slate-900 px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-900 focus:outline-none">
            <h1 className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
              Active Chat
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Today</p>
          </button>
        </div>
      </div>
    </aside>
  )
}

const ChatInput = ({ onNewMessage }) => {
  const [input, setInput] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onNewMessage(input)
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" className="sr-only">
        Enter your prompt
      </label>
      <div className="relative">
        <button
          type="button"
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-500">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"></path>
            <path d="M5 10a7 7 0 0 0 14 0"></path>
            <path d="M8 21l8 0"></path>
            <path d="M12 17l0 4"></path>
          </svg>
          <span className="sr-only">Use voice input</span>
        </button>
        <textarea
          id="chat-input"
          className="block w-full resize-none rounded-xl border-none bg-slate-950 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
          placeholder="Enter your prompt"
          onKeyDown={handleKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required></textarea>
        <button
          type="submit"
          className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base">
          Send <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  )
}

export const ChatMessages = ({
  messages,
  runningMessage
}: {
  messages: ChatMessage[]
  runningMessage?: ChatMessage
}) => {
  return (
    <div className="flex-1 overflow-y-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-900 sm:text-base sm:leading-7">
      {messages.concat(runningMessage).map((message) => {
        if (!message?.message) return null
        return message.from === ChatMessageType.User ? (
          <div className="mb-4 flex rounded-xl bg-slate-900 px-2 py-6 sm:px-4">
            <img
              className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
              src="https://dummyimage.com/256x256/354ea1/ffffff&text=U"
            />
            <div className="flex max-w-3xl items-center rounded-xl">
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex rounded-xl bg-slate-900 px-2 py-6 sm:px-4">
            <img
              className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
              src="https://dummyimage.com/256x256/363536/ffffff&text=A"
            />
            <div className="flex max-w-3xl items-center">
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const preparePrompt = (messages: ChatMessage[]) => {
  let prompt = messages.reduce((acc, message) => {
    const sender = message.from === ChatMessageType.User ? "User" : "AI"
    return acc + sender + ": " + message.message + "\n"
  }, "")
  prompt += "AI: "
  return prompt
}

export const Search = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [runningMessage, setRunningMessage] = useState<ChatMessage>()

  const generatePort = usePort("generate")

  // const candleLLM = useMemo(() => {
  //   return new CandleLLM({})
  // }, [])

  const handleNewMessage = async (message: string) => {
    const updatedMessages = [
      ...messages,
      { from: ChatMessageType.User, message }
    ]
    setMessages((prevMessages) => [
      ...prevMessages,
      { from: ChatMessageType.User, message }
    ])

    generatePort.send({ prompt: preparePrompt(updatedMessages) })

    // // TODO: Fix state update logic.
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     from: ChatMessageType.AI,
    //     message: response?.generations?.[0]?.[0]?.text
    //   }
    // ])
  }

  useEffect(() => {
    const msg = generatePort?.data?.message
    const isRunning = generatePort?.data?.isRunning
    if (!msg) return
    if (isRunning) {
      setRunningMessage({
        from: ChatMessageType.AI,
        message: msg
      })
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          from: ChatMessageType.AI,
          message: msg
        }
      ])
      setRunningMessage(undefined)
    }
  }, [generatePort?.data])

  return (
    <div className="flex bg-slate-900">
      <SideBar />
      <div className="flex h-[100vh] w-full flex-col p-2">
        <ChatMessages messages={messages} runningMessage={runningMessage} />
        <ChatInput onNewMessage={handleNewMessage} />
      </div>
    </div>
  )
}

export default Search

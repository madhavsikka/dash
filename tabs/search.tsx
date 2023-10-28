import { useEffect, useState } from "react"

import "./style.css"

enum ChatMessageType {
  User = "user",
  AI = "ai"
}

interface ChatMessage {
  from: ChatMessageType
  message: string
}

const SideBar = () => {
  return (
    <aside className="flex">
      <div className="flex h-screen w-12 flex-col items-center space-y-8 border-r border-slate-300 bg-slate-50 py-8 dark:border-slate-700 dark:bg-slate-900 sm:w-16">
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
        {/* Discover */}
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
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
            <path d="M21 21l-6 -6"></path>
          </svg>
        </a>
        {/* User */}
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
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
            <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
          </svg>
        </a>
        {/* Settings */}
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
            <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"></path>
            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
          </svg>
        </a>
      </div>
      {/* Second Column */}
      <div className="h-screen w-52 overflow-y-auto bg-slate-50 py-8 dark:bg-slate-900 sm:w-60">
        <div className="flex items-start">
          <h2 className="inline px-5 text-lg font-medium text-slate-800 dark:text-slate-200">
            Chats
          </h2>
          <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-slate-200">
            24
          </span>
        </div>

        <div className="mx-2 mt-8 space-y-4">
          <form>
            <label htmlFor="chat-input" className="sr-only">
              Search chats
            </label>
            <div className="relative">
              <input
                id="search-chats"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                placeholder="Search chats"
                rows="1"
                required
              />
              <button
                type="submit"
                className="absolute bottom-2 right-2.5 rounded-lg p-2 text-sm text-slate-500 hover:text-blue-700 focus:outline-none sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M8 9h8"></path>
                  <path d="M8 13h5"></path>
                  <path d="M11.008 19.195l-3.008 1.805v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5"></path>
                  <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                  <path d="M20.2 20.2l1.8 1.8"></path>
                </svg>
                <span className="sr-only">Search chats</span>
              </button>
            </div>
          </form>

          <button className="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800">
            <h1 className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
              Tailwind Classes
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">12 Mar</p>
          </button>

          <button className="flex w-full flex-col gap-y-2 rounded-lg bg-slate-200 px-3 py-2 text-left transition-colors duration-200 focus:outline-none dark:bg-slate-800">
            <h1 className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
              explain quantum computing
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">10 Feb</p>
          </button>
          <button className="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800">
            <h1 className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
              How to create ERP Diagram
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">22 Jan</p>
          </button>
          <button className="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800">
            <h1 className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
              API Scaling Strategies
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">1 Jan</p>
          </button>
        </div>
      </div>
    </aside>
  )
}

const ChatInput = () => {
  return (
    <form className="mt-2">
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
          className="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
          placeholder="Enter your prompt"
          rows={1}
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

export const ChatMessages = ({ messages }: { messages: ChatMessage[] }) => {
  return (
    <div className="flex-1 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7">
      {messages.map((message) => {
        return message.from === "user" ? (
          <div className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
            <img
              className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
              src="https://dummyimage.com/256x256/354ea1/ffffff&text=A"
            />
            <div className="flex max-w-3xl items-center rounded-xl">
              <p>{message.message}</p>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
            <img
              className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
              src="https://dummyimage.com/256x256/363536/ffffff&text=U"
            />
            <div className="flex max-w-3xl items-center">
              <p>{message.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const Search = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: ChatMessageType.AI,
      message: "Hello! How can I help you today?"
    },
    {
      from: ChatMessageType.User,
      message: "I want to know about the weather in New York"
    },
    {
      from: ChatMessageType.AI,
      message: "The weather in New York is 22 degrees celsius"
    }
  ])

  return (
    <div className="flex">
      <SideBar />
      <div className="flex h-[100vh] w-full flex-col p-2">
        <ChatMessages messages={messages} />
        <ChatInput />
      </div>
    </div>
  )
}

export default Search

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

// The base URL of your deployed NestJS backend on Render
const API_URL = 'https://new-chatbot-backend-n4ob.onrender.com';

// Main App Component
const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    let currentSessionId = localStorage.getItem("chatSessionId");
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      localStorage.setItem("chatSessionId", currentSessionId);
    }
    setSessionId(currentSessionId);
    fetchHistory(currentSessionId);
  }, []);

  const fetchHistory = async (sid) => {
    if (!sid) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/chat/${sid}`);
      if (!response.ok) {
        // If history doesn't exist or there's an error, start with a welcome message
        setMessages([
          {
            text: "Hello! I'm NewsBot, your AI assistant for the latest news. How can I help you?",
            sender: "bot",
          },
        ]);
        throw new Error("Failed to fetch chat history or no history found.");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const chatHistory = data.flatMap((item) => [
          { text: item.user, sender: "user" },
          { text: item.bot, sender: "bot" },
        ]);
        setMessages(chatHistory);
      } else {
        setMessages([
          {
            text: "Hello! I'm NewsBot, your AI assistant for the latest news. How can I help you?",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: currentInput }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botMessage = { text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = async () => {
    if (!sessionId || isLoading) return;
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/api/chat/${sessionId}`, { method: "DELETE" });
      const newSessionId = uuidv4();
      localStorage.setItem("chatSessionId", newSessionId);
      setSessionId(newSessionId);
      setMessages([
        {
          text: "New session started. Ask me anything about the news!",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Failed to reset session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Icon Components
  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const BotIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );

  const SendIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );

  const ResetIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 mr-2"
    >
      <path d="M3 2v6h6" />
      <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
      <path d="M21 22v-6h-6" />
      <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
    </svg>
  );

  // Message Bubble Component
  const Message = ({ msg }) => {
    const isUser = msg.sender === "user";
    return (
      <div
        className={`flex items-start gap-3 my-4 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {!isUser && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <BotIcon />
          </div>
        )}
        <div
          className={`max-w-md p-3 rounded-xl ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-slate-700 text-slate-200 rounded-bl-none"
          }`}
        >
          <p className="text-sm leading-relaxed">{msg.text}</p>
        </div>
        {isUser && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-white">
            <UserIcon />
          </div>
        )}
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-start gap-3 my-4 justify-start">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
        <BotIcon />
      </div>
      <div className="max-w-md p-3 rounded-xl bg-slate-700 text-slate-200 rounded-bl-none">
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-slate-900 text-white flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950/70 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BotIcon /> NewsBot
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Your RAG-powered AI assistant for the latest news.
          </p>

          <button
            onClick={handleNewSession}
            disabled={isLoading}
            className="w-full mt-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <ResetIcon />
            New Session
          </button>
        </div>
        <div className="text-xs text-slate-500">
          <p>Session ID:</p>
          <p className="break-all">{sessionId}</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-800/50">
        <header className="bg-slate-900/80 p-4 border-b border-slate-700 flex justify-between items-center md:hidden">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <BotIcon /> NewsBot
          </h1>
          <button
            onClick={handleNewSession}
            disabled={isLoading}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-1 px-3 rounded-lg text-xs disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <ResetIcon />
            New
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <Message key={index} msg={msg} />
            ))}
            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1].sender === "user" && (
                <TypingIndicator />
              )}
            <div ref={chatEndRef} />
          </div>
        </main>

        <footer className="p-4 bg-slate-900/80 border-t border-slate-700">
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about the latest news..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-600"
              autoFocus
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <SendIcon />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default App;

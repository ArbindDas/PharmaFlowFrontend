
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Bot,
  MessageCircle,
  Sparkles,
  RefreshCw,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const OpenAIPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const { isDarkMode, toggleDarkMode } = useTheme();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: prompt };
    setChatHistory((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const response = await fetch("http://localhost:8080/api/ollama/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.response };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };



  const formatMessage = (content) => {
  // First process code blocks (triple backticks)
  let formatted = content.replace(
    /```([a-z]*)\n([\s\S]*?)```/g,
    `<pre class="${
      isDarkMode ? "bg-gray-800" : "bg-gray-100"
    } p-4 rounded-md overflow-x-auto my-3"><code class="block text-sm font-mono">$2</code></pre>`
  );

  // Then process inline code (single backticks)
  formatted = formatted.replace(
    /`([^`]+)`/g,
    `<code class="${
      isDarkMode ? "bg-gray-700" : "bg-gray-100"
    } px-2 py-1 rounded text-sm font-mono">$1</code>`
  );

  // Process bold and italics
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");

  return formatted;
};

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <div
        className={`min-h-screen flex flex-col ${
          isDarkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 ${
            isDarkMode
              ? "bg-gray-800/90 border-gray-700"
              : "bg-white/90 border-gray-200"
          } backdrop-blur-sm border-b`}
        >
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">AI Assistant</h1>
            </div>
            <div className="flex items-center gap-4">
              {chatHistory.length > 0 && (
                <button
                  onClick={clearChat}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Chat
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {chatHistory.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">
                    How can I help you today?
                  </h2>
                  <p
                    className={`max-w-md mx-auto ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    I'm here to assist you with questions, creative tasks,
                    analysis, and more. What would you like to explore?
                  </p>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-3xl ${
                        message.role === "user" ? "order-first" : ""
                      }`}
                    >
                      <div
                        className={`rounded-xl p-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                            : isDarkMode
                            ? "bg-gray-800"
                            : "bg-white shadow-sm"
                        } ${
                          message.role === "assistant" &&
                          (isDarkMode ? "border-gray-700" : "border-gray-200")
                        }`}
                      >
                        <div
                          className={`prose ${
                            isDarkMode ? "prose-invert" : ""
                          } max-w-none`}
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message.content),
                          }}
                        />
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className={`rounded-xl p-4 ${
                      isDarkMode ? "bg-gray-800" : "bg-white shadow-sm"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex gap-1">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            isDarkMode ? "bg-gray-500" : "bg-gray-400"
                          }`}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            isDarkMode ? "bg-gray-500" : "bg-gray-400"
                          }`}
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            isDarkMode ? "bg-gray-500" : "bg-gray-400"
                          }`}
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div
              className={`sticky bottom-0 border-t ${
                isDarkMode ? "border-gray-700 bg-gray-800/80" : "border-gray-200 bg-white/80"
              } backdrop-blur-sm`}
            >
              <div className="px-4 py-4">
                <form onSubmit={handleSubmit} className="relative">
                  <div
                    className={`relative flex items-end gap-3 rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message AI Assistant..."
                      className={`flex-1 p-4 bg-transparent resize-none focus:outline-none min-h-[20px] max-h-32 ${
                        isDarkMode
                          ? "placeholder-gray-400 text-white"
                          : "placeholder-gray-500 text-gray-800"
                      }`}
                      disabled={isLoading}
                      rows="1"
                    />
                    <button
                      type="submit"
                      className={`m-2 p-2 rounded-xl transition-all ${
                        isLoading || !prompt.trim()
                          ? isDarkMode
                            ? "bg-gray-600 text-gray-400"
                            : "bg-gray-100 text-gray-400"
                          : "bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-md"
                      }`}
                      disabled={isLoading || !prompt.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
                <p
                  className={`text-xs mt-2 text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAIPage;
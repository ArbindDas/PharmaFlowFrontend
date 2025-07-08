import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, MessageCircle, Sparkles, RefreshCw } from 'lucide-react';

const OpenAIPage = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [prompt]);




const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt.trim();
    setPrompt('');
    
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    try {
        const res = await fetch('http://localhost:8080/api/chat-gpt/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userMessage }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            if (res.status === 429) {
                // Show user-friendly message with retry suggestion
                throw new Error('The AI is currently busy. Please wait a moment and try again.');
            } else {
                throw new Error(data.error || `Error: ${res.statusText}`);
            }
        }
        
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
        setChatHistory(prev => [...prev, { 
            role: 'assistant', 
            content: error.message // Show cleaner error message
        }]);
    } finally {
        setIsLoading(false);
    }
};
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const clearChat = () => {
        setChatHistory([]);
    };

    const formatMessage = (content) => {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">AI Assistant</h1>
                    </div>
                    {chatHistory.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Clear Chat
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                        {chatHistory.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    I'm here to assist you with questions, creative tasks, analysis, and more. 
                                    What would you like to explore?
                                </p>
                            </div>
                        ) : (
                            chatHistory.map((message, index) => (
                                <div 
                                    key={index} 
                                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    
                                    <div className={`max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
                                        <div className={`rounded-2xl px-4 py-3 ${
                                            message.role === 'user' 
                                                ? 'bg-blue-500 text-white ml-auto' 
                                                : 'bg-white shadow-sm border border-gray-200'
                                        }`}>
                                            <div 
                                                className={`whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}
                                                dangerouslySetInnerHTML={{ 
                                                    __html: formatMessage(message.content) 
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {message.role === 'user' && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        
                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
                        <div className="px-4 py-4">
                            <form onSubmit={handleSubmit} className="relative">
                                <div className="relative flex items-end gap-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <textarea
                                        ref={textareaRef}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Message AI Assistant..."
                                        className="flex-1 p-4 bg-transparent resize-none focus:outline-none placeholder-gray-500 text-gray-800 min-h-[20px] max-h-32"
                                        disabled={isLoading}
                                        rows="1"
                                    />
                                    <button
                                        type="submit"
                                        className={`m-2 p-2 rounded-xl transition-all ${
                                            isLoading || !prompt.trim()
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md'
                                        }`}
                                        disabled={isLoading || !prompt.trim()}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Press Enter to send, Shift+Enter for new line
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenAIPage;
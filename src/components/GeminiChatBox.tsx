import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';
import { Chapter } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface GeminiChatBoxProps {
  chapters: Chapter[];
  initialChapterContext?: string;
}

const QUICK_PROMPTS = [
  'Explain Workings 1 to 5 for Consolidated Financial Position',
  'How do I calculate Right-of-Use Asset and Lease Liability under IFRS 16?',
  'What are the PIRATE criteria for capitalising development expenditure in IAS 38?',
  'Explain the 5-step revenue recognition model in IFRS 15 with an example',
  'Give me a summary of how to allocate impairment to a CGU under IAS 36',
  'How do I calculate basic vs diluted EPS with rights and bonus issues?',
];

export const GeminiChatBox: React.FC<GeminiChatBoxProps> = ({
  chapters,
  initialChapterContext,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm your ACCA FR Gemini AI Study Assistant. Ask me any conceptual question, standard treatment (IFRS/IAS), consolidation workings, or exam kit doubts!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialChapterContext || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const chapterObj = chapters.find((c) => c.id === selectedChapterId);
    const chapterContext = chapterObj ? `${chapterObj.code} - ${chapterObj.name}` : undefined;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          chapterContext,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I'm reviewing your ACCA FR question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'Network error';
      const errorMessage: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Could not reach Gemini AI tutor: ${errText}. Please verify your connection or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-new',
        sender: 'bot',
        text: '🧹 Chat cleared! How can I help you with your ACCA Financial Reporting prep?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 rounded-full px-4 py-3 font-semibold shadow-2xl transition-all ${
            isOpen
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/25'
          }`}
          title="Open Gemini ACCA FR Tutor"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold tracking-tight">
            {isOpen ? 'Close Tutor' : 'Gemini FR Tutor'}
          </span>
        </motion.button>
      </div>

      {/* Interactive Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed bottom-20 right-4 z-40 flex flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl backdrop-blur-2xl transition-all ${
              isExpanded
                ? 'h-[85vh] w-[95vw] sm:w-[650px] bottom-6'
                : 'h-[540px] w-[94vw] sm:w-[420px]'
            }`}
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                    <Bot className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white">Gemini FR AI Tutor</h3>
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-emerald-400">
                      3.8 Flash
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Financial Reporting Exam Assistant</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Clear chat history"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:block rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title={isExpanded ? 'Restore size' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chapter Context Selector */}
            <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/40 px-3 py-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] text-slate-400 shrink-0">Focus Standard:</span>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full truncate rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">General ACCA FR Syllabus</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.code} - {ch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                        isBot
                          ? 'border border-slate-800 bg-slate-950/80 text-slate-200'
                          : 'bg-emerald-500 font-medium text-slate-950 shadow-md shadow-emerald-500/15'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="whitespace-pre-wrap font-sans text-xs">
                        {msg.text}
                      </div>

                      {/* Footer & Copy */}
                      <div className={`mt-1.5 flex items-center justify-between gap-3 text-[10px] ${
                        isBot ? 'text-slate-500' : 'text-slate-900/70'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {isBot && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="hover:text-emerald-400 transition-colors"
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {!isBot && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Shimmer Loading */}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px]">Solving IFRS standards &amp; workings...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="border-t border-slate-800/80 bg-slate-950/40 px-3 py-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-500 shrink-0 font-medium">Try:</span>
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="shrink-0 rounded-lg border border-slate-800 bg-slate-900/90 px-2 py-0.5 text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 whitespace-nowrap"
                  >
                    {prompt.length > 32 ? prompt.substring(0, 32) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="border-t border-slate-800 bg-slate-950 p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask Gemini: e.g. How to do Workings 1-5 for consolidation?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-40"
                  title="Send question"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

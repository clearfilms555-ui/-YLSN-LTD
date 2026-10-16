import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Phone,
  MessageSquare,
  Volume2,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AICustomerAssistantProps {
  currentLanguage: Language;
  phone: string;
  whatsappNumber: string;
  onOpenServiceModal: (type?: string) => void;
  onOpenQuoteModal: () => void;
}

export const AICustomerAssistant: React.FC<AICustomerAssistantProps> = ({
  currentLanguage,
  phone,
  whatsappNumber,
  onOpenServiceModal,
  onOpenQuoteModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[currentLanguage];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: t.aiGreeting,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update greeting when language switches if no other messages
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: 'msg-welcome',
            sender: 'ai',
            text: t.aiGreeting,
            time: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [currentLanguage]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: currentLanguage,
          history: messages.slice(-4),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: data.reply || 'Thank you for contacting YLSN LTD. Our team will assist you.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Chat API returned non-200');
      }
    } catch (err) {
      console.warn('AI chat error:', err);
      const fallbackMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: `Thank you for your question! For prompt assistance regarding sound packages, gear specs, or rental bookings, please reach our live team at ${phone} or via WhatsApp.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    t.aiSuggestedPrompt1,
    t.aiSuggestedPrompt2,
    t.aiSuggestedPrompt3,
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-500 text-white shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2.5 border-2 border-white/20 group cursor-pointer"
          aria-label="Open AI Sound Consultant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#07090E]"></span>
          </div>
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            {t.aiAssistantTitle}
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 hidden sm:inline group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 sm:bottom-24 right-2 sm:right-6 z-50 w-[96vw] sm:w-[420px] max-w-full h-[580px] max-h-[85vh] bg-[#0E131F] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#07090E] via-[#0E131F] to-[#07090E] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-500/50 bg-black">
                <img
                  src="/ylsn_logo.jpg"
                  alt="YLSN"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-black text-sm text-white">
                    YLSN Audio AI
                  </h3>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 5 Languages Supported
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'msg-welcome',
                      sender: 'ai',
                      text: t.aiGreeting,
                      time: 'Just now',
                    },
                  ])
                }
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Hotline Notice in Chat */}
          <div className="px-3.5 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
            <span>Direct Hotline: <strong>{phone}</strong></span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded hover:bg-amber-400"
            >
              Call Now
            </a>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#07090E]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-md leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-br-none'
                      : 'bg-[#121724] border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1.5 ${
                      msg.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-2">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>YLSN Sound Consultant is analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-3 pt-2 pb-1 border-t border-slate-800/80 bg-[#0E131F] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#07090E] border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={t.aiChatPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer"
                title={t.aiSend}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenQuoteModal();
                }}
                className="hover:text-amber-400 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" /> Get Official Quote
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Hello YLSN LTD, I was chatting with your AI assistant and want to speak with a human sound engineer.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3 text-emerald-400" /> WhatsApp Direct
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

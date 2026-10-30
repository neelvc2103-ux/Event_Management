'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { EventPlan, ChatMessage } from '@/types';

interface ChatDrawerProps {
  plan: EventPlan;
  onApplyPlanUpdate: (updatedPlan: EventPlan) => void;
}

export function ChatDrawer({ plan, onApplyPlanUpdate }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste! 👋 I'm your Event Bestie & co-pilot for **${plan.formData.eventName}**! Need to trim ₹50,000 off decor, figure out how to handle the 10 PM sound curfew, or plan midnight snack boxes for cousins? Ask me anything! 🎉`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          message: userMsg.content,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      let appliedSummary: string | undefined = undefined;

      if (data.updatedPlan) {
        onApplyPlanUpdate(data.updatedPlan);
        appliedSummary = 'Live plan updates have been applied to your dashboard!';
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appliedChangesSummary: appliedSummary,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: `Apologies, I encountered an issue: ${err.message}. Please try asking again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    '💡 How can I save ₹1 Lakh without cutting guests?',
    '🔊 How do we manage the 10 PM sound curfew?',
    '🥘 What live food stations work best for this city?',
    '📝 What key questions should I ask the decorator?',
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-primary to-maroon-800 text-white font-bold text-xs sm:text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all no-print border border-accent/30"
        aria-label="Open Event Bestie"
      >
        <span className="text-base">💬</span>
        <span>Event Bestie (Ask Anything!)</span>
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
      </button>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 no-print transition-opacity"
        />
      )}

      {/* Slide-over Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-drawer-title"
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-card border-l border-border z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:px-6 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 id="chat-drawer-title" className="text-sm font-bold text-foreground">Event Bestie & Co-Pilot</h3>
              <p className="text-[11px] text-muted-foreground">Real tips & tricks for Indian celebrations</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close Assistant"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-1.5 ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-muted/70 text-foreground border border-border rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line text-xs leading-relaxed">{msg.content}</div>

                {msg.appliedChangesSummary && (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{msg.appliedChangesSummary}</span>
                  </div>
                )}

                <div
                  className={`text-[10px] text-right ${
                    msg.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-muted/40 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>AYOJA is thinking & consulting regional guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-border/60 bg-background/50 flex flex-wrap gap-1.5 overflow-x-auto">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question or request a plan change..."
              aria-label="Ask a question or request a plan change"
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

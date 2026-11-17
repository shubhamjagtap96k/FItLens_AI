"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UserProfile,
  MealLog,
  WorkoutLog,
  DailyTotals,
  ChatMessage,
} from "@/types";
import { AIDietitianCoach } from "@/lib/ai/dietitian-coach";
import {
  Bot,
  User,
  Send,
  Sparkles,
  X,
  Flame,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

interface AICoachChatProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  meals: MealLog[];
  workouts: WorkoutLog[];
  totals: DailyTotals;
}

const PRESET_QUESTIONS = [
  "How much protein did I eat today?",
  "What should I eat after workout?",
  "Am I in calorie deficit?",
  "Suggest a diet plan for tomorrow",
  "Show my last month's report",
];

export const AICoachChat: React.FC<AICoachChatProps> = ({
  isOpen,
  onClose,
  user,
  meals,
  workouts,
  totals,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "coach",
      text: `Hello ${user.name}! 👋 I'm your **FitLens Personal AI Coach & Dietitian**. I have your continuous biometrics loaded: **${user.goal.replace("_", " ")}** target, **${user.targets.calories} kcal budget**, and **${user.dietaryPreference}** dietary preferences. How can I help you optimize your nutrition and fitness today?`,
      timestamp: "Just now",
      suggestedActions: PRESET_QUESTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Call AI coach engine
    setTimeout(() => {
      const response = AIDietitianCoach.generateCoachResponse(
        text,
        user,
        meals,
        workouts,
        totals
      );

      const coachMsg: ChatMessage = {
        id: "coach-" + Date.now(),
        sender: "coach",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: response.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl h-[85vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-fitness-green/20 text-fitness-green border border-fitness-green/40">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-fitness-green animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Personal AI Nutrition Coach</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Aware of your real-time intake: {totals.calories} kcal • {totals.protein.toFixed(0)}g Protein
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Context Strip */}
        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300 overflow-x-auto">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Target: <strong>{user.targets.calories} kcal</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span>
            Goal: <strong>{user.goal.replace("_", " ")}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span>
            Diet: <strong>{user.dietaryPreference}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-fitness-green font-bold">
            Deficit: {user.tdee - totals.netCalories} kcal
          </span>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-fitness-green/20 text-fitness-green flex items-center justify-center shrink-0 border border-fitness-green/30 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? "bg-fitness-green text-slate-950 font-medium rounded-tr-sm"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm space-y-2"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Timestamp */}
                  <div
                    className={`text-[9px] mt-1.5 ${
                      isUser ? "text-slate-800 text-right" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>

                  {/* Suggested Follow-up chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 transition-colors flex items-center gap-1"
                        >
                          <span>{action}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-fitness-green" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-full bg-fitness-green/20 text-fitness-green flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fitness-green animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-fitness-green animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-fitness-green animate-bounce delay-200" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 space-y-2">
          {/* Quick preset questions row */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            {PRESET_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Can I eat paneer paratha?', 'How is my fiber?')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fitness-green"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim()}
              className="px-4 py-2.5 rounded-2xl bg-fitness-green hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all active:scale-95 flex items-center justify-center"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

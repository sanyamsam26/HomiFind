import React, { useState } from "react";
import {
  Send,
  Sparkles,
  Calendar,
  Phone,
  Share2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Plus,
  Building,
  ArrowUp
} from "lucide-react";
import { Message, Property } from "../types/database";

interface MessagesViewProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBookVisit?: () => void;
  onCompare?: () => void;
}

export function MessagesView({
  messages,
  onSendMessage,
  onBookVisit,
  onCompare,
}: MessagesViewProps) {
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputText, setInputText] = useState("");
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [aiSidebarNotes, setAiSidebarNotes] = useState<string | null>(null);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleAskAiAboutChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptInput.trim()) return;
    setAiSidebarNotes(`AI Analysis for "${aiPromptInput}": Based on Sarah's response, water/gas are covered by the building HOA, but electricity is paid directly through Austin Energy.`);
    setAiPromptInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm min-h-[680px] overflow-hidden">
      {/* 1. Left List Col (3 cols) */}
      <div className="lg:col-span-3 border-r border-slate-200 bg-slate-50/50 p-4 space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 px-2">Messages</h2>

        <div className="space-y-2">
          {[
            {
              id: "conv-1",
              title: "The Lumina Lofts",
              time: "10:42 AM",
              preview: "Sarah (Owner): Yes, parking is included in rent.",
              unread: true,
            },
            {
              id: "conv-2",
              title: "Oasis Residences",
              time: "Yesterday",
              preview: "David: We can negotiate the move-in date.",
              unread: false,
            },
          ].map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full p-3 rounded-xl text-left transition flex items-start space-x-3 ${
                activeConvId === conv.id
                  ? "bg-white shadow-sm ring-1 ring-slate-200"
                  : "hover:bg-slate-100"
              }`}
            >
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                LL
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-slate-900 text-xs truncate">{conv.title}</p>
                  <span className="text-[10px] text-slate-400">{conv.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.preview}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Center Chat Col (6 cols) */}
      <div className="lg:col-span-6 flex flex-col justify-between bg-white border-r border-slate-200">
        {/* Chat Mini Property Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
              alt="Property"
              className="h-12 w-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">The Lumina Lofts</h3>
              <p className="text-xs text-slate-500 font-medium">$3,200/mo • 2 Bed • 2 Bath</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <button
              onClick={onBookVisit}
              className="px-3 py-1.5 bg-indigo-900 text-white rounded-lg hover:bg-indigo-950 transition flex items-center space-x-1"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Visit</span>
            </button>
            <button
              onClick={onCompare}
              className="px-2.5 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Compare
            </button>
            <button className="px-2.5 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
              <Phone className="h-3.5 w-3.5" />
            </button>
            <button className="px-2.5 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Message Thread Stream */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[440px]">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Today, 9:30 AM
            </span>
          </div>

          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-sm bg-indigo-900 text-white p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-sm">
              Hi Sarah, I'm very interested in The Lumina Lofts. Could you clarify if parking is included in the $3,200 rent, and what the utility situation is?
            </div>
          </div>

          {/* Owner Message */}
          <div className="flex items-start space-x-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
              S
            </div>
            <div className="max-w-sm bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed border border-slate-200/60">
              Hi! Thanks for reaching out. Yes, one underground parking spot is included in the rent. For utilities, water and gas are covered, but electricity and WiFi are separate.
            </div>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender_id === "user-renter-1" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-sm p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender_id === "user-renter-1"
                    ? "bg-indigo-900 text-white rounded-tr-none"
                    : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips & Input */}
        <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => onSendMessage("Is WiFi included?")}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium px-3 py-1 rounded-full border border-amber-200/80 transition flex items-center space-x-1"
            >
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>Is WiFi included?</span>
            </button>
            <button
              onClick={() => onSendMessage("Can I negotiate rent?")}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium px-3 py-1 rounded-full border border-amber-200/80 transition flex items-center space-x-1"
            >
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>Can I negotiate rent?</span>
            </button>
          </div>

          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Message Sarah..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl font-bold transition shadow-sm"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Right AI Assistant Sidebar (3 cols) */}
      <div className="lg:col-span-3 bg-slate-50/80 p-5 space-y-5">
        <div className="flex items-center space-x-2 text-indigo-950 font-extrabold text-sm">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>AI Assistant</span>
        </div>

        {/* Conversation Summary */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversation Summary</p>
          <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
            You are discussing utility and parking terms for The Lumina Lofts. The owner is responsive and open to scheduling a visit.
          </p>
        </div>

        {/* Extracted Facts */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Extracted Facts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
              <p className="text-[10px] text-slate-400">Move-in Date</p>
              <p className="font-bold text-slate-800 mt-0.5">Unknown</p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-emerald-200 bg-emerald-50/30">
              <p className="text-[10px] text-emerald-700 font-medium">Parking</p>
              <p className="font-bold text-emerald-800 mt-0.5 flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Included</span>
              </p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
              <p className="text-[10px] text-slate-400">Deposit</p>
              <p className="font-bold text-slate-800 mt-0.5">Unknown</p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-red-200 bg-red-50/30">
              <p className="text-[10px] text-red-700 font-medium">WiFi</p>
              <p className="font-bold text-red-800 mt-0.5 flex items-center space-x-1">
                <XCircle className="h-3 w-3" />
                <span>Extra</span>
              </p>
            </div>
          </div>
        </div>

        {/* Negotiable Items */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Negotiable Items</p>
          <ul className="text-xs text-slate-700 space-y-1 pl-1">
            <li className="flex items-center space-x-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
              <span>Move-in date flexibility</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
              <span>Pet deposit (often waivable)</span>
            </li>
          </ul>
        </div>

        {/* Unanswered Questions */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unanswered Questions</p>
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium">
            Are pets allowed in the building?
          </div>
        </div>

        {aiSidebarNotes && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 leading-relaxed">
            {aiSidebarNotes}
          </div>
        )}

        {/* Ask AI Prompt Input */}
        <form onSubmit={handleAskAiAboutChat} className="pt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask AI about this chat..."
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button type="submit" className="absolute right-2 top-2 text-indigo-600">
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

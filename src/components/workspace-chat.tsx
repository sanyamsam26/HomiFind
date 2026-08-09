import React, { useState } from "react";
import {
  Send,
  Paperclip,
  Smile,
  ShieldCheck,
  Building,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import { Message, Profile } from "../types/database";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface WorkspaceChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  currentUserId?: string;
  recipientName?: string;
  recipientRole?: string;
}

export function WorkspaceChat({
  messages,
  onSendMessage,
  currentUserId = "user-1",
  recipientName = "Sarah Jenkins (Property Owner)",
  recipientRole = "owner",
}: WorkspaceChatProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="flex h-[550px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3.5">
        <div className="flex items-center space-x-3">
          <Avatar name={recipientName} role={recipientRole} size="md" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{recipientName}</h4>
            <p className="text-xs text-slate-500 flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
              Active Now • Realtime Supabase Channel
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Encrypted Direct Messaging</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <Building className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-medium">No messages yet in this conversation.</p>
            <p className="text-xs text-slate-400 mt-1">
              Inquire about lease terms, scheduling tours, or maintenance.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-xs ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <div className="mt-1 flex items-center space-x-1 text-[10px] text-slate-400 px-1">
                  <span>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCheck className="h-3 w-3 text-emerald-600" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center space-x-2 border-t border-slate-200 bg-white p-3"
      >
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Write a message or ask a question about the property..."
          className="flex-1 rounded-xl h-10 border-slate-300 text-xs"
        />

        <Button
          type="submit"
          disabled={!inputText.trim()}
          className="rounded-xl h-10 px-4 bg-emerald-600 hover:bg-emerald-700 font-bold"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

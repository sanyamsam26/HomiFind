import React from "react";
import { useApp } from "../../context/AppContext";
import { MessagesView } from "../../components/messages-view";

export function OwnerMessagesPage() {
  const { messages, handleSendMessage } = useApp();

  return (
    <div className="space-y-6">
      <MessagesView
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

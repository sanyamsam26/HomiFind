import React from "react";
import { useApp } from "../../context/AppContext";
import { MessagesView } from "../../components/messages-view";
import { useNavigate } from "react-router-dom";

export function MessagesPage() {
  const { messages, handleSendMessage, properties } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <MessagesView
        messages={messages}
        onSendMessage={handleSendMessage}
        onBookVisit={() => {
          if (properties[0]) navigate(`/app/properties/${properties[0].id}`);
        }}
        onCompare={() => navigate("/app/compare")}
      />
    </div>
  );
}

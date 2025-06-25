import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./ChatPanel.css";

function ChatPanelFirebase({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) =>
      setMessages(snapshot.docs.map((doc) => doc.data()))
    );
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    await addDoc(collection(db, "messages"), {
      user: user.email,
      text: newMsg.trim(),
      createdAt: serverTimestamp(),
    });
    setNewMsg("");
  };

  return (
    <div className="chat-panel">
      <h3>💬 Chat użytkowników</h3>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Napisz wiadomość..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Wyślij</button>
      </div>
    </div>
  );
}

export default ChatPanelFirebase;

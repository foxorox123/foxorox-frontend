import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";
import "./ChatPanel.css";

function ChatPanelFirebase({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);

  // 🔁 Usuwanie wiadomości nie z dzisiaj
  useEffect(() => {
    const clearOldMessages = async () => {
      const q = query(collection(db, "messages"));
      const snapshot = await getDocs(q);
      const today = new Date().toDateString();

      for (const docSnap of snapshot.docs) {
        const msg = docSnap.data();
        const msgDate = msg.createdAt?.toDate?.().toDateString?.();
        if (msgDate && msgDate !== today) {
          await deleteDoc(doc(db, "messages", docSnap.id));
        }
      }
    };

    clearOldMessages();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) =>
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    await addDoc(collection(db, "messages"), {
      user: user.email,
      text: newMsg.trim(),
      createdAt: serverTimestamp(),
      likes: 0,
    });
    setNewMsg("");
    setShowEmoji(false);
  };

  const handleLike = async (id, currentLikes) => {
    const messageRef = doc(db, "messages", id);
    await updateDoc(messageRef, { likes: currentLikes + 1 });
  };

  const addEmoji = (emojiData) => {
    setNewMsg((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="chat-panel">
      <h3>💬 FoxChat</h3>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.user === user.email ? "own" : ""}`}
          >
            <div className="chat-avatar">
              {msg.user?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="chat-bubble">
              <div className="chat-text">{msg.text}</div>
              <div className="chat-actions">
                <button
                  className="like-button"
                  onClick={() => handleLike(msg.id, msg.likes || 0)}
                >
                  👍 {msg.likes || 0}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Write your tip..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button onClick={handleSend}>Wyślij</button>
      </div>

      {showEmoji && (
        <div className="emoji-picker left">
          <EmojiPicker onEmojiClick={addEmoji} />
        </div>
      )}
    </div>
  );
}

export default ChatPanelFirebase;

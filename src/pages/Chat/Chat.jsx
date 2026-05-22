import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./Chat.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import botAvatar from "../../assets/bot.png";

import { post } from "../../services/api";

export default function Chat() {
  const [searchParams] = useSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // 🧠 INIT
  useEffect(() => {
    const start = searchParams.get("start");

    setMessages([
      {
        from: "bot",
        text: start
          ? "Hola 👋 soy Claud IA. Cuéntame tu situación en Bogotá."
          : "Hola 👋 soy Claud IA. ¿Qué necesitas?",
      },
    ]);
  }, [searchParams]);

  // 🔽 auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🎯 focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 🚀 SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();

    setMessages((prev) => [...prev, { from: "user", text: userText }]);

    setInput("");
    setIsTyping(true);

    try {
      console.log("📤 Enviando:", userText);

      const res = await post("/api/ai/chat", {
        message: userText,
      });

      console.log("📥 RESPUESTA RAW BACKEND:", res);

      const botResponse =
        res?.data?.data ||
        res?.data ||
        res?.message ||
        "Sin respuesta del servidor";

      console.log("🤖 BOT RESPONSE FINAL:", botResponse);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: botResponse,
        },
      ]);

    } catch (err) {
      console.error("❌ ERROR CHAT:", err);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "❌ Error conectando con el servidor",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <Navbar />

      <div className="chat-page">

        {/* HEADER */}
        <div className="chat-header">
          <div className="chat-avatar">
            <img src={botAvatar} alt="Claud IA" />
          </div>

          <div className="chat-header-info">
            <h2>Claud IA</h2>
            <span className="chat-status">
              {isTyping ? "Escribiendo..." : "En línea"}
            </span>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-row ${msg.from}`}>
              <div className="chat-bubble">

                {/* 🔥 MARKDOWN SOLO PARA BOT */}
                {msg.from === "bot" ? (
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}

              </div>
            </div>
          ))}

          {/* typing animation */}
          {isTyping && (
            <div className="chat-row bot">
              <div className="chat-bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Cuéntame qué pasó…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            ➤
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
}
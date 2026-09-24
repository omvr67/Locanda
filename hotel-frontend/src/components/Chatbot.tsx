import { useState } from "react";
import { Maximize2, MessageCircle, Minimize2, Send, Star, X } from "lucide-react";

type Message = { sender: "bot" | "user"; text: string };

const welcomeMessage = "Welcome to Locanda. How may I make your stay more considered?";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ sender: "bot", text: welcomeMessage }]);
  const [input, setInput] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  const sendMessage = async () => {
    if (!input.trim()) return;
    const message = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setInput("");
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Failed to reach concierge:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "The concierge is momentarily away. Please try again shortly." }]);
    }
  };

  const submitRating = async (rating: number) => {
    try {
      await fetch("http://localhost:8000/rate-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, rating }),
      });
    } catch (error) {
      console.error("Failed to save rating:", error);
    }
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsExpanded(false);
      setTimeout(() => {
        setIsEnded(false);
        setSubmitted(false);
        setMessages([{ sender: "bot", text: welcomeMessage }]);
        setSessionId(crypto.randomUUID());
      }, 500);
    }, 2000);
  };

  return (
    <div className={`concierge-widget ${isOpen ? "is-open" : ""} ${isExpanded ? "is-expanded" : ""}`}>
      {isOpen ? (
        <div className="concierge-panel">
          <header className="concierge-header">
            <div><span className="concierge-mark">L</span><div><p>LOCANDA</p><small>Digital concierge</small></div></div>
            <div className="concierge-actions">
              {!isEnded && <button onClick={() => setIsEnded(true)}>End chat</button>}
              <button aria-label={isExpanded ? "Minimize concierge" : "Expand concierge"} onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
              <button aria-label="Close concierge" onClick={() => setIsOpen(false)}><X size={17} /></button>
            </div>
          </header>
          {isEnded ? (
            <div className="concierge-ended">
              {submitted ? <><h3>Thank you.</h3><p>Your feedback helps us tend to every detail.</p></> : <><h3>How was your visit?</h3><p>Rate your digital concierge.</p><div className="rating-row">{[1, 2, 3, 4, 5].map((star) => <button key={star} aria-label={`${star} stars`} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} onClick={() => submitRating(star)}><Star size={23} className={hoveredRating >= star ? "selected" : ""} /></button>)}</div></>}
            </div>
          ) : (
            <>
              <div className="concierge-messages">
                {messages.map((msg, idx) => <div key={idx} className={`concierge-message ${msg.sender}`}>{msg.text}</div>)}
              </div>
              <div className="concierge-input"><input aria-label="Message the concierge" placeholder="Write to the concierge…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} /><button aria-label="Send message" onClick={sendMessage}><Send size={15} /></button></div>
            </>
          )}
        </div>
      ) : <button className="concierge-trigger" aria-label="Open digital concierge" onClick={() => setIsOpen(true)}><MessageCircle size={21} /><span>Concierge</span></button>}
    </div>
  );
}

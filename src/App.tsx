import "./App.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "👋 Hi there! How can I assist you today?",
    },
  ]);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async () => {
    if (!value.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: value.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chatbot", {
        question: userMessage.text,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.data,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "⚠️ Sorry, something went wrong fetching the response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-app">
      {/* Header */}
      <header className="chat-header">
        <div className="bot-avatar">🤖</div>
        <div>
          <h2>AI Assistant</h2>
          <span className="status">● Online</span>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="chat-feed">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === "bot" ? "🤖" : "👤"}
            </div>
            <div className="bubble">
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row bot">
            <div className="avatar">🤖</div>
            <div className="bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={loading}
            placeholder="Ask anything..."
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !value.trim()}
            className="send-btn"
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

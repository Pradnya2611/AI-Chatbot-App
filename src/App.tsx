import "./App.css";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [response, setResponse] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!value) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("/api/chatbot", {
        question: value,
      });
      setResponse(res.data);
    } catch (err) {
      console.error("API Error:", err);
      setResponse("⚠️ Error fetching response from backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>🤖 AI Chatbot</h2>

      <div className="input-section">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading}
          placeholder="Type your question here..."
        />
        <button onClick={handleSubmit} disabled={loading || !value}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      <div className="response-box">
        {loading ? (
          <p className="loading">⏳ Please wait, fetching response...</p>
        ) : (
          <>
            <h3>💬 Chatbot Response:</h3>
            {response ? (
              <div className="markdown-content">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            ) : (
              <p className="bot-prompt">Hii there! How can I assist you?</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

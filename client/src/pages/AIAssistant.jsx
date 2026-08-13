import { useState } from "react";
import "./AIAssistant.css";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        "http://localhost:5000/api/ai/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI request failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.answer,
        },
      ]);

    } catch (error) {
      console.error("AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ ${error.message}`,
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="ai-page">

      {/* HEADER */}

      <div className="ai-header">

        <div>
          <p className="ai-tagline">
            🤖 ENGINEVERSE AI
          </p>

          <h1>
            Engineering <span>AI Assistant</span>
          </h1>

          <p>
            Ask questions, generate project ideas,
            improve your resume and prepare for your career.
          </p>
        </div>

        <button
          className="clear-btn"
          onClick={clearChat}
        >
          🗑️ Clear Chat
        </button>

      </div>


      {/* CHAT AREA */}

      <div className="ai-chat-container">

        {messages.length === 0 && (

          <div className="ai-welcome">

            <div className="ai-icon">
              🤖
            </div>

            <h2>
              Hello, Engineer! 👋
            </h2>

            <p>
              I'm your EngiVerse AI Assistant.
              How can I help you today?
            </p>

            <div className="suggestions">

              <button
                onClick={() =>
                  setMessage(
                    "Give me 5 innovative IoT project ideas."
                  )
                }
              >
                💡 Project Ideas
              </button>

              <button
                onClick={() =>
                  setMessage(
                    "Help me improve my engineering resume."
                  )
                }
              >
                📄 Resume Help
              </button>

              <button
                onClick={() =>
                  setMessage(
                    "How should I prepare for a software engineering internship?"
                  )
                }
              >
                🎯 Internship Preparation
              </button>

              <button
                onClick={() =>
                  setMessage(
                    "Explain MERN stack in simple terms."
                  )
                }
              >
                💻 Learn MERN
              </button>

            </div>

          </div>

        )}


        {/* MESSAGES */}

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`chat-message ${
              msg.sender === "user"
                ? "user-message"
                : "ai-message"
            }`}
          >

            <div className="message-avatar">
              {msg.sender === "user"
                ? "👤"
                : "🤖"}
            </div>

            <div className="message-content">

              <strong>
                {msg.sender === "user"
                  ? "You"
                  : "EngiVerse AI"}
              </strong>

              <p>
                {msg.text}
              </p>

            </div>

          </div>

        ))}


        {/* LOADING */}

        {loading && (

          <div className="chat-message ai-message">

            <div className="message-avatar">
              🤖
            </div>

            <div className="message-content">

              <strong>
                EngiVerse AI
              </strong>

              <p className="typing">
                Thinking...
              </p>

            </div>

          </div>

        )}

      </div>


      {/* INPUT */}

      <div className="ai-input-area">

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask EngiVerse AI anything..."
          rows="2"
        />

        <button
          className="send-btn"
          onClick={askAI}
          disabled={loading || !message.trim()}
        >
          {loading ? "⏳" : "➤"}
        </button>

      </div>


      {/* BACK HOME */}

      <button
        className="back-home-btn"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        ← Back to Home
      </button>

    </div>
  );
}

export default AIAssistant;
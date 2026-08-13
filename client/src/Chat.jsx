import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);

  const receiverId = params.get("userId");
  const receiverName = params.get("name") || "Student";

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const currentUserId = user._id || user.id;

  // ==========================================
  // LOAD OLD MESSAGES
  // ==========================================

  useEffect(() => {
    const loadMessages = async () => {
      if (!receiverId || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/messages/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Load messages error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [receiverId, token]);

  // ==========================================
  // SOCKET.IO
  // ==========================================

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("join", currentUserId);

    const receiveMessage = (newMessage) => {
      const senderId =
        newMessage.sender?._id || newMessage.sender;

      const receiver =
        newMessage.receiver?._id || newMessage.receiver;

      if (
        (senderId === currentUserId && receiver === receiverId) ||
        (senderId === receiverId && receiver === currentUserId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receiveMessage", receiveMessage);

    return () => {
      socket.off("receiveMessage", receiveMessage);
    };
  }, [currentUserId, receiverId]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    if (!receiverId) {
      alert("Receiver not found.");
      return;
    }

    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver: receiverId,
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send message");
        return;
      }

      const sentMessage = data.data;

      setMessages((prev) => [...prev, sentMessage]);

      // Send through Socket.io
      socket.emit("sendMessage", sentMessage);

      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);
      alert("Cannot connect to server.");
    }
  };

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!token) {
    return (
      <div className="chat-page">
        <div className="chat-message">
          <h2>🔐 Login Required</h2>

          <p>Please login to use chat.</p>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RECEIVER CHECK
  // ==========================================

  if (!receiverId) {
    return (
      <div className="chat-page">
        <div className="chat-message">
          <h2>💬 Chat</h2>

          <p>No student selected.</p>

          <button
            onClick={() => {
              window.location.href = "/team-finder";
            }}
          >
            ← Back to Team Finder
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // CHAT UI
  // ==========================================

  return (
    <div className="chat-page">

      {/* HEADER */}

      <div className="chat-header">

        <button
          className="chat-back"
          onClick={() => {
            window.location.href = "/team-finder";
          }}
        >
          ←
        </button>

        <div>
          <h2>💬 {receiverName}</h2>

          <p>EngiVerse Chat</p>
        </div>

      </div>

      {/* MESSAGES */}

      <div className="chat-messages">

        {loading ? (
          <div className="chat-empty">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">

            <div>💬</div>

            <h3>No messages yet</h3>

            <p>
              Start a conversation with {receiverName}.
            </p>

          </div>
        ) : (
          messages.map((msg, index) => {

            const senderId =
              msg.sender?._id || msg.sender;

            const isMine =
              senderId === currentUserId;

            return (
              <div
                key={msg._id || index}
                className={
                  isMine
                    ? "chat-bubble mine"
                    : "chat-bubble theirs"
                }
              >
                <p>{msg.message}</p>

                <small>
                  {msg.createdAt
                    ? new Date(
                        msg.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </small>
              </div>
            );
          })
        )}

      </div>

      {/* INPUT */}

      <form
        className="chat-input-area"
        onSubmit={sendMessage}
      >

        <input
          type="text"
          placeholder={`Message ${receiverName}...`}
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button type="submit">
          ➤
        </button>

      </form>

    </div>
  );
}

export default Chat;
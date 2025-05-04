import React, { useState } from "react";

export const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = async () => {
    if (currentMessage.trim() === "") return;

    // Add user message to chat
    const userMessage = { role: "user", content: currentMessage };
    setMessages([...messages, userMessage]);

    try {
      // Call the API
      const response = await fetch("http://localhost:5000/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      console.log(response)

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const botMessage = { role: "assistant", content: data.content };

        // Add bot response to chat
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.error("Error with API call:", response.statusText);
        const errorMessage = { role: "assistant", content: "Sorry, something went wrong." };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { role: "assistant", content: "Sorry, something went wrong." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setCurrentMessage("");
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto bg-white rounded shadow p-4 mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet...</p>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  message.role === "user" ? "right-0 bg-green-100 self-start" : "bg-blue-100 self-end"
                }`}
              >
              {message.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

import React, { useState } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const LuxeRideChat = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome to LuxeRide! How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: newMessages,
          max_tokens: 256,
          temperature: 0.5,
        }),
      });
      const data = await res.json();
      const aiContent = data?.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
      setMessages([...newMessages, { role: "assistant", content: aiContent }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, there was an error connecting to LuxeRide AI." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded px-3 py-2 max-w-[80%] break-words ${msg.role === "user" ? "bg-luxe-gold-accent text-black self-end" : "bg-zinc-800 text-white self-start"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-zinc-400">LuxeRide AI is typing...</div>}
      </div>
      <form className="flex p-2 border-t border-zinc-700" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
        <input
          className="flex-1 rounded bg-zinc-900 text-white p-2 mr-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask LuxeRide anything..."
          disabled={loading}
        />
        <button className="bg-luxe-gold-accent text-black font-bold px-4 py-2 rounded" type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default LuxeRideChat; 
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaUserCircle, FaPaperPlane } from "react-icons/fa";

const BOT_AVATAR = <FaRobot size={28} color="#FFD700" style={{ background: "#222", borderRadius: "50%", padding: 2 }} />;
const USER_AVATAR = <FaUserCircle size={28} color="#FFD700" style={{ background: "#333", borderRadius: "50%", padding: 2 }} />;

const QUICK_REPLIES = [
  { label: "Book Executive Car", value: "I want to book an executive car" },
  { label: "Book Helicopter", value: "I want to book a helicopter charter" },
  { label: "Book Speedboat", value: "I want to book a speedboat transfer" },
  { label: "Membership Packages", value: "Tell me about membership packages" },
  { label: "General Inquiry", value: "I have a general question" },
];

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const initialMessages = [
  {
    role: "assistant",
    content: "Welcome to LuxeRide! How can I assist you today? You can book a ride, ask about our services, or get help with anything LuxeRide.",
  },
];

export default function LuxeRideChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setShowQuickReplies(false);
    setLoading(true);
    
    // Check if API key is configured
    console.log("GROQ_API_KEY:", GROQ_API_KEY ? "Present" : "Missing");
    if (!GROQ_API_KEY) {
      console.log("Using fallback response - API key not configured");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Welcome to LuxeRide! I'm here to help with your luxury transportation needs. Our services include executive cars, helicopter charters, and speedboat transfers. We offer three membership packages: Gold, Platinum, and Diamond. How can I assist you today?" },
      ]);
      setShowQuickReplies(true);
      setLoading(false);
      return;
    }
    
    try {
      const newMessages = [...messages, { role: "user", content: msg }];
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { 
              role: "system", 
              content: `You are LuxeRide Assistant. You must follow these exact formatting rules:

1. NEVER use asterisks (*) or double asterisks (**) 
2. NEVER use markdown formatting
3. ALWAYS use numbered lists (1., 2., 3.) for main items
4. ALWAYS use bullet points (-) for sub-items
5. ALWAYS use proper line breaks between sections
6. Use plain text only

You are a helpful AI for LuxeRide - Kenya's premier luxury transportation service.

COMPANY OVERVIEW:
LuxeRide is Kenya's leading luxury mobility platform offering premium transportation services including executive cars, helicopter charters, and speedboat transfers.

SERVICES:
1. EXECUTIVE CARS:
   - Luxury vehicles: Mercedes S-Class, BMW 7 Series, and other premium vehicles
   - Professional chauffeurs: Experienced, licensed, and background-checked drivers
   - Features: Premium amenities, safety, comfort

2. HELICOPTER CHARTERS:
   - Modern fleet with state-of-the-art helicopters and panoramic views
   - Certified pilots: Highly trained and experienced aviation professionals
   - On-demand service with quick response times
   - Scenic routes with breathtaking aerial views of Kenya's landscapes

3. SPEEDBOAT TRANSFERS:
   - Premium vessels: High-performance speedboats with luxury amenities
   - Licensed captains: Experienced marine professionals with safety certifications
   - Fast transfers: Quick and efficient water transportation
   - Coastal adventures: Explore Kenya's beautiful coastline and waterways

4. MEMBERSHIP PACKAGES:
   - Gold Package: KSH 150,000/month
     * 20 rides included per month
     * Priority booking
     * Basic concierge support
     * Access to luxury fleet
     * Standard response time
     * No family members included
   
   - Platinum Package: KSH 300,000/month
     * 40 rides included per month
     * Priority booking
     * 24/7 dedicated concierge
     * Premium fleet access
     * Fast response time
     * Up to 3 family members
     * Optional security detail
   
   - Diamond Package: KSH 500,000/month
     * 60 rides included per month
     * Guaranteed availability
     * Personal account manager
     * Exclusive vehicle access
     * Instant response time
     * Unlimited family members
     * Security detail included
     * Custom route planning

PARTNERSHIP OPPORTUNITIES:
- Car Owner Partnership: Transform luxury vehicles into income sources
- Chauffeur Application: Join our professional driver network
- Security Application: Provide security services for Diamond package members
- Corporate Accounts: Business transportation solutions

CRITICAL FORMATTING RULES:
- NEVER use asterisks (*) or double asterisks (**) for bold text
- NEVER use markdown formatting of any kind
- ALWAYS use numbered lists (1., 2., 3.) for main items
- ALWAYS use bullet points (-) for sub-items
- ALWAYS structure responses with clear headings
- ALWAYS use proper line breaks and spacing
- ALWAYS present information in organized, easy-to-read format
- Use plain text only - no special formatting characters whatsoever` 
            },
            ...newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : m.role, content: m.content }))
          ],
          max_tokens: 400,
          temperature: 0.3,
        }),
      });
      
      if (!res.ok) {
        const errorDetails = await res.json().catch(() => ({}));
        console.error('Groq API Error Details:', errorDetails);
        throw new Error(`API request failed: ${res.status} ${res.statusText} - ${JSON.stringify(errorDetails)}`);
      }
      
      const data = await res.json();
      console.log('Groq API Response:', data);
      const aiResponse = data?.choices?.[0]?.message?.content;
      
      if (!aiResponse || aiResponse.trim() === "") {
        throw new Error("Empty response from AI");
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
      setShowQuickReplies(true);
    } catch (e) {
      console.error("Chatbot error:", e);
      console.error("Error details:", e.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I encountered an error: ${e.message}. Welcome to LuxeRide! I'm here to help with your luxury transportation needs. Our services include executive cars, helicopter charters, and speedboat transfers. We offer three membership packages: Gold, Platinum, and Diamond. How can I assist you today?` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage(input);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#18181b",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Title Bar */}
      <div style={{
        background: "#222",
        color: "#FFD700",
        fontWeight: 700,
        fontSize: 18,
        padding: "0.75rem 1.25rem",
        borderBottom: "1px solid #333",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <FaRobot style={{ marginRight: 8 }} /> LuxeRide Assistant
      </div>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", background: "#18181b" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end",
              marginBottom: 12,
            }}
          >
            <div style={{ margin: msg.role === "user" ? "0 0 0 10px" : "0 10px 0 0" }}>
              {msg.role === "user" ? USER_AVATAR : BOT_AVATAR}
            </div>
            <div
              style={{
                background: msg.role === "user" ? "#23232b" : "#222",
                color: "#fff",
                borderRadius: 16,
                borderTopRightRadius: msg.role === "user" ? 4 : 16,
                borderTopLeftRadius: msg.role === "user" ? 16 : 4,
                padding: "0.75rem 1rem",
                maxWidth: 240,
                fontSize: 15,
                boxShadow: msg.role === "user" ? "0 2px 8px rgba(255,215,0,0.08)" : "0 2px 8px rgba(0,0,0,0.08)",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {BOT_AVATAR}
            <div style={{ background: "#222", color: "#FFD700", borderRadius: 16, padding: "0.75rem 1rem", fontSize: 15, minWidth: 60 }}>
              <span style={{ display: "inline-block", width: 24 }}>
                <span className="dot-flashing" style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: "#FFD700", marginRight: 2, animation: "dotFlashing 1s infinite linear alternate" }}></span>
                <span className="dot-flashing" style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: "#FFD700", marginRight: 2, animation: "dotFlashing 1s 0.2s infinite linear alternate" }}></span>
                <span className="dot-flashing" style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: "#FFD700", animation: "dotFlashing 1s 0.4s infinite linear alternate" }}></span>
              </span>
              <style>{`
                @keyframes dotFlashing {
                  0% { opacity: 0.2; }
                  50% { opacity: 1; }
                  100% { opacity: 0.2; }
                }
              `}</style>
              <span style={{ marginLeft: 8 }}>Bot is typing…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Quick Replies */}
      {showQuickReplies && !loading && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 1rem 0.5rem 1rem" }}>
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr.value}
              style={{
                background: "linear-gradient(90deg, #FFD700 60%, #333 100%)",
                color: "#222",
                borderRadius: 16,
                fontWeight: 600,
                fontSize: 13,
                boxShadow: "0 2px 8px rgba(255,215,0,0.08)",
                padding: "0.4rem 1rem",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => sendMessage(qr.value)}
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}
      {/* Input Area */}
      <div style={{ display: "flex", alignItems: "center", padding: "0.75rem 1rem", background: "#23232b", borderTop: "1px solid #333" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type a message..."
          disabled={loading}
          style={{
            flex: 1,
            background: "#18181b",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 16,
            padding: "0.6rem 1rem",
            fontSize: 15,
            outline: "none",
            marginRight: 8,
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.08)",
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          aria-label="Send message"
          style={{
            background: loading || !input.trim() ? "#444" : "#FFD700",
            color: loading || !input.trim() ? "#aaa" : "#222",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s, color 0.2s",
            boxShadow: "0 2px 8px rgba(255,215,0,0.08)",
          }}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
} 
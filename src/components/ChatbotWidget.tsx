import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/luxe-button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/functions/v1/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, user_id: "demo-user" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chatbot error");
      setMessages((msgs) => [...msgs, { sender: "ai", text: data.response }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setInput("");
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button variant="premium" size="icon" onClick={() => setOpen(true)}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>Ask LuxeRide AI</DialogHeader>
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto bg-luxe-dark-primary p-2 rounded mb-2">
              {messages.length === 0 && <div className="text-luxe-gray-secondary text-center mt-8">How can I help you today?</div>}
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-luxe-gold-accent text-luxe-dark-primary" : "bg-luxe-dark-outline text-luxe-white-primary"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-luxe-gray-secondary text-center">LuxeRide AI is typing...</div>}
              {error && <div className="text-red-500 text-center">{error}</div>}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" variant="premium" disabled={loading || !input.trim()}>Send</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotWidget; 
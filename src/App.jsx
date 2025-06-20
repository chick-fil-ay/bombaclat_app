import { useState } from "react";

export default function BombaclatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", text: input },
      {
        role: "assistant",
        text: "BOMBACLATTT",
        audio: "/bomboclat.mp3",
      },
    ];
    setMessages(newMessages);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-100">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={\`max-w-md p-3 rounded-2xl shadow \${msg.role === "user"
              ? "bg-white self-end ml-auto"
              : "bg-green-100 self-start"}\`}
          >
            <p className="text-sm mb-1">{msg.text}</p>
            {msg.audio && (
              <audio controls src={msg.audio} className="mt-2 w-full" />
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-xl mr-2"
          placeholder="Type something..."
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";

const audioMap = {
  "bomboclaat_1.mp3": "BOMBAACLATT!",
  "bomboclaat_2.mp3": "BOOMBAACLATT!",
  "p-ssyclat.mp3": "P$SSYYCLATT!",
  "raasclaat.mp3": "RAASCLAAT!",
  "rich millionaire ey rich ey BOMBAACLAAT rich millionaire ehe millionaire ehe.mp3":
    "RICH ----- MILLIONAIRE ----- EY ----- RICH ----- EY -------------- BOMMMMBAAACLAAATT ---— RICH ---— MILLIONAIRE -— EHE -— MILLIONAIRE — EHE"
};

export default function BombaclatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const thinkingPhrases = [
    "...",
    "Hmm...",
    "Thinking...",
    "Wait a sec...",
    "🤔"
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
  
    // Simulate assistant "thinking..."
    const randomThinking = thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)];
  
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: randomThinking }]);
  
      const clipKeys = Object.keys(audioMap);
      const randomClip = clipKeys[Math.floor(Math.random() * clipKeys.length)];
      const displayText = audioMap[randomClip];
      let currentText = "";
      const chars = displayText.split("");
      let i = 0;
  
      // Immediately replace thinking with audio + empty text
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", text: "", audio: `/${randomClip}` }
        ]);
  
        // Then type out the response letter by letter
        const type = () => {
          if (i < chars.length) {
            currentText += chars[i++];
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", text: currentText, audio: `/${randomClip}` }
            ]);
            setTimeout(type, 40);
          }
        };
  
        setTimeout(type, 200);
      }, 400);
    }, 400);
  };
  return (
    <div className="flex flex-col min-h-[100dvh] bg-neutral-100">
      <header className="p-4 border-b bg-white shadow flex items-center space-x-3">
        <img src="/pago.png" alt="pagoGPT logo" className="h-8 w-8 rounded" />
        <h1 className="text-lg font-semibold">pagoGPT</h1>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-md p-3 rounded-2xl shadow whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-white self-end ml-auto"
                : "bg-green-100 self-start"
            }`}
          >
            <p className="text-sm mb-1">{msg.text}</p>
            {msg.audio && (
              <audio autoPlay src={msg.audio} className="hidden" />
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
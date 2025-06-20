import { useState, useEffect, useRef } from "react";

const audioClips = [
  { file: "bomboclat_1.mp3", text: "BOMBAACLATT!" },
  { file: "bomboclaat_2.mp3", text: "BOOMBAACLATT!" },
  { file: "p-ssyclat.mp3", text: "P$$$YYCLATT!" },
  { file: "raasclaat.mp3", text: "RAASCLAAT!" },
  {
    file: "rich millionaire ey rich ey BOMBAACLAAT rich millionaire ehe millionaire ehe.mp3",
    text: "RICH -- MILLIONAIRE -- EY -- RICH-- EY -- BOMMMMBAAACLAAATT - RICH -- MILLIONAIRE  - EHE - MILLIONAIRE - ehe"
  }
];

export default function BombaclatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsThinking(true);
    const thinkingChance = Math.random() < 0.7;
    if (thinkingChance) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Thinking..." }]);
      await new Promise((res) => setTimeout(res, 800 + Math.random() * 1000));
      setMessages((prev) => prev.slice(0, -1));
    }

    const numResponses = Math.ceil(Math.random() * 3);
    const clips = Array.from({ length: numResponses }, () =>
      audioClips[Math.floor(Math.random() * audioClips.length)]
    );

    for (let clip of clips) {
      await new Promise((res) => {
        // Add placeholder to trigger audio
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "", audio: `/${clip.file}` }
        ]);

        // Play audio
        const audio = new Audio(`/${clip.file}`);
        audioRef.current = audio;
        audio.play();

        audio.onended = () => res();
      });

      await new Promise((res) => {
        let i = 0;
        let currentText = "";
        const chars = clip.text.split("");

        const type = () => {
          if (i < chars.length) {
            currentText += chars[i++];
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", text: currentText, audio: `/${clip.file}` }
            ]);
            setTimeout(type, 40);
          } else {
            res();
          }
        };

        setTimeout(type, 100);
      });
    }

    setIsThinking(false);
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
            className={`max-w-md p-3 rounded-2xl shadow whitespace-pre-wrap ${msg.role === "user"
              ? "bg-white self-end ml-auto"
              : "bg-green-100 self-start"}`}
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
          className={`px-4 py-2 rounded-xl text-white ${
            isThinking
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={isThinking}
        >
          {isThinking ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

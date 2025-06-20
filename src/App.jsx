import { useState, useEffect, useRef } from "react";

const clips = [
  {
    file: "bomboclat_1.mp3",
    text: "BOMBAACLATT!",
  },
  {
    file: "bomboclat_2.mp3",
    text: "BOOMBAACLATT!",
  },
  {
    file: "p-ssyclat.mp3",
    text: "P$$SYYCLATT!",
  },
  {
    file: "raasclaat.mp3",
    text: "RAASCLAAT!",
  },
  {
    file: "rich millionaire ey rich ey BOMBAACLAAT rich millionaire ehe millionaire ehe.mp3",
    text: "RICH -- MILLIONAIRE -- EY -- RICH-- EY -- BOMMMMBAAACLAAATT - RICH -- MILLIONAIRE  - EHE - MILLIONAIRE - ehe",
  },
];

export default function BombaclatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsThinking(true);

    const showThinking = Math.random() < 0.6;
    if (showThinking) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Thinking..." }]);
      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));
      setMessages((prev) => prev.slice(0, -1));
    }

    const howMany = Math.floor(Math.random() * 3) + 1;
    const selected = Array.from({ length: howMany }, () =>
      clips[Math.floor(Math.random() * clips.length)]
    );

    for (let i = 0; i < selected.length; i++) {
      const { file, text } = selected[i];

      setMessages((prev) => [...prev, { role: "assistant", text: "", audio: `/${file}` }]);

      // Simultaneous audio + text typing
      const chars = text.split("");
      let currentText = "";
      let j = 0;

      const audio = new Audio(`/${file}`);
      audioRef.current = audio;
      audio.play();

      const type = () => {
        if (j < chars.length) {
          currentText += chars[j++];
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: currentText,
            };
            return updated;
          });
          setTimeout(type, 40);
        }
      };

      type();

      // Wait for audio to finish before next
      await new Promise((res) => {
        audio.onended = res;
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
          className={`px-4 py-2 rounded-xl text-white ${
            isThinking ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={isThinking}
        >
          {isThinking ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

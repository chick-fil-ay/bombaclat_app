import { useState } from "react";

const audioMap = {
  "bomboclaat_1.mp3": "BOMBAACLATT!",
  "bomboclaat_2.mp3": "BOOMBAACLATT!",
  "p-ssyclat.mp3": "P$SSYYCLATT!",
  "raasclaat.mp3": "RAASCLAAT!",
  "rich millionaire ey rich ey BOMBAACLAAT rich millionaire ehe millionaire ehe.mp3":
    "RICH -- MILLIONAIRE -- EY -- RICH -- EY -- BOMMMMBAAACLAAATT — RICH — MILLIONAIRE — EHE — MILLIONAIRE — ehe"
};

const thinkingPhrases = ["...", "Hmm...", "Thinking...", "Wait a sec...", "🤔"];

export default function PagoGPTApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isResponding) return;

    setIsResponding(true);
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const thinking = thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)];
    setMessages((prev) => [...prev, { role: "assistant", text: thinking }]);

    setTimeout(() => {
      const clipKeys = Object.keys(audioMap);
      const count = Math.floor(Math.random() * 3) + 1;
      const selected = Array.from({ length: count }, () =>
        clipKeys[Math.floor(Math.random() * clipKeys.length)]
      );

      const responses = [...selected];
      let i = 0;

      const next = () => {
        if (i >= responses.length) {
          setIsResponding(false);
          return;
        }

        const clip = responses[i];
        const displayText = audioMap[clip];

        const audio = new Audio(`/${clip}`);
        audio.play();

        let j = 0;
        let currText = "";

        const type = () => {
          if (j < displayText.length) {
            currText += displayText[j++];
            if (i === 0) {
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "assistant", text: currText, audio: `/${clip}` }
              ]);
            } else {
              setMessages((prev) => [
                ...prev,
                { role: "assistant", text: currText, audio: `/${clip}` }
              ]);
            }
            setTimeout(type, 40);
          } else {
            i++;
            setTimeout(next, 400);
          }
        };

        if (i === 0) {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", text: "", audio: `/${clip}` }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: "", audio: `/${clip}` }
          ]);
        }

        setTimeout(type, 300);
      };

      next();
    }, 700);
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
            className={`max-w-md p-3 rounded-2xl shadow ${
              msg.role === "user" ? "bg-white self-end ml-auto" : "bg-green-100 self-start"
            }`}
          >
            <p className="text-sm mb-1 whitespace-pre-wrap">{msg.text}</p>
            {msg.audio && <audio autoPlay src={msg.audio} className="hidden" />}
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
          disabled={isResponding}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          disabled={isResponding}
        >
          Send
        </button>
      </form>
    </div>
  );
}

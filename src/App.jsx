import { useState, useRef } from "react";

const audioMap = {
  "bomboclaat_1.m4a": "BBBBBOOOOOMMMMMBBBBBOOOOOCCCCCLLLLAAAAATTTTT!",
  "bomboclaat_2.m4a": "BOOMBOOCLATT!",
  "p-ssyclat.mp3": "P$SSYYCLATT!",
  "raasclaat.mp3": "RAASCLAAT!",
  "millionaire_ehe.m4a": "MILLIONAIRE!",
  "RICH.m4a": "RIICH!",
  "bombaclack.m4a": "Bombaclack, --- Bombaclack, --- Bombaclack"
};

export default function BombaclatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  const thinkingPhrases = ["...", "Hmm...", "Thinking...", "Wait a sec...", "🤔"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isPlaying) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsPlaying(true);

    const randomThinking = thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)];
    const thinkingDelay = 600 + Math.random() * 400;

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: randomThinking }]);

      const clipKeys = Object.keys(audioMap);
      const randomClip = clipKeys[Math.floor(Math.random() * clipKeys.length)];
      const displayText = audioMap[randomClip];
      const chars = displayText.split("");
      let currentText = "";
      let i = 0;

      setTimeout(() => {
        // Set current audio so <audio> element plays it
        setCurrentAudio(`/${randomClip}`);

        // Replace "thinking" with blank assistant bubble and audio
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", text: "", audio: `/${randomClip}` }
        ]);

        // Start typing shortly after triggering audio
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

        setTimeout(type, 100);
      }, thinkingDelay);
    }, 100);
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
            {/* Audio only rendered on last message to control exact start */}
            {idx === messages.length - 1 && msg.audio && (
              <audio
                ref={audioRef}
                src={currentAudio}
                autoPlay
                className="hidden"
                onEnded={() => setIsPlaying(false)}
              />
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
            isPlaying ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
          }`}
          disabled={isPlaying}
        >
          {isPlaying ? "Wait..." : "Send"}
        </button>
      </form>
    </div>
  );
}

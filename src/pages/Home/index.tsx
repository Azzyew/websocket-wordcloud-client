import { useEffect, useState } from "react";
import { socket } from "../../services/socket";

export const Home = () => {
  const [text, setText] = useState("");
  const [words, setWords] = useState<string[]>([]);

  const isValidText = text.length > 0 && text.length < 30;

  useEffect(() => {
    const receivedMessage = (message: string) => {
      const newWord = message;

      setWords([...words, newWord]);
    };

    socket.on("message", (message) => {
      receivedMessage(message);
    });
  }, [words, text]);

  const sendMessage = () => {
    if (isValidText) {
      socket.emit("message", text);
      setText("");
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
        />
        <button type="button" onClick={() => sendMessage()}>
          Send
        </button>
        {words.map((w) => (
          <p>{w}</p>
        ))}
      </div>
    </>
  );
};

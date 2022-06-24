import { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import { socket } from "../../services/socket";

export const Home = () => {
  const [text, setText] = useState("");
  const [words, setWords] = useState<any[]>([]);

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
        <div style={{ height: 400, width: 600 }}>
          <ReactWordcloud
            words={words}
            options={{
              rotations: 0,
              fontSizes: [15, 50],
              fontWeight: "bold",
              fontFamily: "Nunito",
              deterministic: true,
              randomSeed: "websocket",
              scale: "linear",
              enableTooltip: false,
            }}
            maxWords={100}
          />
        </div>
      </div>
    </>
  );
};

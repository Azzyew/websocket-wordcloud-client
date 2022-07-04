import { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";

import { Input, Button, Box, Center, Heading } from "@chakra-ui/react";

import { socket } from "../../services/socket";

interface Words {
  text: string;
  value: number;
}

export const Home = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [words, setWords] = useState<Words[]>([]);

  const isValidText = text.length > 0 && text.length < 30;

  useEffect(() => {
    const receivedMessage = (message: Words) => {
      const newWord = message.text;

      setMessages([...messages, newWord]);

      const totalOccurrencies = [...messages, newWord].reduce((prev, curr) => {
        if (prev[curr]) {
          prev[curr]++;
        } else {
          prev[curr] = 1;
        }
        return prev;
      }, {} as Record<string, number>);

      const formattedWords = Object.entries<number>(totalOccurrencies).map(
        (item) => {
          return {
            text: item[0],
            value: item[1],
          };
        }
      );

      setWords(formattedWords);
    };

    socket.on("message", (message) => {
      receivedMessage(message);
    });
  }, [messages, words, text]);

  console.log(words);

  const sendMessage = () => {
    if (isValidText) {
      const formattedData = { text: text, value: 1 };
      socket.emit("message", formattedData);
      setText("");
    }
  };

  return (
    <>
      <Box h="100vh" bg="#EDF2F7">
        <Box bg="#0B0B45" h="70px" w="100%">
          <Center>
            <Heading fontSize="30px" mt={3}>
              Websocket Wordcloud
            </Heading>
          </Center>
        </Box>
        <Center mt={10}>
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            _placeholder={{ opacity: 1, color: "#0B0B45" }}
            color="#0B0B45"
            width="50vw"
            borderColor="#0B0B45"
            focusBorderColor="#0B0B45"
          />
          <Button
            type="button"
            bg="#0B0B45"
            ml={1}
            onClick={() => sendMessage()}
          >
            Send
          </Button>
        </Center>
        <Box p={60} mr={100}>
          <Center>
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
          </Center>
        </Box>
      </Box>
    </>
  );
};

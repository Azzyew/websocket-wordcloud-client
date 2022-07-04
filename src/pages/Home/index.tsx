import { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";

import { Input, Button, Box, Center, Heading } from "@chakra-ui/react";

import { socket } from "../../services/socket";

export const Home = () => {
  const [text, setText] = useState("");
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    const receivedMessage = (message: string) => {
      const newWord = message;

      setWords([...words, newWord]);
    };

    socket.on("message", (message) => {
      receivedMessage(message);
    });
  }, [words, text]);

  const valueArr = words.map((w) => {
    return w.text;
  });
  const isDuplicate = valueArr.some((w, idx) => {
    return valueArr.indexOf(w) !== idx;
  });

  const isValidText = text.length > 0 && text.length < 30 && !isDuplicate;

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

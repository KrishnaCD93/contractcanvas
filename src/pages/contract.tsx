import { useState, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Box, Button, Divider, HStack, Spinner, Text, Textarea, VStack } from '@chakra-ui/react';
import React from 'react';

const ChatPage = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ human_message: string | null, ai_message: string | null }[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const ctrl = new AbortController();

  const handleSendClick = async () => {
    setLoading(true);
    setStreaming(true);

    const currentInput = inputText;
    setInputText('');

    setMessages(prev => [...prev, { human_message: currentInput, ai_message: '' }]);

    fetchEventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        Accept: "text/event-stream",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { human_message: currentInput, ai_message: '' }]),
      signal: ctrl.signal,
      onmessage(ev) {
        const rawData = ev.data;
        const data = rawData.replace(/^data: /, '');
        if (!data) return;
        streamResponse(data);
      }
    });
    setStreaming(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendClick();
    }
  };

  const streamResponse = (data: string) => {
    setLoading(false);
    let index = 0;
    const interval = setInterval(() => {
      if (index < data.length) {
        const char = data.charAt(index);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].ai_message += char;
          return newMessages;
        });

        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  useEffect(() => {
    return () => ctrl.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack spacing={4}>
      <Box p={4} h={'calc(100vh - 12rem)'} overflowY="scroll" w='100%'>
        {messages.map((message, index) => (
          <Box key={index}>
            <Text fontWeight='bold'>You <br /></Text>
            <Text bg={'transparent'}>{message.human_message}</Text>
            <Divider orientation='horizontal' />
            <Text fontWeight='bold'>ProjectGPT <br /></Text>
            {loading && <Spinner size='xs' />}
            <Text bg={'transparent'}>{message.ai_message}</Text>
            <Divider orientation='horizontal' />
          </Box>
        ))}
      </Box>
      <HStack
        border={5}
        overflow="hidden"
        w='100%'
        h='5rem'
        position="sticky"
        top="0"
        zIndex="sticky">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message"
          resize="none"
          w='100%'
        />
        <Button onClick={handleSendClick} isDisabled={streaming}>⬆️</Button>
        <Button onClick={() => ctrl.abort()} isDisabled={!streaming}>⛔</Button>
      </HStack>
    </VStack>
  )
};

export default ChatPage;

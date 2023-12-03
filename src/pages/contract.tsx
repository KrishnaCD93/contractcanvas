import { useState, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Box, Button, Divider, HStack, Text, Textarea, VStack } from '@chakra-ui/react';
import React from 'react';

const ChatPage = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState<string>('');
  const [streamIndex, setStreamIndex] = useState(0);
  const [messages, setMessages] = useState<{ human_message: string | null, ai_message: string | null }[]>([]);
  const [streaming, setStreaming] = useState(false);
  const ctrl = new AbortController();

  const handleSendClick = async () => {
    const currentInput = inputText;
    setInputText('');

    setMessages(prev => [...prev, { human_message: currentInput, ai_message: '' }]);
    setStreaming(true);

    fetchEventSource('http://localhost:8000/chat', {
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
        setResponse(prev => prev + data);
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

  useEffect(() => {
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    if (response && streamIndex < response.length) {
      const timer = setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (lastIndex >= 0) {
            newMessages[lastIndex].ai_message += response.charAt(streamIndex);
          }
          return newMessages;
        });
        setStreamIndex(streamIndex + 1);
      }, 50);

      return () => clearTimeout(timer);
    } else if (streamIndex >= response.length) {
      setResponse('');
      setStreamIndex(0);
    }
  }, [response, streamIndex]);

  return (
    <VStack spacing={4}>
      <Box p={4} h={'calc(100vh - 12rem)'} overflowY="scroll" w='100%'>
        {messages.map((message, index) => (
          <Box key={index}>
            <Text fontWeight='bold'>You <br /></Text>
            <Text bg={'transparent'}>{message.human_message}</Text>
            <Divider orientation='horizontal' />
            <Text fontWeight='bold'>ProjectGPT <br /></Text>
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

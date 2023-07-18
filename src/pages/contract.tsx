import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Container,
  Input,
  Button,
} from '@chakra-ui/react';

const ContractPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [messages, setMessages] = useState([{ humanMessage: '', aiMessage: '' }])
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const server = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://127.0.0.1:8000';
    const inputs = JSON.stringify(messages);
    const eventSource = new EventSource(`${server}/predict/${inputs}`);
    eventSource.onmessage = (event) => {
      setOutput(event.data);
      setMessages([...messages, { humanMessage: input, aiMessage: event.data }])
    };
    return () => {
      eventSource.close();
    };
  }, [input, messages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newInputs = [...messages, { humanMessage: input, aiMessage: '' }];
      setMessages(newInputs);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl">
      <Box as="section" pt={20} pb={32} textAlign='center'>
        <Heading as="h1" color="brand.delft-blue" textAlign="center" mb={6}>
          Contract
        </Heading>
        <form onSubmit={handleSubmit}>
          <Input type="text" value={input} onChange={handleChange} />
          <Button isLoading={loading} type="submit">Get Response</Button>
        </form>
        {
          output && (
            <Box>
              <p>{output}</p>
            </Box>
          )
        }
      </Box>
    </Container>
  );
};

export default ContractPage;
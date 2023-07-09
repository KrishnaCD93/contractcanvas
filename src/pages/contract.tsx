import React, { useState } from 'react';
import {
  Box,
  Heading,
  Container,
  Input,
  Button,
} from '@chakra-ui/react';

const ContractPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState({
    prediction: {
      content: '',
    },
    error: '',
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const server = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://127.0.0.1:8000';
      await fetch(`${server}/predict/${input}`)
        .then((res) => res.json())
        .then((data) => { console.log('data: ', data); setOutput(data) });
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
          output.prediction && (
            <Box>
              <p>{output.prediction.content}</p>
              <p color='red'>{output.error}</p>
            </Box>
          )
        }
      </Box>
    </Container>
  );
};

export default ContractPage;
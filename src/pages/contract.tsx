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
    prediction: '',
    error: '',
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitting', input);
    setLoading(true);
    try {
      await fetch(`http://127.0.0.1:8000/predict/${input}`)
      .then((res) => res.json())
      .then((data) => { console.log('data: ', data); setOutput(data); });
    console.log('data: ', output);
    setLoading(false);
    } catch (err) {
      console.log(err);
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
              <p>{output.prediction}</p>
              <p color='red'>{output.error}</p>
            </Box>
          )
        }
      </Box>
    </Container>
  );
};

export default ContractPage;
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Container,
  Input,
  Button,
} from '@chakra-ui/react';
import { FiFile } from 'react-icons/fi';

const ContractPage = () => {
  const [input, setInput] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputPdf, setInputPdf] = useState<File | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
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

  const handleFileInputClick = () => {
    hiddenFileInput.current?.click(); 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setInputPdf(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newInputs = [...messages, { humanMessage: input, aiMessage: '' }];
      setMessages(newInputs);
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict/${input}`)
        .then((res) => res.json())
        .then((data) => { console.log('data: ', data); setOutput(data); });
      console.log('data: ', output);
      setLoading(false);
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
          {
            !inputPdf ? (
              <>
                <Input type="text" value={input} onChange={handleChange} />
                <Button isLoading={loading} type="submit">Get Response</Button>
              </>
            ) : null
          }
          <Input type={'file'} style={{ display: 'none' }} accept='application/pdf'
            onChange={handleFileChange}
            ref={hiddenFileInput} />
          <Button onClick={handleFileInputClick}>
            <FiFile />
            Select PDF
          </Button>
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
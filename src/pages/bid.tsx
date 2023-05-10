import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';

const BidPage = () => {
  const [maxBudget, setMaxBudget] = useState('3');
  const [acceptedPrice, setAcceptedPrice] = useState('11');
  const [proof, setProof] = useState('');
  const [signals, setSignals] = useState('');
  const [isValid, setIsValid] = useState(false);

  const toast = useToast();

  const runProofs = async () => {
    if (maxBudget.length === 0 || acceptedPrice.length === 0) return;

    const response = await fetch('/api/bid-validity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxBudget, acceptedPrice }),
    });
    const { proof: _proof, publicSignals: _signals, isValid: _isValid } = await response.json();

    setProof(JSON.stringify(_proof, null, 2));
    setSignals(JSON.stringify(_signals, null, 2));
    setIsValid(_isValid);
  };

  const changeMaxBudget = (e: { target: { value: React.SetStateAction<string> } }) => setMaxBudget(e.target.value);
  const changeAcceptedPrice = (e: { target: { value: React.SetStateAction<string> } }) => setAcceptedPrice(e.target.value);

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Add Your Bid
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Maximum Budget</FormLabel>
          <Input type="number" value={maxBudget} onChange={changeMaxBudget} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Accepted Price</FormLabel>
          <Input type="number" value={acceptedPrice} onChange={changeAcceptedPrice} />
        </FormControl>
        <Button onClick={runProofs} colorScheme="blue">
          Submit Bid
        </Button>
      </VStack>
      {isValid && (
        <Box mt={8}>
          <Heading as="h3" size="md" textAlign="center" mb={4}>
            Proof Details
          </Heading>
          <Text fontSize="sm" mb={2}>
            <strong>Proof:</strong>
          </Text>
          <Textarea value={proof} readOnly />
          <Text fontSize="sm" mb={2} mt={4}>
            <strong>Public Signals:</strong>
          </Text>
          <Textarea value={signals} readOnly />
        </Box>
      )}
    </Box>
  );
};

export default BidPage;

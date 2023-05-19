// /pages/[projectId]/bid.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import DeveloperRegistrationForm, { DeveloperInfoData, DeveloperZKP } from '../../components/Registration/BidRegistration';
import DevData from '@/components/ViewZKP';
import { useRouter } from 'next/router';

const BidPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [maxBudget, setMaxBudget] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [proof, setProof] = useState('');
  const [signals, setSignals] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>({});
  const [devInfo, setDevInfo] = useState<DeveloperInfoData>({
    rate: '',
    availability: '',
    skills: [],
    resumeFileName: '',
    exclusions: [],
  });
  const [devZKP, setDevZKP] = useState<DeveloperZKP>({
    proof: '',
    signals: [],
    isValid: false,
  });

  const toast = useToast();
  const devRef = useRef<HTMLDivElement>(null);

  const budget = useCallback(() => {
    fetch(`/api/supabase-fetch-id?database=projects&id=${projectId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setMaxBudget(data.result[0].budget);
        setProject(data.result[0]);
      }
    );
  }, [projectId]);

  useEffect(() => {
    budget();
  }, [budget]);

  const runProofs = async () => {
    if (maxBudget.length === 0 || bidAmount.length === 0) return;

    setLoading(true);

    const response = await fetch('/api/bid-validity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxBudget, acceptedPrice: bidAmount }),
    });
    const { proof: _proof, publicSignals: _signals, isValid: _isValid } = await response.json();

    setProof(_proof);
    setSignals(_signals);
    setIsValid(_isValid);
    console.log('proof', proof);
    console.log('signals', signals);
    console.log('isValid', isValid);
    setLoading(false);
  };

  useEffect(() => {
    if (signals[0] === '1') {
      devRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [signals]);

  const submitBid = async () => {
    if (!devZKP.isValid) {
      toast({
        title: 'Invalid ZKP',
        description: 'Please make sure your ZKP is valid before submitting your bid.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const response = await fetch('/api/redis-storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proof, signals }),
    })
    const { error } = await response.json();

    if (error) {
      toast({
        title: 'Error',
        description: 'There was an error submitting your bid. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Your bid has been submitted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const changeMaxBudget = (e: { target: { value: React.SetStateAction<string> } }) => setMaxBudget(e.target.value);
  const changeAcceptedPrice = (e: { target: { value: React.SetStateAction<string> } }) => setBidAmount(e.target.value);

  return (
    <Box p={4}>
      {maxBudget && (<><Heading as="h2" size="lg" textAlign="center" mb={6}>
        Add Your Bid
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Maximum Budget</FormLabel>
          <Input isDisabled value={'******'} onChange={changeMaxBudget} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Bid Amount</FormLabel>
          <Input type="number" value={bidAmount} onChange={changeAcceptedPrice} />
        </FormControl>
        {!isValid && <Button isLoading={loading} onClick={runProofs} colorScheme="blue">
          Submit Bid
        </Button>}
      </VStack></>)}
      {isValid && (
        <Box mt={8}>
          <Heading as="h3" size="md" textAlign="center" mb={4}>
            Proof Details
          </Heading>
          {signals[0] === '1' && 
            <DeveloperRegistrationForm
              forwardRef={devRef}
              setDevInfo={setDevInfo}
              setDevZKP={setDevZKP}
              rate={bidAmount}
              proof={''} signals={[]} isValid={false} 
            />
            }
            {devZKP && <DevData devZKP={devZKP} title="Developer ZKP" />}
        </Box>
      )}
    </Box>
  );
};

export default BidPage;

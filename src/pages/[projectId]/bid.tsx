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
import { ProjectItems } from '@/components/ProjectCard';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Logo from '@/components/Logo';

const BidPage = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const { projectId } = router.query;
  const [maxBudget, setMaxBudget] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [proof, setProof] = useState('');
  const [showProof, setShowProof] = useState(false);
  const [signals, setSignals] = useState(['']);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectItems>();
  const [devInfo, setDevInfo] = useState<DeveloperInfoData>({
    rate: '',
    availability: '',
    skills: [],
    resumeFileName: '',
    exclusions: [],
  });
  const [devZKP, setDevZKP] = useState<DeveloperZKP>();
  const [devEmbeddings, setDevEmbeddings] = useState<number[]>()

  const toast = useToast();
  const devRef = useRef<HTMLDivElement>(null);

  const getProject = useCallback(async () => {
    await fetch(`/api/supabase-fetch-id?database=projects&id=${projectId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setMaxBudget(data.result[0]?.budget);
        setProject(data.result[0]);
      }
    );
  }, [projectId]);

  useEffect(() => {
    getProject();
  }, [getProject]);

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
    setLoading(false);
  };

  useEffect(() => {
    if (signals[0] === '1') {
      devRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (signals[0] === '0') {
      toast({
        title: 'Invalid Bid',
        description: 'Your bid is too high. Please try again with a lower bid.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [signals, toast]);

  const submitBid = async () => {
    const userId = user?.id;

    const response = await fetch('/api/redis-storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, devZKP }),
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

  useEffect(() => {
    if (devZKP?.isValid === true) {
      submitBid();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devZKP]);

  const changeMaxBudget = (e: { target: { value: React.SetStateAction<string> } }) => setMaxBudget(e.target.value);
  const changeAcceptedPrice = (e: { target: { value: React.SetStateAction<string> } }) => setBidAmount(e.target.value);

  return (
    <Box p={4}>
      <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={6} 
      boxShadow="lg" 
      bg="brand.white"
      color="brand.space-cadet"
      >
        <VStack align="stretch" spacing={4}>
          <Logo h={200} w={200} />
          <Text fontWeight={'bold'}>{project?.name}</Text>
          <Text>{project?.description}</Text>
          <Text><b>Scope:</b> {project?.scope}</Text>
          <Text>
            <b>Milestones:</b> <br />
            {project?.milestones.map((milestone, index) => 
              <React.Fragment key={index}>
                <i>{milestone.milestone}</i>
                {`: ${new Date(milestone.targetDate).toLocaleDateString()}`}
                {index !== project.milestones.length - 1 && <br/>}
              </React.Fragment>
            )}
          </Text>
          {project?.protected_ip || signals[0] === '1' ? <Text color="brand.cool-gray">Protected Information. Submit a bid to view.</Text> :
          (<>
          <Text><b>Budget Range:</b> ${project?.budget}</Text>
          <Text><b>Terms and Conditions:</b> {project?.terms_and_conditions ? project?.terms_and_conditions : `N/A`}</Text>
          <Text><b>Specific Requests:</b> {project?.specific_requests ? project?.specific_requests : `N/A`}</Text></>)}
          <Text><b>Project Owner:</b> {project && project.username ? project.username : project?.user_id}</Text>
        </VStack>
      </Box>
      {maxBudget && (<><Heading as="h2" size="lg" textAlign="center" m={6}>
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
        {!(signals[0] === '1') && <Button isLoading={loading} onClick={runProofs} bg="brand.mint-green" color="brand.space-cadet">
          Submit Bid
        </Button>}
      </VStack></>)}
      {isValid && (
        <Box mt={8}>
          <Heading as="h3" size="md" textAlign="center" mb={4}>
            Proof Details <Button bg="brand.light-cyan-2" onClick={() => setShowProof(!showProof)}>{showProof ? 'Hide' : 'Show'}</Button>
          </Heading>
          {showProof && <Text mb={4}>
            Proof: <Textarea>{JSON.stringify(proof)}</Textarea>
          </Text>}
          {signals[0] === '1' && 
            <DeveloperRegistrationForm
              forwardRef={devRef}
              setDevInfo={setDevInfo}
              setDevZKP={setDevZKP}
              rate={bidAmount}
            />
            }
            {devZKP && <DevData devZKP={devZKP} title="Developer ZKP" />}
        </Box>
      )}
    </Box>
  );
};

export default BidPage;

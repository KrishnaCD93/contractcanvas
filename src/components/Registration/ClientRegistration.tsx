// /components/Registration/ClientRegistration.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  CheckboxGroup,
  Checkbox,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface ClientRegistrationProps {
  formData: any;
  setFormData: any;
  forwardRef: React.RefObject<HTMLDivElement>;
}

const ClientRegistrationForm: React.FC<ClientRegistrationProps> = ({ formData, setFormData, forwardRef }) => {
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const uploadClient = async (database: string, values: any[]) => {
    const response = await fetch('/api/supabase-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ database, values }),
    });
  
    const { result } = await response.json();
    console.log('Uploaded portfolio items:', result);
    return result;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const clientData = {
      scope: formData.scope,
      milestones: formData.milestones,
      milestoneDates: formData.milestoneDates,
      cost: formData.cost,
      termsAndConditions: formData.termsAndConditions,
      specificRequests: formData.specificRequests,
      projectIP: formData.projectIP,
    };

    const client = await uploadClient('client_projects', [clientData]);
  
    if (!client) {
      toast({
        title: 'Client registration failed.',
        description: 'There was an error submitting your registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: 'Client registration complete.',
      description: 'Your registration has been submitted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    router.push('/dashboard');
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <FormControl isRequired>
            <FormLabel>Scope</FormLabel>
            <Textarea
              name="scope"
              value={formData.scope}
              onChange={handleFormChange}
              required
            />
          </FormControl>
        );
      case 1:
        return (
          <>
          <FormControl isRequired>
            <FormLabel>Milestones</FormLabel>
            <Textarea
              name="milestones"
              value={formData.milestones}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Milestone Dates</FormLabel>
            <Input
              type="text"
              name="milestoneDates"
              value={formData.milestoneDates}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          </>
        );
      case 2:
        return (
          <FormControl isRequired>
            <FormLabel>Cost</FormLabel>
            <Input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleFormChange}
              required
            />
          </FormControl>
        );
      case 3:
        return (
          <FormControl isRequired>
            <FormLabel>Terms and Conditions</FormLabel>
            <Textarea
              name="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={handleFormChange}
              required
            />
          </FormControl>
        );
      case 4:
        return (
          <FormControl isRequired>
            <FormLabel>Specific Requests</FormLabel>
            <Textarea
              name="specificRequests"
              value={formData.specificRequests}
              onChange={handleFormChange}
              required
            />
          </FormControl>
        );
      case 5:
        return (
          <FormControl>
            <FormLabel>Protect IP</FormLabel>
            <CheckboxGroup>
              <Checkbox
                name="projectIP"
                isChecked={formData.protectIP}
                onChange={handleFormChange}
              >
                Protected IP
              </Checkbox>
            </CheckboxGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box boxShadow="lg" p={8} borderRadius="md" borderWidth={1} ref={forwardRef}>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Client Registration
      </Heading>
      <Text fontSize="md" textAlign="center" mb={6}>
        Sign up your projects here and we will find the best developers for your job. Remeber to mark your IP as protected if you want to keep it private.
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {renderStepContent()}
          {step > 0 && <Button onClick={prevStep}>Previous</Button>}
          {step < 6 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default ClientRegistrationForm;

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
  Checkbox,
  Heading,
  useToast,
  Text,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

interface ClientRegistrationProps {
  formData: any;
  setFormData: any;
  forwardRef: React.RefObject<HTMLDivElement>;
  setClientId: any;
}

const ClientRegistrationForm: React.FC<ClientRegistrationProps> = ({ formData, setFormData, forwardRef, setClientId }) => {
  const toast = useToast();
  const [step, setStep] = useState(0);

  const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: value,
    };
    setFormData({ ...formData, milestones: newMilestones });
  };
  
  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        { description: "", targetDate: "" },
      ],
    });
  };
  
  const removeMilestone = (index: number) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones.splice(index, 1);
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  const uploadClient = async (database: string, values: any[]) => {
    const response = await fetch(`/api/supabase-fetch?database=${database}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });
  
    const { result } = await response.json();
    console.log('Uploaded items:', result);
    return result;
  };  

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const clientData = {
      scope: formData.scope,
      milestones: formData.milestones,
      cost: formData.cost,
      terms_and_conditions: formData.termsAndConditions,
      specific_requests: formData.specificRequests,
      protected_ip: formData.protectedIP,
    };    

    const client = await uploadClient('client_projects', [clientData]);
  
    if (client === '') {
      toast({
        title: 'Client registration failed.',
        description: 'There was an error submitting your registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setClientId(client);
    console.log('Client return', client);
    toast({
      title: 'Client registration complete.',
      description: 'Your registration has been submitted. Please continue to add your email and portfolio items.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <FormControl isRequired>
            <FormLabel>Scope{' '}
              <Tooltip label="Describe the overall project requirements and objectives.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
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
            <FormLabel>
              Milestones{" "}
              <Tooltip label="List the major project milestones and their expected outcomes.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            {formData.milestones.map((milestone: any, index: number) => (
              <HStack key={index} spacing={4}>
                <Input
                  placeholder="Milestone description"
                  name="description"
                  value={milestone.description}
                  onChange={(e) =>
                    handleMilestoneChange(index, "description", e.target.value)
                  }
                  required
                />
                <Input
                  type="date"
                  name="targetDate"
                  value={milestone.targetDate}
                  onChange={(e) =>
                    handleMilestoneChange(index, "targetDate", e.target.value)
                  }
                  required
                />
                <Button onClick={() => removeMilestone(index)}>Remove</Button>
              </HStack>
            ))}
            <Button onClick={addMilestone} mt={2}>
              Add Milestone
            </Button>
          </FormControl>
          </>
        );
      case 2:
        return (
          <FormControl isRequired>
            <FormLabel>Budget Range{' '}
              <Tooltip label="Enter the estimated budget range for your project.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Input
              type="text"
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
            <FormLabel>Terms and Conditions{' '}
              <Tooltip label="Specify the terms and conditions for the project.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
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
          <FormControl>
            <FormLabel>Specific Requests{' '}
              <Tooltip label="List any specific requests or requirements you have for the project.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Textarea
              name="specificRequests"
              value={formData.specificRequests}
              onChange={handleFormChange}
            />
          </FormControl>
        );
      case 5:
        return (
          <FormControl>
            <FormLabel>Protect IP{' '}
              <Tooltip label="Check this box to protect your project's intellectual property.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Checkbox
              name="protectedIP"
              isChecked={formData.protectedIP}
              onChange={(e) => setFormData({ ...formData, protectedIP: e.target.checked })}
            >
              Protected IP
            </Checkbox>
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
          {step > 0 && <Button variant="ghost" onClick={prevStep}>Previous</Button>}
          {step < 5 ? (
            <Button variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                nextStep();
              }}
            >
              Next
            </Button>          
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default ClientRegistrationForm;

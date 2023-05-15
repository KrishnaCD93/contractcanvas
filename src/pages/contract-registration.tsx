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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Container,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

interface Milestone {
  description: string;
  targetDate: string;
}

interface FormState {
  scope: string;
  milestones: Milestone[];
  budget: string;
  termsAndConditions: string;
  specificRequests: string;
  name: string;
  description: string;
  protectedIP: boolean;
}

const ClientRegistrationForm = () => {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const initialFormState: FormState = {
    scope: '',
    milestones: [{ description: "", targetDate: "" }],
    budget: '',
    termsAndConditions: '',
    specificRequests: '',
    name: '',
    description: '',
    protectedIP: false,
  };
  
  const [formState, setFormState] = useState<FormState>(initialFormState);  

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({...prev, [name]: value}));
  };
  
  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...formState.milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: value,
    };
    setFormState(prev => ({ ...prev, milestones: newMilestones }));
  };
  
  const addMilestone = () => {
    setFormState(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { description: "", targetDate: "" },
      ],
    }));
  };
  
  const removeMilestone = (index: number) => {
    const updatedMilestones = [...formState.milestones];
    updatedMilestones.splice(index, 1);
    setFormState(prev => ({ ...prev, milestones: updatedMilestones }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form state', formState);
    setLoading(true);

    if (!formState.scope || !formState.milestones || !formState.budget || !formState.name || !formState.description) {
      toast({
        title: 'Client registration failed.',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }


    const clientData = {
      scope: formState.scope,
      milestones: formState.milestones,
      budget: formState.budget,
      terms_and_conditions: formState.termsAndConditions,
      specific_requests: formState.specificRequests,
      name: formState.name,
      description: formState.description,
      protected_ip: formState.protectedIP,
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

  const [scopeValidated, setScopeValidated] = useState(false);
  const [milestonesValidated, setMilestonesValidated] = useState(false);
  const [budgetValidated, setBudgetValidated] = useState(false);
  const [infoValidated, setInfoValidated] = useState(true);
  
  const renderStepContent = () => {
    return (
      <Tabs isFitted variant='enclosed' index={step} onChange={index => setStep(index)}>
        <TabList mb='1em'>
          <Tab color={scopeValidated ? "inherit" : "red"}>Scope{scopeValidated ? "" : " *"}</Tab>
          <Tab minW={150} color={milestonesValidated ? "inherit" : "red"}>Milestones{milestonesValidated ? "" : " *"}</Tab>
          <Tab color={budgetValidated ? "inherit" : "red"}>Budget{budgetValidated ? "" : " *"}</Tab>
          <Tab>Terms And Conditions</Tab>
          <Tab>Exclusions</Tab>
          <Tab color={infoValidated ? "inherit" : "red"}>Project Info{infoValidated ? "" : " *"}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl isRequired>
              <FormLabel>Scope{' '}
                <Tooltip label="Describe the overall project requirements and objectives.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="scope"
                value={formState.scope}
                onChange={(e) => { 
                  handleFormChange(e);
                  setScopeValidated(!!e.target.value);
                }}
                required
              />
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl isRequired>
              <FormLabel>
                Milestones{" "}
                <Tooltip label="List the major project milestones and their expected outcomes.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              {formState.milestones.map((milestone: Milestone, index: number) => (
                <HStack key={index} spacing={4}>
                  <Input
                    placeholder="Milestone description"
                    name="description"
                    value={milestone.description}
                    onChange={(e) => {
                      handleMilestoneChange(index, "description", e.target.value);
                      setMilestonesValidated(!!e.target.value);
                    }}
                    required
                  />
                  <Input
                    type="date"
                    name="                    targetDate"
                    value={milestone.targetDate}
                    onChange={(e) => {
                      handleMilestoneChange(index, "targetDate", e.target.value);
                      setMilestonesValidated(!!e.target.value);
                    }}
                    required
                  />
                  <Button onClick={() => removeMilestone(index)}>Remove</Button>
                </HStack>
              ))}
              <Button onClick={addMilestone}>Add Milestone</Button>
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl isRequired>
              <FormLabel>Budget{' '}
                <Tooltip label="Provide the project's budget.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Input
                type="number"
                name="budget"
                value={formState.budget}
                onChange={(e) => {
                  handleFormChange(e);
                  setBudgetValidated(!!e.target.value);
                }}
                required
              />
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel>Terms and Conditions{' '}
                <Tooltip label="Specify the terms and conditions for the project.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="termsAndConditions"
                value={formState.termsAndConditions}
                onChange={handleFormChange}
              />
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel>Exclusions{' '}
                <Tooltip label="Specify any specific requests or exclusions for the project.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="specificRequests"
                value={formState.specificRequests}
                onChange={handleFormChange}
              />
            </FormControl>
            </TabPanel>
            <TabPanel>
              <FormControl isRequired>
                <FormLabel>Project Name{' '}
                  <Tooltip label="Provide a name for the project.">
                    <InfoOutlineIcon mb={3} boxSize={3} />
                  </Tooltip>
                </FormLabel>
                <Input
                  name="name"
                  value={formState.name}
                  onChange={(e) => {
                    handleFormChange(e);
                    setInfoValidated(!!e.target.value);
                  }}
                  required
                />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Project Description{' '}
                <Tooltip label="Provide a brief description of the project.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="description"
                value={formState.description}
                onChange={(e) => {
                  handleFormChange(e);
                  setInfoValidated(!!e.target.value);
                }}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                Project Type{' '}
                <Tooltip label="Indicate whether this is an open source project or protected IP.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Checkbox
                name="protectedIP"
                checked={formState.protectedIP}
                onChange={e => setFormState(prev => ({ ...prev, protectedIP: e.target.checked }))}
              />
            </FormControl>
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  };
  
  return (
    <Container
      boxShadow="lg"
      maxW="container.xl"
      p={8}
      borderRadius="md"
      borderWidth={1}
    >
    <Heading as="h2" size="lg" textAlign="center" mb={6}>
      Client Project Registration
    </Heading>
    <Text fontSize="md" textAlign="center" mb={6}>
        Start a project and create a contract to work with people you trust, while protecting your intellectual property.
      </Text>
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" spacing={5}>
        {renderStepContent()}
        <Box>
          {step > 0 && (
            <Button onClick={prevStep} mt={4} variant="outline">
              Previous
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={nextStep} mt={4} variant="outline">
              Next
            </Button>
          ) : (
            <Button type="submit" colorScheme="teal" size="lg" mt={4} isLoading={loading}>
              Register
            </Button>
          )}
        </Box>
      </VStack>
    </form>
  </Container>
);
};

export default ClientRegistrationForm;

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
  Radio,
  RadioGroup,
  useToast,
  Tooltip,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import RegistrationContainer from '@/components/Registration/RegistrationContainer';

interface ProjectRegistrationFormProps {
  forwardRef: React.Ref<HTMLDivElement>;
  setProjectItemsToUpload: (items: ProjectItemsToUpload) => void;
  step: number;
  setStep: (step: number) => void;
  setProgressPercent: (percent: number) => void;
}

interface Milestone {
  milestone: string;
  targetDate: string;
}

export interface ProjectItemsToUpload {
  name: string;
  description: string;
  protected_ip: boolean;
  scope: string;
  milestones: Milestone[];
  budget: number;
  terms_and_conditions: string;
  specific_requests: string;
}

const ProjectRegistrationForm: React.FC<ProjectRegistrationFormProps> = ({
  forwardRef,
  setProjectItemsToUpload,
  step,
  setStep,
  setProgressPercent,
}) => {
  const toast = useToast();
  const [projectStep, setProjectStep] = useState(0);

  const initialFormState = {
    name: '',
    description: '',
    protectedIP: false,
    scope: '',
    milestones: [{ milestone: '', targetDate: '' }],
    budget: 0,
    termsAndConditions: '',
    specificRequests: ''
  };
  
  const [formState, setFormState] = useState(initialFormState); 
  
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
        { milestone: "", targetDate: "" },
      ],
    }));
  };
  
  const removeMilestone = (index: number) => {
    const updatedMilestones = [...formState.milestones];
    updatedMilestones.splice(index, 1);
    setFormState(prev => ({ ...prev, milestones: updatedMilestones }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form state', formState);

    if (!formState.scope || !formState.milestones || !formState.budget || isNaN(formState.budget) || !formState.name || !formState.description) {
      toast({
        title: 'Client registration failed.',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const projectData: ProjectItemsToUpload = {
      name: formState.name,
      description: formState.description,
      protected_ip: formState.protectedIP,
      scope: formState.scope,
      milestones: formState.milestones,
      budget: formState.budget,
      terms_and_conditions: formState.termsAndConditions,
      specific_requests: formState.specificRequests,
    }; 

    setProjectItemsToUpload(projectData);

    setProgressPercent(66);
    setStep(step + 1);
  };

  const nextStep = () => setProjectStep(projectStep + 1);
  const prevStep = () => setProjectStep(projectStep - 1);

  const [scopeValidated, setScopeValidated] = useState<boolean>();
  const [milestonesValidated, setMilestonesValidated] = useState<boolean>();
  const [budgetValidated, setBudgetValidated] = useState<boolean>();
  const [infoValidated, setInfoValidated] = useState<boolean>();
  
  const renderStepContent = () => {
    return (
      <Tabs isFitted variant='enclosed' index={projectStep} onChange={index => setProjectStep(index)}>
        <TabList mb='1em'>
          <Tab color={infoValidated === undefined || infoValidated === true ? "inherit" : "red"}>Project Info{infoValidated ? "" : " *"}</Tab>
          <Tab color={scopeValidated === undefined || scopeValidated === true ? "inherit" : "red"}>Scope{scopeValidated ? "" : " *"}</Tab>
          <Tab minW={150} color={milestonesValidated === undefined || milestonesValidated === true ? "inherit" : "red"}>Milestones{milestonesValidated ? "" : " *"}</Tab>
          <Tab color={budgetValidated === undefined || budgetValidated === true ? "inherit" : "red"}>Budget{budgetValidated ? "" : " *"}</Tab>
          <Tab>Terms And Conditions</Tab>
          <Tab>Exclusions</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
              <FormControl>
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
            <FormControl>
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
              <RadioGroup
                name="protectedIP"
                onChange={(value) =>
                  setFormState((prev) => ({ ...prev, protectedIP: value === 'true' }))
                }
                value={String(formState.protectedIP)}
              >
                <Stack direction="row">
                  <Radio value="false">Open Source</Radio>
                  <Radio value="true">Protected IP</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl>
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
            <FormControl>
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
                    value={milestone.milestone}
                    onChange={(e) => {
                      handleMilestoneChange(index, "milestone", e.target.value);
                      setMilestonesValidated(!!e.target.value);
                    }}
                    required
                  />
                  <Input
                    type="date"
                    name="targetDate"
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
            <FormControl>
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
        </TabPanels>
      </Tabs>
    );
  };
  
  return (
    <RegistrationContainer
      forwardRef={forwardRef}
      title="Project Registration"
      description="Start a project and create a contract to work with people you trust, while protecting your intellectual property."
    >
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={5}>
          {renderStepContent()}
          <Box>
            {projectStep > 0 && (
              <Button onClick={prevStep} mt={4} variant="outline"
                bg="brand.light-blue"
                color="brand.space-cadet"
              >
                Previous
              </Button>
            )}
            {projectStep < 6 ? (
              <Button onClick={nextStep} mt={4} variant="outline"
                bg="brand.mint-green"
                color="brand.space-cadet"
              >
                Next
              </Button>
            ) : (
              <Button
                size="lg"
                bg="brand.mint-green"
                color="brand.space-cadet"
                type="submit"
              >
                Submit Project
              </Button>
            )}
          </Box>
        </VStack>
      </form>
    </RegistrationContainer>
  );
};

export default ProjectRegistrationForm;

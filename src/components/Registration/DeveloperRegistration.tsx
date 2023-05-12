// /components/Registration/DeveloperRegistration.tsx
import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  Heading,
  Text,
  FormHelperText,
  useToast,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';

interface DeveloperRegistrationProps {
  forwardRef: React.RefObject<HTMLDivElement>;
  setDevInfo: (devInfo: any) => void;
  setDevZKP: (devZKP: any) => void;
  setStep: (step: number) => void;
}

const DeveloperRegistrationForm: React.FC<DeveloperRegistrationProps> = ({
  forwardRef,
  setDevInfo,
  setDevZKP,
  setStep,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [devStep, setDevStep] = useState(0);
  const [formData, setFormData] = useState<{
    rate: string;
    resume: File | null;
    availability: string;
    skills: string;
    exclusions: string;
  }>({
    rate: '',
    resume: null,
    availability: '',
    skills: '',
    exclusions: '',
  });
  const [rateDisclosed, setRateDisclosed] = useState(false);
  const [resumeDisclosed, setResumeDisclosed] = useState(false);
  const [availabilityDisclosed, setAvailabilityDisclosed] = useState(false);
  const [skillsDisclosed, setSkillsDisclosed] = useState(false);
  const [exclusionsDisclosed, setExclusionsDisclosed] = useState(false);

  const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const uploadResume = async () => {
    if (!formData.resume) {
      return '';
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.resume);
  
    const response = await fetch('/api/supabase-storage', {
      method: 'POST',
      body: formDataToSend,
    });
  
    const { result } = await response.json();
    console.log('Uploaded resume:', result);
    return result;
  };  

  const uploadDev = async (values: any) => {
    const response = await fetch(`/api/selective-disclodure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });
  
    const { result } = await response.json();
    console.log('Uploaded dev data:', result);
    return result;
  };  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('developer form data:', formData);

    setLoading(true);

    let uploadedResumeUrl = '';
    if (formData.resume) {
      uploadedResumeUrl = await uploadResume();
    }

    setDevInfo({
      rate: formData.rate,
      rateDisclosed: rateDisclosed,
      resume_url: uploadedResumeUrl || '',
      resumeDisclosed: resumeDisclosed,
      availability: formData.availability,
      availabilityDisclosed: availabilityDisclosed,
      skills: formData.skills.split(',').map((skill: string) => skill.trim()),
      skillsDisclosed: skillsDisclosed,
      exclusions: formData.exclusions.split(',').map((exclusion: string) => exclusion.trim()),
      exclusionsDisclosed: exclusionsDisclosed,
    });    

    const developerData = {
      rate: formData.rate,
      rateDisclosed: rateDisclosed,
      availability: formData.availability,
      availabilityDisclosed: availabilityDisclosed,
      skills: formData.skills,
      skillsDisclosed: skillsDisclosed,
      resumeFileName: uploadedResumeUrl,
      resumeFileNameDisclosed: resumeDisclosed,
      exclusions: formData.exclusions,
      exclusionsDisclosed: exclusionsDisclosed,
    };

    const dev = await uploadDev(developerData);

    if (dev === '') {
      toast({
        title: 'Developer registration failed.',
        description: 'There was an error submitting your registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setDevZKP(dev);
    setDevInfo(dev);
    // setStep(1);

    setLoading(false);

    toast({
      title: 'Developer registration complete.',
      description:
        'Your developer profile is complete. Please continue to register your portfolio items.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const nextDevStep = () => setDevStep(devStep + 1);
  const prevDevStep = () => setDevStep(devStep - 1);

  // Define states to track validation status
  const [rateValidated, setRateValidated] = useState(false);
  const [resumeValidated, setResumeValidated] = useState(true); // this is not required
  const [availabilityValidated, setAvailabilityValidated] = useState(false);
  const [skillsValidated, setSkillsValidated] = useState(false);
  const [exclusionsValidated, setExclusionsValidated] = useState(true); // this is not required

  const renderStepContent = () => {
    // Update handleFormChange function to set validation status
    const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
      // existing code...
      const { name, value } = e.target;
      switch (name) {
        case 'rate':
          setRateValidated(!!value);
          break;
        case 'availability':
          setAvailabilityValidated(!!value);
          break;
        case 'skills':
          setSkillsValidated(!!value);
          break;
        default:
          break;
      }
    };
  
    return (
      <Tabs isFitted variant='enclosed' index={devStep} onChange={index => setDevStep(index)}>
        <TabList mb='1em'>
          <Tab minW={150} color={rateValidated ? "inherit" : "red"}>Rate {rateValidated ? "" : "*"}</Tab>
          <Tab minW={150} color={resumeValidated ? "inherit" : "red"}>Resume</Tab>
          <Tab minW={150} color={availabilityValidated ? "inherit" : "red"}>Availability {availabilityValidated ? "" : "*"}</Tab>
          <Tab minW={150} color={skillsValidated ? "inherit" : "red"}>Skills {skillsValidated ? "" : "*"}</Tab>
          <Tab minW={150} color={exclusionsValidated ? "inherit" : "red"}>Exclusions</Tab>
        </TabList>  
        <TabPanels>
          <TabPanel>
            <FormControl isRequired>
              <FormLabel>
                Rate{' '}
                <Tooltip label="Your hourly rate is important for matching you with projects that fit your desired compensation.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleFormChange}
                required
              />
              <FormHelperText>Enter your hourly rate in USD.</FormHelperText>
              <Checkbox
                value="rateDisclosed"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  event.stopPropagation()
                  setRateDisclosed(!rateDisclosed)
                }}
                mt={2}
              >
                {`Disclose your rate to potential matched clients`}
              </Checkbox>
              <Tooltip label="Checked content will be shared to potential clients upon bid submission. 
                When left unchecked, undisclosed data will only be used to create a match rating and will be hashed for your privacy."
              >
                <InfoOutlineIcon ml={1} mb={1} boxSize={3} />
              </Tooltip>
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel>
                Resume{' '}
                <Tooltip label="Upload your resume to showcase your experience and skills to potential clients">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Input type="file" name="resume" onChange={handleFileChange} />
              <FormHelperText>Upload your resume in PDF format.</FormHelperText>
              <Checkbox
                value="resumeDisclosed"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  event.stopPropagation()
                  setResumeDisclosed(!resumeDisclosed)
                }}
                mt={2}
              >
                {`Disclose your resume to potential matched clients`}
              </Checkbox>
              <Tooltip label="Checked content will be shared to potential clients upon bid submission.
                When left unchecked, undisclosed data will only be used to create a match rating and will be hashed for your privacy."
              >
                <InfoOutlineIcon ml={1} mb={1} boxSize={3} />
              </Tooltip>
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl isRequired>
              <FormLabel>
                Availability{' '}
                <Tooltip label="Your availability helps clients understand when you can work on their projects.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleFormChange}
                required
              />
              <FormHelperText>Enter your weekly availability in hours.</FormHelperText>
              <Checkbox
                value="availabilityDisclosed"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  event.stopPropagation()
                  setAvailabilityDisclosed(!availabilityDisclosed)
                }}
                mt={2}
              >
                {`Disclose your availability to potential matched clients`}
              </Checkbox>
              <Tooltip label="Checked content will be shared to potential clients upon bid submission.
                When left unchecked, undisclosed data will only be used to create a match rating and will be hashed for your privacy."
              >
                <InfoOutlineIcon ml={1} mb={1} boxSize={3} />
              </Tooltip>
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl isRequired>
              <FormLabel>
                Skills{' '}
                <Tooltip label="Listing your skills helps clients find developers with the expertise they need for their projects.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="skills"
                value={formData.skills}
                onChange={handleFormChange}
                required
                />
              <FormHelperText>List your skills separated by commas.</FormHelperText>
              <Checkbox
                value="skillsDisclosed"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  event.stopPropagation()
                  setSkillsDisclosed(!skillsDisclosed)
                }}
                mt={2}
              >
                {`Disclose your skills to potential matched clients`}
              </Checkbox>
              <Tooltip label="Checked content will be shared to potential clients upon bid submission.
                When left unchecked, undisclosed data will only be used to create a match rating and will be hashed for your privacy."
              >
                <InfoOutlineIcon ml={1} mb={1} boxSize={3} />
              </Tooltip>
            </FormControl>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel>
                Exclusions{' '}
                <Tooltip label="Specify any project types or industries you prefer not to work in, so you are not matched with unsuitable projects.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="exclusions"
                value={formData.exclusions}
                onChange={handleFormChange}
              />
              <FormHelperText>List any project types or industries you prefer not to work in.</FormHelperText>
              <Checkbox
                value="exclusionsDisclosed"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  event.stopPropagation()
                  setExclusionsDisclosed(!exclusionsDisclosed)
                }}
                mt={2}
              >
                {`Disclose your exclusions to potential matched clients`}
              </Checkbox>
              <Tooltip label="Checked content will be shared to potential clients upon bid submission.
                When left unchecked, undisclosed data will only be used to create a match rating and will be hashed for your privacy."
              >
                <InfoOutlineIcon ml={1} mb={1} boxSize={3} />
              </Tooltip>
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
      ref={forwardRef}
    >
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Developer Registration
      </Heading>
      <Text fontSize="md" textAlign="center" mb={6}>
        Join ContractCanvas as a developer and collaborate on projects with people you trust, while protecting your intellectual property.
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {renderStepContent()}
          {devStep < 4 ? (
            <Button variant='ghost' onClick={(e)=>{
              e.preventDefault()
              setDevStep(devStep + 1)
            }}>Next</Button>
          ) : (
            <Button 
              isLoading={loading}
              loadingText="Creating your ZKP..."
              type="submit"
            >Submit</Button>
          )}
          {devStep > 0 && <Button variant='ghost' onClick={() => setDevStep(devStep - 1)}>Previous</Button>}
        </VStack>
      </form>
    </Container>
  );
};

export default DeveloperRegistrationForm;

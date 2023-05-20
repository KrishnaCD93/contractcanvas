// /components/Registration/DeveloperRegistration.tsx
import React, { ChangeEvent, useState } from 'react';
import {
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
import RegistrationContainer from './RegistrationContainer';

interface DeveloperRegistrationProps {
  forwardRef: React.RefObject<HTMLDivElement>;
  setDevInfo: (devInfo: any) => void;
  setDevZKP: (devZKP: any) => void;
  rate: string;
}

interface DeveloperFormData {
  rate: string;
  availability: string;
  skills: string;
  resume: File | null;
  exclusions: string;
}

export interface DeveloperZKPData {
  rate: string;
  rateDisclosed: boolean;
  availability: string;
  availabilityDisclosed: boolean;
  skills: string;
  skillsDisclosed: boolean;
  resumeFileName: string;
  resumeFileNameDisclosed: boolean;
  exclusions: string;
  exclusionsDisclosed: boolean;
}

export interface ZKPSignal {
  disclosedRate: BigInt;
  disclosedAvailability: BigInt;
  disclosedSkills: BigInt;
  disclosedResumeFileName: BigInt;
  disclosedExclusions: BigInt;
  rateHash: BigInt;
  availabilityHash: BigInt;
  skillsHash: BigInt;
  resumeFileNameHash: BigInt;
  exclusionsHash: BigInt;
}

export interface SignalData {
  disclosedRate: string;
  disclosedAvailability: string;
  disclosedSkills: string;
  disclosedResumeFileName: string;
  disclosedExclusions: string;
  rateHash: BigInt;
  availabilityHash: BigInt;
  skillsHash: BigInt;
  resumeFileNameHash: BigInt;
  exclusionsHash: BigInt;
}

export interface DeveloperZKP {
  proof: string;
  signals: BigInt[];
  isValid: boolean;
}

export interface DeveloperInfoData {
  rate: string;
  availability: string;
  skills: string[];
  resumeFileName: string;
  exclusions: string[];
}

const DeveloperRegistrationForm: React.FC<DeveloperRegistrationProps> = ({
  forwardRef,
  setDevInfo,
  setDevZKP,
  rate,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [devStep, setDevStep] = useState(0);
  const [formData, setFormData] = useState<DeveloperFormData>({
    rate: '',
    resume: null,
    availability: '',
    skills: '',
    exclusions: '',
  });
  const [rateDisclosed, setRateDisclosed] = useState(false);
  const [resumeDisclosed, setResumeDisclosed] = useState(false);
  const [availabilityDisclosed, setAvailabilityDisclosed] = useState(true);
  const [skillsDisclosed, setSkillsDisclosed] = useState(true);
  const [exclusionsDisclosed, setExclusionsDisclosed] = useState(false);

  const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Update handleFormChange function to set validation status
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

  const uploadDev = async (values: DeveloperZKPData) => {
    const response = await fetch(`/api/selective-disclosure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    
    const { proof, publicSignals: signals, isValid } = await response.json();
    console.log('Uploaded dev data:', proof, signals, isValid);
    return { proof, signals, isValid };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('developer form data:', formData);

    setLoading(true);

    if (!formData.rate || !formData.availability || !formData.skills) {
      toast({
        title: 'Developer registration failed.',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    let uploadedResumeUrl = '';
    if (formData.resume) {
      uploadedResumeUrl = await uploadResume();
    }

    setDevInfo({
      rate: formData.rate,
      resume_url: uploadedResumeUrl || '',
      availability: formData.availability,
      skills: formData.skills.split(',').map((skill: string) => skill.trim()),
      exclusions: formData.exclusions.split(',').map((exclusion: string) => exclusion.trim()),
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

    if (dev === undefined) {
      toast({
        title: 'Developer registration failed.',
        description: 'There was an error submitting your registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    setDevZKP(dev);
    setDevInfo(dev);
    setLoading(false);
    
    toast({
      title: 'Developer registration complete.',
      description:
      'Your developer profile is complete. Please continue to register your portfolio items.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    // setStep(1);
  };

  // Define states to track validation status
  const [rateValidated, setRateValidated] = useState<boolean>();
  const [availabilityValidated, setAvailabilityValidated] = useState<boolean>();
  const [skillsValidated, setSkillsValidated] = useState<boolean>();

  const renderStepContent = () => {
    return (
      <Tabs isFitted variant='enclosed' index={devStep} onChange={index => setDevStep(index)}>
        <TabList mb='1em'>
          <Tab minW={150} color={rateValidated === undefined || rateValidated === true ? "inherit" : "red"}>Rate{rateValidated ? "" : " *"}</Tab>
          <Tab minW={150} color={availabilityValidated === undefined || availabilityValidated === true ? "inherit" : "red"}>Availability{availabilityValidated ? "" : " *"}</Tab>
          <Tab minW={150} color={skillsValidated === undefined || skillsValidated === true ? "inherit" : "red"}>Skills{skillsValidated ? "" : " *"}</Tab>
          <Tab minW={150}>Resume</Tab>
          <Tab minW={150}>Exclusions</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl>
              <FormLabel>
                {`Rate ($/hr)`}{' '}
                <Tooltip label="Your hourly rate is important for matching you with projects that fit your desired compensation.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Input
                type="number"
                name="rate"
                placeholder='60.00'
                defaultValue={rate}
                value={formData.rate}
                onChange={handleFormChange}
              />
              <FormHelperText>Enter your hourly rate in USD.</FormHelperText>
              <Checkbox
                name='rateDisclosed'
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
                Availability{' '}
                <Tooltip label="Your availability helps clients understand when you can work on their projects.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Input
                type="text"
                name="availability"
                placeholder="Nights and weekends"
                value={formData.availability}
                onChange={handleFormChange}
                />
              <FormHelperText>Enter your weekly availability in hours.</FormHelperText>
              <Checkbox
                name='availabilityDisclosed'
                value="availabilityDisclosed"
                defaultChecked={availabilityDisclosed}
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
            <FormControl>
              <FormLabel>
                Skills{' '}
                <Tooltip label="Listing your skills helps clients find developers with the expertise they need for their projects.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="skills"
                placeholder="web development, graphic design, project management"
                value={formData.skills}
                onChange={handleFormChange}
                />
              <FormHelperText>List your skills separated by commas.</FormHelperText>
              <Checkbox
                name='skillsDisclosed'
                value="skillsDisclosed"
                defaultChecked={skillsDisclosed}
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
                Resume{' '}
                <Tooltip label="Upload your resume to showcase your experience and skills to potential clients">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Input type="file" name="resume" onChange={handleFileChange} />
              <FormHelperText>Upload your resume in PDF format.</FormHelperText>
              <Checkbox
                name='resumeDisclosed'
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
            <FormControl>
              <FormLabel>
                Exclusions{' '}
                <Tooltip label="Specify any project types or industries you prefer not to work in, so you are not matched with unsuitable projects.">
                  <InfoOutlineIcon mb={3} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Textarea
                name="exclusions"
                placeholder="remote work, office work, full-time work"
                value={formData.exclusions}
                onChange={handleFormChange}
              />
              <FormHelperText>List any project types or industries you prefer not to work in.</FormHelperText>
              <Checkbox
                name='exclusionsDisclosed'
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
    <RegistrationContainer
      forwardRef={forwardRef}
      title="Developer Registration"
      description="Join ContractCanvas as a developer and collaborate on projects with people you trust, while protecting your intellectual property."
      >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {renderStepContent()}
          {devStep < 4 ? (
            <Button variant='ghost' onClick={(e) => {
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
    </RegistrationContainer>
  );
};

export default DeveloperRegistrationForm;

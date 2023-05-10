// /components/Registration/DeveloperRegistration.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
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
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

interface DeveloperRegistrationProps {
  forwardRef: React.RefObject<HTMLDivElement>;
  setDeveloperId: (id: string) => void;
  setStep: (step: number) => void;
}

const DeveloperRegistrationForm: React.FC<DeveloperRegistrationProps> = ({
  forwardRef,
  setDeveloperId,
  setStep,
}) => {
  const toast = useToast();
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
  const [privateData, setPrivateData] = useState<{ [key: string]: boolean }>({
    rate: false,
    resume: false,
    availability: false,
    skills: false,
    exclusions: false,
  });

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

  const handlePrivateDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivateData({ ...privateData, [name]: checked });
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

  const uploadDev = async (database: string, values: any[]) => {
    const response = await fetch(`/api/supabase-fetch?database=${database}`, {
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

    let uploadedResumeUrl = '';
    if (formData.resume) {
      uploadedResumeUrl = await uploadResume();
    }

    const developerData = {
      rate: formData.rate,
      resume_url: uploadedResumeUrl || '',
      availability: formData.availability,
      skills: formData.skills.split(',').map((skill: string) => skill.trim()),
      exclusions: formData.exclusions.split(',').map((exclusion: string) => exclusion.trim()),
      private_data: privateData,
    };    

    const dev = await uploadDev('developers', [developerData]);

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

    setDeveloperId(dev);
    setStep(1);
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

  const renderPrivateCheckbox = (name: string, label: string) => (
    <>
      <Checkbox
        name={name}
        isChecked={privateData[name]}
        onChange={handlePrivateDataChange}
        mt={2}
      >
        {label}
      </Checkbox>
      <Tooltip label="Checked content will be cryptographically secured prior to registration. This data will only be shared with your permission.">
        <InfoOutlineIcon ml={1} mb={1} boxSize={3} />
      </Tooltip>
    </>
  );

  const renderStepContent = () => {
    switch (devStep) {
      case 0:
        return (
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
            {renderPrivateCheckbox("rate", "Mark rate as private and personal data")}
          </FormControl>
        );
      case 1:
        return (
          <FormControl>
            <FormLabel>
              Resume{' '}
              <Tooltip label="Upload your resume to showcase your experience and skills to potential clients.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Input type="file" name="resume" onChange={handleFileChange} />
            <FormHelperText>Upload your resume in PDF format.</FormHelperText>
            {renderPrivateCheckbox("resume", "Mark resume as private and personal data")}
          </FormControl>
        );
      case 2:
        return (
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
            {renderPrivateCheckbox("availability", "Mark availability as private and personal data")}
          </FormControl>
        );
      case 3:
        return (
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
            {renderPrivateCheckbox("skills", "Mark skills as private and personal data")}
          </FormControl>
        );
      case 4:
        return (
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
            {renderPrivateCheckbox("exclusions", "Mark exclusions as private and personal data")}
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      boxShadow="lg"
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
        {devStep > 0 && <Button variant='ghost' onClick={prevDevStep}>Previous</Button>}
        {devStep < 4 ? (
          <Button variant='ghost' onClick={(e)=>{
            e.preventDefault()
            nextDevStep()
          }}>Next</Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
        </VStack>
      </form>
    </Box>
  );
};

export default DeveloperRegistrationForm;

// /components/Registration/DeveloperRegistration.tsx
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
  FormHelperText,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface DeveloperRegistrationProps {
  formData: any;
  setFormData: any;
  forwardRef: React.RefObject<HTMLDivElement>;
}

const DeveloperRegistrationForm: React.FC<DeveloperRegistrationProps> =({ formData, setFormData, forwardRef }) => {
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [resumeUrl, setResumeUrl] = useState('');

  const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    if (name === 'skills') {
      setFormData({ ...formData, [name]: value.split(',').map((skill: string) => skill.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const uploadResume = async () => {
    const response = await fetch('/api/supabase-post-storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: formData.resume }),
    });
  
    const { result } = await response.json();
    console.log('Uploaded portfolio items:', result);
    return result;
  };

  const uploadDev = async (database: string, values: any[]) => {
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

    if (formData.resume) {
      setResumeUrl(await uploadResume());
    }
      
    const developerData = {
      rate: formData.rate,
      resume: resumeUrl || '',
      availability: formData.availability,
      skills: formData.skills,
      exclusions: formData.exclusions,
    };

    const dev = await uploadDev('developers', [developerData]);
  
    if (!dev) {
      toast({
        title: 'Developer registration failed.',
        description: 'There was an error submitting your registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: 'Developer registration complete.',
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
            <FormLabel>Rate</FormLabel>
            <Input
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleFormChange}
              required
            />
            <FormHelperText>Enter your hourly rate in USD.</FormHelperText>
          </FormControl>
        );
      case 1:
        return (
          <FormControl>
            <FormLabel>Resume</FormLabel>
            <Input type="file" name="resume" onChange={handleFileChange} />
            <FormHelperText>Upload your resume in PDF format.</FormHelperText>
          </FormControl>
        );
      case 2:
        return (
          <FormControl isRequired>
            <FormLabel>Availability</FormLabel>
            <Input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleFormChange}
              required
            />
            <FormHelperText>Enter your weekly availability in hours.</FormHelperText>
          </FormControl>
        );
      case 3:
        return (
          <FormControl isRequired>
            <FormLabel>Skills</FormLabel>
            <Textarea
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleFormChange}
              required
            />
            <FormHelperText>List your skills separated by commas.</FormHelperText>
          </FormControl>
        );
      case 4:
        return (
          <FormControl>
            <FormLabel>Exclusions</FormLabel>
            <Textarea
              name="exclusions"
              value={formData.exclusions}
              onChange={handleFormChange}
            />
            <FormHelperText>List any project types or industries you prefer not to work in.</FormHelperText>
          </FormControl>
        );
      default:
        return null;
    }
  };  

  return (
    <Box boxShadow="lg" p={8} borderRadius="md" borderWidth={1} ref={forwardRef}>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Developer Registration
      </Heading>
      <Text fontSize="md" textAlign="center" mb={6}>
        Join ContractCanvas as a developer and collaborate on projects with people you trust, while protecting your intellectual property.
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {renderStepContent()}
          {step > 0 && <Button onClick={prevStep}>Previous</Button>}
          {step < 5 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default DeveloperRegistrationForm;
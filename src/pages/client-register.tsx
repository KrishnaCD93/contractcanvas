// /pages/register.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Container, Divider, Text, VStack, useToast } from '@chakra-ui/react';
import { Database } from '../../types_db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import PersonalInfoForm from '../components/Registration/PersonalInfoRegistration';
import PasswordRegistration from '@/components/Registration/PasswordRegistration';
import ProgressIndicator from '@/components/Registration/ProgressIndicator';
import RegistrationContainer from '@/components/Registration/RegistrationContainer';
import Link from 'next/link';
import { PrimaryButton } from '@/components/Buttons';
import ProjectRegistrationForm, { ProjectItemsToUpload } from '@/components/Registration/ProjectRegistration';

const stepData = [
  { label: "Personal Info", step: 1 },
  { label: "Project Info", step: 2 },
  { label: "Password", step: 3 },
  { label: "Confirm", step: 4 },
];

const RegisterClient: React.FC = () => {
  const [step, setStep] = useState(0);
  const [projectItemsToUpload, setProjectItemsToUpload] = useState<ProjectItemsToUpload>();
  const [userData, setUserData] = useState<any>({});
  const [progressPercent, setProgressPercent] = useState(10);

  const personalRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  
  const toast = useToast();
  const supabaseClient = useSupabaseClient<Database>();

  useEffect(() => {
    if (step === 0) {
      personalRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 1) {
      projectRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 2) {
      passwordRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const uploadProjectItems = async (database: string, values: any[]) => {
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

  const handleSignUp = async () => {
    console.log('userData', userData)
    
    const { data: { user }, error } = await supabaseClient.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.firstName + ' ' + userData.lastName,
          bio: userData.bio,
        }
      }
    });
    
    if (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      if (projectItemsToUpload && user?.id) {
        console.log('project', projectItemsToUpload)
        const projectItemsToUploadWithUserId = {
          ...projectItemsToUpload,
          user_id: user.id,
          username: userData.firstName + ' ' + userData.lastName,
        }
        const projectIds = await uploadProjectItems('projects', [projectItemsToUploadWithUserId]);
        if (projectIds && projectIds.length > 0) {
          toast({
            title: 'Success',
            description: 'Registration successful.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setProgressPercent(100);
          setStep(3);
        } else {
          toast({
            title: 'Error',
            description: 'There was a problem uploading project items.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };
    }
  }

  const renderForm = () => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm
            forwardRef={personalRef}
            setUserData={setUserData}
            step={step}
            setStep={setStep}
            setProgressPercent={setProgressPercent}
          />
        );
      case 1:
        return (
          <ProjectRegistrationForm
            forwardRef={projectRef}
            setProjectItemsToUpload={setProjectItemsToUpload}
            step={step}
            setStep={setStep}
            setProgressPercent={setProgressPercent}
          />
        );
      case 2:
        return (
          <PasswordRegistration
          forwardRef={passwordRef}
          userData={userData}
          handleSignUp={handleSignUp}
          />
          );
      case 3:
        return (
          <RegistrationContainer
          title="Registration successful"
          description='Please check your email to verify your account.'
          forwardRef={null}
          >
        <Divider my={4} />
        <Text mb={4}>
          Thank you for registering!
          <br />
          You can now go ahead and check out some projects to place your bid or create your own project.
        </Text>
        <PrimaryButton
          text="Go to projects"
          route='/projects'
        />
      </RegistrationContainer>
    );
    default:
      return null;
    }
  };

  return (
    <Container maxW="container.lg">
      <VStack spacing={8} width="100%" py={6}>
        <ProgressIndicator 
          currentStep={step} 
          setStep={setStep} 
          progressPercent={progressPercent} 
          stepData={stepData}
        />
        {renderForm()}
      </VStack>
      {step < 3 && <Text fontSize="sm" textAlign="center">
        Already have an account?{' '}
        <Link href="/login"><Text as="u" color="blue.500">Login</Text></Link>
      </Text>}
    </Container>
  );
};

export default RegisterClient;

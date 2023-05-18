// /pages/freelancer-register.tsx
import React, { useEffect, useRef, useState } from 'react';
import PortfolioRegistrationForm from '../components/Registration/PortfolioRegistration';
import PersonalInfoForm from '../components/Registration/PersonalInfoRegistration';
import { Container, Divider, Text, VStack, useToast } from '@chakra-ui/react';
import { Database } from '../../types_db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import PasswordRegistration from '@/components/Registration/PasswordRegistration';
import ProgressIndicator from '@/components/Registration/ProgressIndicator';
import Link from 'next/link';
import { PrimaryButton } from '@/components/Buttons';
import RegistrationContainer from '@/components/Registration/RegistrationContainer';

export interface PortfolioItemsToUpload {
  title: string;
  link: string;
  description: string;
}

const stepData = [
  { label: "Personal Info", step: 1 },
  { label: "Portfolio", step: 2 },
  { label: "Password", step: 3 },
  { label: "Confirm", step: 4 },
];

const Register: React.FC = () => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<any>({});
  const [progressPercent, setProgressPercent] = useState(10);
  const [portfolioItemsToUpload, setPortfolioItemsToUpload] = useState<PortfolioItemsToUpload[]>([]);

  const portfolioRef = useRef<HTMLDivElement>(null);
  const personalRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  
  const toast = useToast();
  const supabaseClient = useSupabaseClient<Database>();

  useEffect(() => {
    if (step === 0) {
      portfolioRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 1) {
      personalRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 2) {
      passwordRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const uploadPortfolioItems = async (database: string, values: any[]) => {
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
      if (portfolioItemsToUpload.length > 0 && user?.id) {
        console.log('portfolio', portfolioItemsToUpload)
        const portfolioItemsToUploadWithUserId = portfolioItemsToUpload.map((item) => {
          return {
            ...item,
            user_id: user.id,
          };
        });
        const portfolioIds = await uploadPortfolioItems('portfolio_items', portfolioItemsToUploadWithUserId);
        if (portfolioIds && portfolioIds.length > 0) {
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
            description: 'There was a problem uploading portfolio items.',
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
          <PortfolioRegistrationForm
            forwardRef={portfolioRef}
            setPortfolioItemsToUpload={setPortfolioItemsToUpload}
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
            title={`Welcome, ${userData.firstName}!`}
            description='Please check your email to verify your account.'
            forwardRef={null}
          >
            <Divider my={4} />
            <Text mb={4}>
              Thank you for registering!
              <br />
              You can now go ahead and check out some projects to place your bids or create your own project.
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

export default Register;

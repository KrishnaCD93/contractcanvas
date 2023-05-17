// /pages/register.tsx
import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
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

const Register: React.FC = () => {
  const [step, setStep] = useState(0);
  const [portfolioIds, setPortfolioIds] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [progressPercent, setProgressPercent] = useState(10);

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

  const handleSignUp = async () => {
    const portfolioIdsToInsert = portfolioIds.map((id) => ({
      id,
    }));
    console.log('portfolioIdsToInsert', portfolioIdsToInsert)
    console.log('userData', userData)
    const { error } = await supabaseClient.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.firstName + ' ' + userData.lastName,
          portfolio_ids: portfolioIdsToInsert,
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
      toast({
        title: 'Success',
        description: 'Registration successful.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setProgressPercent(100);
      setStep(3);
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
            setPortfolioIds={setPortfolioIds}
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
        <ProgressIndicator currentStep={step} setStep={setStep} progressPercent={progressPercent} setProgressPercent={setProgressPercent} />
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

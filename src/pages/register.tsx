// /pages/register.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ClientProjectForm from '../components/Registration/ClientRegistration';
import DeveloperRegistrationForm from '../components/Registration/DeveloperRegistration';
import PortfolioRegistrationForm from '../components/Registration/PortfolioRegistration';
import PersonalInfoForm from '../components/Registration/PersonalInfoRegistration';
import { useRouter } from 'next/router';
import { Container, VStack, useToast } from '@chakra-ui/react';
import { Database } from '../../types_db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import PasswordRegistration from '@/components/Registration/PasswordRegistration';
import ProgressIndicator from '@/components/Registration/ProgressIndicator';

const Register: React.FC = () => {
  const [step, setStep] = useState(0);
  const [developerId, setDeveloperId] = useState('');
  const [portfolioIds, setPortfolioIds] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>({});
  
  const devRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const personalRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  
  const toast = useToast();
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();

  useEffect(() => {
    if (step === 0) {
      devRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 1) {
      portfolioRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 2) {
      personalRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 3) {
      passwordRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);
  
  const handleSignUp = useCallback(async () => {
    const portfolioIdsToInsert = portfolioIds.map((id) => ({
      portfolio_id: id,
    }));
    const { error } = await supabaseClient.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.firstName + ' ' + userData.lastName,
          user_type: 'developer',
          portfolio_ids: portfolioIdsToInsert,
          developer_id: developerId,
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
      router.push('/dashboard');
    }
  }, [developerId, portfolioIds, userData, supabaseClient, toast, router]);

  useEffect(() => {
    if (
      developerId !== '' &&
      portfolioIds.length > 0 &&
      Object.keys(userData).length > 0 &&
      step === 4
    ) {
      handleSignUp();
    }
  }, [developerId, portfolioIds, step, userData, handleSignUp]);

  const renderForm = () => {
    switch (step) {
      case 0:
        return (
          <DeveloperRegistrationForm
            forwardRef={devRef}
            setDeveloperId={setDeveloperId}
            setStep={setStep}
          />
        );
      case 1:
        return (
          <PortfolioRegistrationForm
            forwardRef={portfolioRef}
            setPortfolioIds={setPortfolioIds}
            setStep={setStep}
          />
        );
      case 2:
        return (
          <PersonalInfoForm
            forwardRef={personalRef}
            setUserData={setUserData}
            setStep={setStep}
          />
        );
      case 3:
        return (
          <PasswordRegistration
            forwardRef={passwordRef}
            userData={userData}
            setUserData={setUserData}
            setStep={setStep}
            handleSignUp={handleSignUp}
          />
        );
      default:
        return null;
    }
  };


  return (
    <Container maxW="container.lg">
      <VStack spacing={8} width="100%" py={12}>
        <ProgressIndicator step={step} />
        {renderForm()}
      </VStack>
    </Container>
  );
};

export default Register;

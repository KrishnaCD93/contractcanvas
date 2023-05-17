import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Progress
} from '@chakra-ui/react';
import zxcvbn from 'zxcvbn';
import RegistrationContainer from './RegistrationContainer';

interface PasswordRegistrationProps {
  forwardRef: React.RefObject<HTMLDivElement>;
  userData: any;
  setUserData: (data: any) => void;
  setStep: (step: number) => void;
  handleSignUp: () => void;
}

const PasswordRegistration: React.FC<PasswordRegistrationProps> = ({
  forwardRef,
  userData,
  setUserData,
  setStep,
  handleSignUp,
}) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value;
    setPassword(pass);
    setPasswordStrength(zxcvbn(pass).score);
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(e.target.value);
  };

  const passwordsMatch = password === passwordConfirm;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      return;
    }

    setUserData({ ...userData, password });
    setStep(4);
    handleSignUp();
  };

  const strengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <RegistrationContainer
      title="Password"
      description="Choose a password for your account."
      forwardRef={forwardRef}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </FormControl>
          <Progress
            value={passwordStrength * 25}
            colorScheme={strengthColor()}
            size="xs"
            width="100%"
          />
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              required
            />
          </FormControl>
          {!passwordsMatch && (
            <Text color="red.500">Passwords do not match</Text>
          )}
          <Button type="submit" isDisabled={!passwordsMatch}>
            Add Password and Register
          </Button>
        </VStack>
      </form>
    </RegistrationContainer>
  );
};

export default PasswordRegistration;

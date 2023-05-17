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
  handleSignUp: () => void;
}

const PasswordRegistration: React.FC<PasswordRegistrationProps> = ({
  forwardRef,
  userData,
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

    userData.password = password;

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
            />
          </FormControl>
          {!passwordsMatch && (
            <Text color="red.500">Passwords do not match</Text>
          )}
          <Button
            size="lg"
            bg="brand.mint-green"
            color="brand.space-cadet"
            type="submit"
            isDisabled={!passwordsMatch}>
            Register
          </Button>
        </VStack>
      </form>
    </RegistrationContainer>
  );
};

export default PasswordRegistration;

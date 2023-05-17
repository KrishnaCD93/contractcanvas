import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea
} from "@chakra-ui/react";
import RegistrationContainer from "./RegistrationContainer";

interface PersonalInfoRegistrationProps {
forwardRef: React.RefObject<HTMLDivElement>;
setUserData: (data: any) => void;
step: number;
setStep: (step: number) => void;
setProgressPercent: (percent: number) => void;
}

const PersonalInfoRegistration: React.FC<PersonalInfoRegistrationProps> = ({ 
  forwardRef, 
  setUserData, 
  step, 
  setStep,
  setProgressPercent,
}) => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bio: "",
  });

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setUserData({ ...formData });
    
    setProgressPercent(33);
    setStep(step + 1);
  };

  return (
    <RegistrationContainer
      forwardRef={forwardRef}
      title="Personal Info"
      description="Tell us a little about yourself."
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleFormChange}
            />
          </FormControl>
          <Button
            size="lg"
            bg="brand.mint-green"
            color="brand.space-cadet"
            type="submit"
          >
            Next
          </Button>
        </VStack>
      </form>
    </RegistrationContainer>
  );
};

export default PersonalInfoRegistration;
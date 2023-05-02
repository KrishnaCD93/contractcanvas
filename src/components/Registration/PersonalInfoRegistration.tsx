import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  useToast,
} from "@chakra-ui/react";

interface PersonalInfoRegistrationProps {
forwardRef: React.RefObject<HTMLDivElement>;
setUserData: (data: any) => void;
setStep: (step: number) => void;
}

const PersonalInfoRegistration: React.FC<PersonalInfoRegistrationProps> = ({ forwardRef, setUserData, setStep }) => {
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

    setStep(3);
  };

  return (
    <Box
      boxShadow="lg"
      p={8}
      borderRadius="md"
      borderWidth={1}
      ref={forwardRef}
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
          <Button type="submit">Update Personal Info</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PersonalInfoRegistration;
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/../types_db'
import router from 'next/router';

interface RegistrationState {
  name: string;
  email: string;
  password: string;
  userType: string;
}

export const Registration = () => {
  const supabaseClient = createBrowserSupabaseClient<Database>()
  const [registrationData, setRegistrationData] = useState<RegistrationState>({
    name: '',
    email: '',
    password: '',
    userType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { data, error } = await supabaseClient.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        // Include the user_type and name in the user metadata
        data: {
          user_type: registrationData.userType,
          full_name: registrationData.name,
        }
      }
    });
  
    if (data) {
      router.push('/');
    } else {
      console.error('Error during registration:', error?.message);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl as="fieldset">
            <FormLabel as="legend">User Type</FormLabel>
            <RadioGroup
              name="userType"
              value={registrationData.userType}
              onChange={(value) =>
                setRegistrationData({ ...registrationData, userType: value as string })
              }
            >
              <Stack direction="row">
                <Radio value="client">Client</Radio>
                <Radio value="developer">Developer</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={registrationData.name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={registrationData.email}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={registrationData.password}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button type="submit">Register</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Registration;

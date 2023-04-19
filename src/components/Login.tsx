// components/Login.tsx
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/../types_db'

import router from 'next/router';

interface LoginState {
  email: string;
  password: string;
}

export const Login = () => {
  const supabaseClient = createBrowserSupabaseClient<Database>()
  const [loginData, setLoginData] = useState<LoginState>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: user, error } = await supabaseClient.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      console.error('Error during login:', error.message);
    } else {
      // Redirect user to the home page or dashboard after successful login
      router.push('/dashboard');
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
          </FormControl>
          <Button type="submit">Login</Button>
        </VStack>
      </form>
    </Box>
  );
};

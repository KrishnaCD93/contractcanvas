import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { Login } from '../components/Login';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <Container>
      <Box mt={8} borderWidth={1} borderRadius="lg" p={6}>
        <Heading mb={6}>Login</Heading>
        <Login />
      </Box>
      <Text mt={4} textAlign="center">
        {`Don't`} have an account?{' '}
        <Link href="/register"><Text as="u" color="blue.500">Register</Text></Link>
      </Text>
    </Container>
  );
};

export default LoginPage;

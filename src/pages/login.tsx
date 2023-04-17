import { Box, Container, Heading } from '@chakra-ui/react';
import { Login } from '../components/Login';

const LoginPage = () => {
  return (
    <Container>
      <Box mt={8} borderWidth={1} borderRadius="lg" p={6}>
        <Heading mb={6}>Login</Heading>
        <Login />
      </Box>
    </Container>
  );
};

export default LoginPage;

// pages/index.tsx
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';

export default function HomePage() {
  const router = useRouter();

  return (
    <Layout>
      <Box as="section" pt={20} pb={32}>
        <Container maxW="container.xl">
          <Center flexDirection="column">
            <Heading as="h1" size="3xl" mb={8}>
              ContractCanvas
            </Heading>
            <Text fontSize="xl" textAlign="center">
              Build with people you trust: Forge creative agreements to map your projects
              and partners while protecting your intellectual property.
            </Text>
          </Center>
          <VStack
            alignItems="center"
            justifyContent="center"
            spacing={4}
            mt={16}
          >
            <Text fontSize="2xl" fontWeight="bold">
              Secure your projects with Zero-Knowledge Proofs
            </Text>
            <Text fontSize="lg" textAlign="center">
              ContractCanvas leverages Zero-Knowledge Proofs to create a trustless system
              that enables you to collaborate with confidence, ensuring your sensitive
              information remains secure.
            </Text>
            <Flex justifyContent="center">
              <Stack direction={['column', 'row']} spacing={4}>
                <Button
                  size="lg"
                  colorScheme="teal"
                  onClick={() => router.push('/register')}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              </Stack>
            </Flex>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}

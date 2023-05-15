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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Projects from './projects'

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxW="container.xl">
      <Box as="section" pt={20} pb={32}>
        <Center flexDirection="column">
          <Heading as="h1" size="3xl" mb={8}>
            ContractCanvas
          </Heading>
          <Text fontSize="2xl" fontWeight='black' textAlign="center">
            Build with people you trust
          </Text>
          <Text fontSize="lg" textAlign="center">
            Forge creative agreements to map your projects
            and partners while protecting your intellectual property.
          </Text>
          <Flex mt='10px' justifyContent="center">
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
        </Center>
        <Projects />
      </Box>
    </Container>
  );
}

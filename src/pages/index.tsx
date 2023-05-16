// pages/index.tsx
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Projects from './projects';
import Logo from '@/components/Logo';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxW="container.xl">
      <Box as="section" pt={20} pb={32}>
        <Center h="80vh" flexDirection="column">
          <Logo h={400} w={300} />
          <Box as="header" textAlign="center" my={6}>
            <Text 
              fontSize="4xl" 
              fontWeight="extrabold" 
              color="brand.cool-gray"
            >
              Forge creative{" "}
              <Text as="span" color="brand.misty-rose">contracts</Text>
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color="brand.space-cadet"
              mt={2}
            >
              Build with people you trust while protecting your privacy.
            </Text>
          </Box>
          <Flex mt='10px' justifyContent="center">
            <Stack direction={['column', 'row']} spacing={4}>
              <Button
                size="lg"
                bg="brand.mint-green"
                color="brand.space-cadet"
                onClick={() => router.push('/register')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="brand.light-cyan"
                color="brand.space-cadet"
                _hover={{ bg: "brand.light-cyan-2", color: "brand.space-cadet" }}
                onClick={() => router.push('/contract-registration')}
              >
                Create Project
              </Button>
            </Stack>
          </Flex>
        </Center>
        <Projects />
      </Box>
    </Container>
  );
}

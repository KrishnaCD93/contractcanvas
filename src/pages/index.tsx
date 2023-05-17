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
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';

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
              Freelance with trust while protecting privacy
            </Text>
          </Box>
          <Flex mt='10px' justifyContent="center">
            <Stack direction={['column', 'row']} spacing={4}>
              <PrimaryButton route="/register" text="Get Started" />
              <SecondaryButton route="/login" text="Login" />
            </Stack>
          </Flex>
        </Center>
        <Projects />
      </Box>
    </Container>
  );
}

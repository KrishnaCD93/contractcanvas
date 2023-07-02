// pages/index.tsx
import {
  Box,
  Center,
  Container,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react';
import Projects from '@/components/Projects';
import Logo from '@/components/Logo';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';

export default function HomePage() {
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
            <Container centerContent>
              <PrimaryButton route="/contract" text="Create A Contract" />
              <Stack direction={['column', 'row']} spacing={4} my={2}>
                <SecondaryButton route="/client-register" text="Submit A Project Request" />
                <SecondaryButton route="/freelancer-register" text="Sign Up As Freelancer" />
              </Stack>
            </Container>
          </Flex>
        </Center>
        <Projects />
      </Box>
    </Container>
  );
}

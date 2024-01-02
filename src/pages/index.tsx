// pages/index.tsx
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import Logo from '@/components/Logo';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import Image from 'next/image';
import vectorIllustration from '../assets/vector-illustration.svg';

export default function HomePage() {
  return (
    <Container maxW="container.xl">
      <Box as="section" pt={20} mt='20'>
        <Center flexDirection="column">
          <Logo h={400} w={300} />
          <Box as="header" textAlign="center" my={6}>
            <Text
              fontSize="4xl"
              fontWeight="extrabold"
              color="brand.cool-gray"
            >
              FORGE CREATIVE{" "}
              <Text as="span" color="brand.dark-orange">CONTRACTS</Text>
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color="brand.space-cadet"
              mt={2}
            >
              Freelance with built-in data analytics for your projects
            </Text>
            <Heading as="h1" color="brand.space-cadet" textAlign="center" mt='5' fontWeight='extrabold' fontSize={'xxx-large'}>CONTRACT CANVAS</Heading>
          </Box>
          <Flex mt='5' mb='10' justifyContent="center">
            <Container centerContent>
              <PrimaryButton route="/contract" text="Build A Contract" />
              <Stack direction={['column', 'row']} spacing={4} my={2}>
                <SecondaryButton route="/client-register" text="Submit A Project" />
                {/* verticle line with text */}
                <Box
                  borderLeft="2px solid"
                  borderColor="brand.cool-gray"
                  height="2rem"
                  my={2}
                />
                <SecondaryButton route="/freelancer-register" text="Find A Project" />
              </Stack>
            </Container>
          </Flex>
          <Box boxShadow='lg'>
            <Image src={vectorIllustration} alt="vector illustration" />
          </Box>
        </Center>
      </Box>
    </Container>
  );
}

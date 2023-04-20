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
import ReactMarkdown from 'react-markdown';

const mermaidCode = `[![](https://mermaid.ink/img/pako:eNqlVU2P0zAQ_SujHCpW20b9yoJ6WGm7BQ4gVG21IKFKyDjT1CKxg-0UltX-d8b5apqk9EAOluW8zLw388Z59rgK0Vt4Bn9mKDmuBIs0S7YS6EmZtoKLlEkLjwb1tztgBu5jgdKeQSxzhJJWM26V3soCp5Fb0NH3V9PZeAjTqVuC8VXxsgg9ur29LkIs4MGxMRYY0MFBcIQCiTIsNsUqlUXQItpbULsyzAI2lkjBJ4yUFcwK1aEQBI7CG7cEV41I6oC6jDKEisrEh5VmOwsDePub75mMENZaqZ1pka_SF-iqBH0givoeJWpGOZkMSSMtXz-smxGXDfBn1GL31M26HDXS0ttUGYT7nKJp1KtX_swt48vyp36zkvBRqbT4JKZdt8i9YlfC8MyYU2pdpSTiLtJIRLT7hLl9q-29enoc1dFTUZn5RY6kdnCH7TshWSz-YF8Ll6cFP4gQYSMiyWym8V-erGJV0Rsla3m61jV5PSNJkxvXrPHFPs19R4ikUZ0H8JiGZC5zyXwpe1KZBWN1xo8KaqWjttRExDSVSiJkzQR9XZkEU9eQyRBod5F94MMXpX9QmZI0xtxpg8L2gjdK1ZmMEo_wi75uYa7r-6AcL9cPhwNeZzkzwuXAHYP-_xzd-M7TaUbvH9CoOOsbpy6iM1WnY5WjjzTP3gx593jnZmhJ67du7lhY51ZpN3k-dyWgm5R27ct8dDJQpdfqnN7QS1AnTIT083l2x1vP7mkut96CtiEjTd5WvhCOZVZtniT3FjsWGxx6hfnKP1V5-vIXYkgnFg?type=png)](https://mermaid.live/edit#pako:eNqlVU2P0zAQ_SujHCpW20b9yoJ6WGm7BQ4gVG21IKFKyDjT1CKxg-0UltX-d8b5apqk9EAOluW8zLw388Z59rgK0Vt4Bn9mKDmuBIs0S7YS6EmZtoKLlEkLjwb1tztgBu5jgdKeQSxzhJJWM26V3soCp5Fb0NH3V9PZeAjTqVuC8VXxsgg9ur29LkIs4MGxMRYY0MFBcIQCiTIsNsUqlUXQItpbULsyzAI2lkjBJ4yUFcwK1aEQBI7CG7cEV41I6oC6jDKEisrEh5VmOwsDePub75mMENZaqZ1pka_SF-iqBH0givoeJWpGOZkMSSMtXz-smxGXDfBn1GL31M26HDXS0ttUGYT7nKJp1KtX_swt48vyp36zkvBRqbT4JKZdt8i9YlfC8MyYU2pdpSTiLtJIRLT7hLl9q-29enoc1dFTUZn5RY6kdnCH7TshWSz-YF8Ll6cFP4gQYSMiyWym8V-erGJV0Rsla3m61jV5PSNJkxvXrPHFPs19R4ikUZ0H8JiGZC5zyXwpe1KZBWN1xo8KaqWjttRExDSVSiJkzQR9XZkEU9eQyRBod5F94MMXpX9QmZI0xtxpg8L2gjdK1ZmMEo_wi75uYa7r-6AcL9cPhwNeZzkzwuXAHYP-_xzd-M7TaUbvH9CoOOsbpy6iM1WnY5WjjzTP3gx593jnZmhJ67du7lhY51ZpN3k-dyWgm5R27ct8dDJQpdfqnN7QS1AnTIT083l2x1vP7mkut96CtiEjTd5WvhCOZVZtniT3FjsWGxx6hfnKP1V5-vIXYkgnFg)`;

export default function HomePage() {
  const router = useRouter();

  return (
    <Box as="section" pt={20} pb={32}>
      <Container maxW="container.xl">
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
          <Center>
            <VStack>
              <Text fontSize="xl" fontWeight="bold">How it works:</Text>
              <ReactMarkdown>{mermaidCode}</ReactMarkdown>
            </VStack>
          </Center>
        </VStack>
      </Container>
    </Box>
  );
}

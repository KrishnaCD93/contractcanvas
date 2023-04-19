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

const mermaidCode = `[![](https://mermaid.ink/img/pako:eNp9k1FLwzAQx7_KkSeFCltdYXQw6Db0RUQY-lSQs712wTWpl_Rhjn13k9ZBne36EI7cP7__Xa45ikznJGJh6KshldFGYslYpQrcVyNbmckalYVXQ_yeABpIhY8hScWIatVTrbyq0zFlFrj8uAmjKIBwOg9gOo9uu2SHv1suO0IMW-uw8EylthKt1GrRCUnlI8Bw7pdR4JoJLcGGsbCw1soyZvYqdOJ4922po9BHUsQe-8JaF2Yx1owz-CsZdJx5s7aXaNJ3XJ1RSQxvxLI4DPj1RS5ba0Ow3qEq6bpn26VbprOz517run_z8OQ2utRgdxtpssaYs9uFsl9XUjIRaPZH0Me9wgbR7YGK1NVB-erDcPLv2vqgB6lwL79pYPIiEBVxhTJ37-Dot1Nhd841FbELc-RP_xOfnA4bq7cHlYnYckOBaOrcDf_3zYi4wL2h0w8regY5?type=png)](https://mermaid.live/edit#pako:eNp9k1FLwzAQx7_KkSeFCltdYXQw6Db0RUQY-lSQs712wTWpl_Rhjn13k9ZBne36EI7cP7__Xa45ikznJGJh6KshldFGYslYpQrcVyNbmckalYVXQ_yeABpIhY8hScWIatVTrbyq0zFlFrj8uAmjKIBwOg9gOo9uu2SHv1suO0IMW-uw8EylthKt1GrRCUnlI8Bw7pdR4JoJLcGGsbCw1soyZvYqdOJ4922po9BHUsQe-8JaF2Yx1owz-CsZdJx5s7aXaNJ3XJ1RSQxvxLI4DPj1RS5ba0Ow3qEq6bpn26VbprOz517run_z8OQ2utRgdxtpssaYs9uFsl9XUjIRaPZH0Me9wgbR7YGK1NVB-erDcPLv2vqgB6lwL79pYPIiEBVxhTJ37-Dot1Nhd841FbELc-RP_xOfnA4bq7cHlYnYckOBaOrcDf_3zYi4wL2h0w8regY5)`;

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

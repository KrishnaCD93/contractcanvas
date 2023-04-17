// components/Layout.tsx
import React, { ReactNode } from 'react';
import { Box, Container, Flex, Heading, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <Box minHeight="100vh" bg="gray.100">
      <Flex as="header" bg="teal.500" color="white" p={4}>
        <Container maxW="container.xl">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading as="h1" size="md" cursor="pointer" onClick={() => router.push('/')}>
              ContractCanvas
            </Heading>
            <Flex>
              <Link
                mr={4}
                onClick={() => router.push('/login')}
                _hover={{ textDecoration: 'underline' }}
              >
                Login
              </Link>
              <Link
                onClick={() => router.push('/register')}
                _hover={{ textDecoration: 'underline' }}
              >
                Register
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Flex>
      <Box as="main" pt={12} pb={8}>
        <Container maxW="container.xl">{children}</Container>
      </Box>
    </Box>
  );
};

// /pages/Projects.tsx
import React from 'react';
import {
  Box,
  Heading,
  Container,
} from '@chakra-ui/react';
import { SecondaryButton } from '@/components/Buttons';
import Projects from '@/components/Projects';

const ProjectPage = () => {
  
  
  return (
    <Container maxW="container.xl">
      <Box as="section" pt={20} pb={32} textAlign='center'>
        <Heading as="h1" color="brand.delft-blue" textAlign="center" mb={6}>
          Projects
        </Heading>
        <SecondaryButton route="/project-registration" text="Submit A New Project" />
        <Projects />
      </Box>
    </Container>
  );
};  

export default ProjectPage;

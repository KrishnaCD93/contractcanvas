// /pages/Projects.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Container,
} from '@chakra-ui/react';

interface Project {
  id: string;
  scope: string;
  milestones: string;
  milestone_dates: string;
  cost: number;
  terms_and_conditions: string;
  specific_requests: string;
  project_ip: boolean;
}

const fetchProjects = async () => {
  const response = await fetch('/api/supabase-get?database=client_projects', {
    method: 'GET',
  });

  const { result } = await response.json();
  return result;
};

const ProjectCard: React.FC<Project> = ({
  scope,
  milestones,
  milestone_dates,
  cost,
  terms_and_conditions,
  specific_requests,
  project_ip,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="lg">
      <VStack align="start" spacing={4}>
        <Text><b>Scope:</b> {scope}</Text>
        <Text><b>Milestones:</b> {milestones}</Text>
        <Text><b>Milestone Dates:</b> {milestone_dates}</Text>
        <Text><b>Cost:</b> ${cost}</Text>
        <Text><b>Terms and Conditions:</b> {terms_and_conditions}</Text>
        <Text><b>Specific Requests:</b> {specific_requests}</Text>
        <Text><b>Project IP:</b> {project_ip ? 'Protected' : 'Not Protected'}</Text>
      </VStack>
    </Box>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndSetProjects() {
      setProjects(await fetchProjects());
      setLoading(false);
    }
    fetchAndSetProjects();
  }, []);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner />
      </Container>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="2xl" textAlign="center" mb={6}>
        Projects
      </Heading>
      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Projects;

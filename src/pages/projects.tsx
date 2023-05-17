// /pages/Projects.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Container,
} from '@chakra-ui/react';
import { ProjectCard, Project } from '@/components/ProjectCard';
import { PrimaryButton } from '@/components/Buttons';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/supabase-fetch?database=projects', {
        method: 'GET',
      });
  
      const { result } = await response.json();
      return result;
    } catch (err) {
      setError('Error fetching projects.');
      return [];
    }
  };

  const fetchAndSetProjects = useCallback(async () => {
    const fetchedProjects = await fetchProjects();
    if (fetchedProjects) {
      setProjects(fetchedProjects);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAndSetProjects();
  }, [fetchAndSetProjects]);  

  const deleteProject = async (id: string) => {
    const response = await fetch(`/api/supabase-fetch?database=client_projects&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const { result } = await response.json();
    return result;
  };  
  
  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects(projects.filter((project) => project.id !== id));
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container centerContent>
        <Text>Error: {error}</Text>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl">
      <Box as="section" pt={20} pb={32}>
        <Heading as="h1" size="2xl" textAlign="center" mb={6}>
          Projects
        </Heading>
        <PrimaryButton route="/contract-registration" text="Create New Project" />
        <SimpleGrid columns={[1, null, 2]} spacing={10}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} onDelete={handleDelete} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
};  

export default Projects;

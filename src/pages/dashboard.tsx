import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Container,
  Button,
} from '@chakra-ui/react';
import ProjectCard, { ProjectItems } from '@/components/ProjectCard';
import { useUser } from '@supabase/auth-helpers-react';

const fetchPortfolio = async (database: string) => {
  const response = await fetch(`/api/supabase-fetch?database=${database}`, {
    method: 'GET',
  });

  const { result } = await response.json();
  return result;
};

const deleteProject = async (database: string, id: string) => {
  const response = await fetch(`/api/supabase-fetch?database=${database}&id=${id}`, {
    method: 'DELETE',
  });

  const { result } = await response.json();
  return result;
};

const uploadPortfolioItem = async (database: string, values: any[]) => {
  const response = await fetch('/api/supabase-fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ database, values }),
  });

  const { result } = await response.json();
  return result;
};

// ...Dashboard component definition

const Dashboard = () => {
  const user = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAndSetPortfolioItems = useCallback(async () => {
    setProjects(await fetchPortfolio('client_projects'))
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAndSetPortfolioItems();
  }, [fetchAndSetPortfolioItems]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProject('client_projects', id); // Change to 'portfolio_items' for developers
      fetchAndSetPortfolioItems();
    },
    [fetchAndSetPortfolioItems]
  );

  const handleCreate = useCallback(async () => {
    // Replace with the actual values for the new portfolio item
    const newPortfolioItem = {
      // ...properties
    };

    await uploadPortfolioItem('portfolio_items', [newPortfolioItem]); // Change to 'client_projects' for clients
    fetchAndSetPortfolioItems();
  }, [fetchAndSetPortfolioItems]);

  // ...Rendering logic

  return (
    <Box>
      <Heading as="h1" size="2xl" textAlign="center" mb={6}>
        Dashboard
      </Heading>
      <Button onClick={handleCreate} mb={6}>
        Add Portfolio Item
      </Button>
      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        {projects.map((project, idx) => (
          <ProjectCard key={idx} {...project} onDelete={handleDelete} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import PortfolioRegistrationForm from '@/components/Registration/PortfolioRegistration';
import { PortfolioItemsToUpload } from './freelancer-register';
import { ProjectItemsToUpload } from '@/components/Registration/ProjectRegistration';

interface projectItemsToUploadWithUserId extends ProjectItemsToUpload {
  user_id: string;
  projectItems: ProjectItems;
}

interface PortfolioItemsToUploadWithUserId extends PortfolioItemsToUpload {
  user_id: string;
}

const fetchItem = async (database: string) => {
  const response = await fetch(`/api/supabase-fetch?database=${database}`, {
    method: 'GET',

  });

  const { result } = await response.json();
  return result;
};

const deleteItem = async (database: string, id: string) => {
  const response = await fetch(`/api/supabase-fetch?database=${database}&id=${id}`, {
    method: 'DELETE',
  });

  const { result } = await response.json();
  return result;
};

const uploadItem = async (database: string, values: any[]) => {
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

const Dashboard = () => {
  const user = useUser();
  const [projects, setProjects] = useState<ProjectItems[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemsToUploadWithUserId[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPortfolioRegistration, setShowPortfolioRegistration] = useState(false);
  const [portfolioItemsToUpload, setPortfolioItemsToUpload] = useState<PortfolioItemsToUpload[]>([]);
  const [projectItemsToUpload, setProjectItemsToUpload] = useState<ProjectItemsToUpload>();

  const portfolioRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);

  const fetchAndSetPortfolioItems = useCallback(async () => {
    const fetchedPortfolioItems = await fetchItem('portfolio_items');
    setPortfolioItems(fetchedPortfolioItems.filter((item: PortfolioItemsToUploadWithUserId) => item.user_id === user?.id));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAndSetPortfolioItems();

    return () => {
      setPortfolioItems([]);
    }
  }, [fetchAndSetPortfolioItems]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteItem('portfolio_items', id);
      fetchAndSetPortfolioItems();
    }, [fetchAndSetPortfolioItems]);

  const handleSubmitPortfolio = async () => {
    const portfolioItemsToUploadWithUserId = portfolioItemsToUpload.map((item) => {
      return {
        ...item,
        user_id: user?.id
      }
    });
    const portfolioItems = await uploadItem('portfolio_items', portfolioItemsToUploadWithUserId);
    console.log('portfolioItems', portfolioItems);
    setShowPortfolioRegistration(false);
  };

  useEffect(() => {
    if (portfolioItemsToUpload.length > 0) {
      handleSubmitPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioItemsToUpload]);

  if (loading) return <Spinner />;

  return (
    <Box>
      <Heading as="h1" size="2xl" textAlign="center" mb={6}>
        Dashboard
      </Heading>
      {showPortfolioRegistration ? 
        <PortfolioRegistrationForm
        forwardRef={portfolioRef}
        setPortfolioItemsToUpload={setPortfolioItemsToUpload}
        step={0}
        setStep={() => {}}
        setProgressPercent={() => {}}
      /> :
      <Button onClick={() => setShowPortfolioRegistration(!showPortfolioRegistration)} mb={6}>
        Add Portfolio Item
      </Button>}
      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        {projects.map((project, idx) => (
          <ProjectCard key={idx} {...project} user={user ? user : null} onDelete={handleDelete} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;

// /src/components/Projects.tsx
import { Container, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import ProjectCard, { ProjectItems } from "./ProjectCard";
import { useCallback, useEffect, useState } from "react";
import { Divider } from "antd";
import { useUser } from "@supabase/auth-helpers-react";

const Projects = () => {
  const [projects, setProjects] = useState<ProjectItems[]>([{
    username: "",
    id: "", 
    name: "", 
    description: "", 
    scope: "", 
    milestones: [{ milestone: "", targetDate: "" }], 
    budget: 0, 
    terms_and_conditions: "", 
    specific_requests: "", 
    protected_ip: false,
    user_id: "",
    created_at: new Date(),
  }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

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
      // set projects in reverse chronological order
      setProjects(fetchedProjects.reverse());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAndSetProjects();
  }, [fetchAndSetProjects]);  
  
  const handleDelete = async (id: string) => {
    await fetch(`/api/supabase-fetch?database=client_projects&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    setProjects(projects.filter((project) => project.id !== id));
  };

  if (loading) {
    return (
      <Container my={2} centerContent>
        <Spinner />
      </Container>
    );
  }
  
  if (error) {
    console.log(error);
  }

  return (
    <Container maxW="container.xl">
      <Divider />
      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        {projects.map((project) => (
          <ProjectCard {...project} user={user ? user : null} key={project.id} onDelete={handleDelete} />
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default Projects;
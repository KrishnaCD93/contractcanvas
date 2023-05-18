import { Box, Button, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useUser } from '@supabase/auth-helpers-react';

export interface ProjectItems {
  id: string;
  name: string;
  description: string;
  scope: string;
  milestones: any[];
  budget: number;
  terms_and_conditions: string;
  specific_requests: string;
  protected_ip: boolean;
  user_id: string;
}

interface ProjectCardProps extends ProjectItems {
  onDelete: (id: string) => void;
  user: any;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  onDelete, 
  user,
  id,
  name,
  description,
  scope,
  milestones,
  budget,
  terms_and_conditions,
  specific_requests,
  protected_ip,
  user_id,
  }) => {

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={6} 
      boxShadow="lg" 
      bg="brand.white"
      color="brand.space-cadet"
    >
      <VStack align="start" spacing={4}>
        <Text>{name}</Text>
        <Text>{description}</Text>
        {protected_ip ? <Text color="brand.cool-gray">Protected Information</Text> :
        (<><Text><b>Scope:</b> {scope}</Text>
        <Text><b>Milestones:</b> {milestones.map((milestone) => milestone.title).join(', ')}</Text>
        <Text><b>Budget Range:</b> ${budget}</Text>
        <Text><b>Terms and Conditions:</b> {terms_and_conditions}</Text>
        <Text><b>Specific Requests:</b> {specific_requests}</Text></>)}
        <Link href={`/${id}/bid`} passHref>
          <Button as="a" colorScheme="brand.light-cyan-2">
            Bid
          </Button>
        </Link>
        {user && user.id === user_id && 
        <Button colorScheme="red" onClick={() => onDelete(id)}>
          Delete
        </Button>}
      </VStack>
    </Box>
  );
};

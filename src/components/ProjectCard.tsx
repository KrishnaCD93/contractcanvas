import { Box, Button, Skeleton, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
export interface Project {
  id: string;
  name: string;
  description: string;
  scope: string;
  milestones: any[];
  budget: number;
  terms_and_conditions: string;
  specific_requests: string;
  protected_ip: boolean;
}

interface ProjectCardProps extends Project {
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  scope,
  milestones,
  budget,
  terms_and_conditions,
  specific_requests,
  protected_ip,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="lg">
      <VStack align="start" spacing={4}>
        <Text>{name}</Text>
        <Text>{description}</Text>
        {protected_ip ? <Skeleton height="20px" width="100px" /> :
        (<><Text><b>Scope:</b> {scope}</Text>
        <Text><b>Milestones:</b> {milestones.map((milestone) => milestone.title).join(', ')}</Text>
        <Text><b>Budget Range:</b> ${budget}</Text>
        <Text><b>Terms and Conditions:</b> {terms_and_conditions}</Text>
        <Text><b>Specific Requests:</b> {specific_requests}</Text></>)}
        <Link href={`/${id}/bid`} passHref>
          <Button as="a" colorScheme="blue">
            Bid
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};
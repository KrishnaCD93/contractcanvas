import { Box, Button, Text, VStack } from "@chakra-ui/react";

export interface Project {
  id: string;
  scope: string;
  milestones: any[];
  cost: number;
  terms_and_conditions: string;
  specific_requests: string;
  protected_ip: boolean;
}

interface ProjectCardProps extends Project {
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  scope,
  milestones,
  cost,
  terms_and_conditions,
  specific_requests,
  protected_ip,
  onDelete,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="lg">
      <VStack align="start" spacing={4}>
        <Text><b>Scope:</b> {scope}</Text>
        <Text><b>Milestones:</b> {milestones.map((milestone) => milestone.title).join(', ')}</Text>
        <Text><b>Budget Range:</b> ${cost}</Text>
        <Text><b>Terms and Conditions:</b> {terms_and_conditions}</Text>
        <Text><b>Specific Requests:</b> {specific_requests}</Text>
        <Text><b>Protected IP:</b> {protected_ip ? 'Protected' : 'Not Protected'}</Text>
        <Button colorScheme="red" onClick={() => onDelete(id)}>
          Delete
        </Button>
      </VStack>
    </Box>
  );
};
import { Box, Button, Icon, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "./Logo";
import { DeleteIcon } from "@chakra-ui/icons";
import React from "react";

export interface ProjectItems {
  username: string;
  id: string;
  name: string;
  description: string;
  scope: string;
  milestones: {milestone: string, targetDate: ""}[];
  budget: number;
  terms_and_conditions: string;
  specific_requests: string;
  protected_ip: boolean;
  user_id: string;
  created_at: Date;
}

interface ProjectCardProps extends ProjectItems {
  onDelete: (id: string) => void;
  user: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
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
      <VStack align="stretch" spacing={4}>
        <Logo h={200} w={200} />
        <Text fontWeight={'bold'}>{name}</Text>
        <Text>{description}</Text>
        <Text><b>Scope:</b> {scope}</Text>
        <Text>
          <b>Milestones:</b> <br />
          {milestones.map((milestone, index) => 
            <React.Fragment key={index}>
              <i>{milestone.milestone}</i>
              {`: ${new Date(milestone.targetDate).toLocaleDateString()}`}
              {index !== milestones.length - 1 && <br />}
            </React.Fragment>
          )}
        </Text>
        {protected_ip ? <Text color="brand.cool-gray">Protected Information. Submit a bid to view.</Text> :
        (<>
        <Text><b>Budget Range:</b> ${budget}</Text>
        <Text><b>Terms and Conditions:</b> {terms_and_conditions ? terms_and_conditions : `N/A`}</Text>
        <Text><b>Specific Requests:</b> {specific_requests ? specific_requests : `N/A`}</Text></>)}
        <Link href={`/${id}/bid`} passHref>
          <Box backgroundColor={'brand.light-cyan-2'} as={Button}>Bid</Box>
        </Link>
        {user && user.id === user_id && 
        <Button colorScheme="red" onClick={() => onDelete(id)}>
          <Icon as={DeleteIcon} />
        </Button>}
      </VStack>
    </Box>
  );
};

export default ProjectCard;
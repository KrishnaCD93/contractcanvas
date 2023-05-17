// src/components/Resigtration/RegistrationContainer.tsx
import { Box, Container, Heading, Text } from "@chakra-ui/react"

interface RegistrationContainerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  forwardRef: React.Ref<HTMLDivElement>;
}

const RegistrationContainer: React.FC<RegistrationContainerProps> = ({ children, ...props }) => {
  return (
    <Container maxW="container.lg">
      <Box
        boxShadow="lg"
        p={8}
        borderRadius="md"
        borderWidth={1}
        borderColor="brand.light-cyan"
        ref={props.forwardRef}
      >
        <Heading size="lg" mb={4}>
          {props.title}
        </Heading>
        <Text size="lg">
          {props.description}
        </Text>
        {children}
      </Box>
    </Container>
  )
}

export default RegistrationContainer;

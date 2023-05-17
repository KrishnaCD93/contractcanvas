import React from "react";
import { Box, Text, Progress, Stack, VStack, Center, HStack } from "@chakra-ui/react";

interface ProgressIndicatorProps {
  currentStep: number;
  setStep: (step: number) => void;
  progressPercent: number;
  setProgressPercent: (percent: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps>= ({ currentStep, setStep, progressPercent, setProgressPercent }) => {
  const stepData = [
    { label: "Personal Info", step: 1 },
    { label: "Portfolio", step: 2 },
    { label: "Password", step: 3 },
    { label: "Confirm", step: 4 },
  ];

  return (
    <Center>
      <VStack spacing={4}>
      <Progress hasStripe size='md' colorScheme="teal" value={progressPercent} w="100%" />
        <Stack direction="row" justifyContent="space-between" spacing={4}>
          {stepData.map((step, index) => (
            <Box 
            key={index} 
              onClick={() => {
                if (index === 3) return
                setStep(index)
                }} 
              cursor={index === 3 ? "default" : "pointer"}
            >
              <HStack>
                <Box borderRadius="full" bg={currentStep === index ? "brand.space-cadet" : "brand.light-cyan-2"} w={8} h={8}>
                  <Center h="100%">
                    <Text color="white" fontWeight="bold">{step.step}</Text>
                  </Center>
                </Box>
                <Text 
                  color={currentStep === index ? "brand.space-cadet" : "brand.light-cyan-2"} 
                  fontWeight={currentStep === index ? "bold" : "normal"}
                >
                  {step.label}
                </Text>
              </HStack>
            </Box>
          ))}
        </Stack>
      </VStack>
    </Center>
  );
};

export default ProgressIndicator;

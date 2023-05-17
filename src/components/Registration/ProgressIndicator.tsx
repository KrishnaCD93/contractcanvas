import React, { useEffect, useState } from "react";
import { Box, Text, Progress, Stack, VStack, Center, HStack } from "@chakra-ui/react";

interface ProgressIndicatorProps {
  currentStep: number;
  setStep: (step: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps>= ({ currentStep, setStep }) => {
  const [progressPercent, setProgressPercent] = useState(10);
  const stepData = [
    { label: "Personal Info", step: 1 },
    { label: "Portfolio", step: 2 },
    { label: "Password", step: 3 },
    { label: "Confirm", step: 4 },
  ];

  useEffect(() => {
    setProgressPercent(currentStep === 0 ? 10 : ((currentStep + 0.5) / stepData.length) * 100);
  }, [currentStep, stepData.length]);

  return (
    <Center>
      <VStack spacing={4}>
      <Progress hasStripe size='md' colorScheme="teal" value={progressPercent} w="100%" />
        <Stack direction="row" justifyContent="space-between" spacing={4}>
          {stepData.map((step, index) => (
            <Box key={index} onClick={() => setStep(index)} cursor="pointer">
              <HStack>
                <Box borderRadius="full" bg={currentStep === index ? "brand.celeste" : "brand.cool-gray"} w={8} h={8}>
                  <Center h="100%">
                    <Text color="white" fontWeight="bold">{step.step}</Text>
                  </Center>
                </Box>
                <Text 
                  color={currentStep === index ? "brand.celeste" : "brand.cool-gray"} 
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

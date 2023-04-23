// /components/Registration/ClientRegistration.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  CheckboxGroup,
  Checkbox,
  Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface ClientProjectFormData {
  scope: string;
  milestones: string;
  milestoneDates: string;
  cost: number;
  termsAndConditions: string;
  specificRequests: string;
  projectIP: boolean;
}

const steps = [
  'Scope',
  'Milestones',
  'Milestone Dates',
  'Cost',
  'Terms and Conditions',
  'Specific Requests',
  'Project IP',
];

export const ClientProjectForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientProjectFormData>();

  const onSubmit = (data: ClientProjectFormData) => {
    console.log(data);
  };

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormControl>
            <FormLabel>Scope</FormLabel>
            <Textarea {...register('scope', { required: true })} />
          </FormControl>
        );
      case 1:
        return (
          <FormControl>
            <FormLabel>Milestones</FormLabel>
            <Textarea {...register('milestones', { required: true })} />
          </FormControl>
        );
      case 2:
        return (
          <FormControl>
            <FormLabel>Milestone Dates</FormLabel>
            <Input {...register('milestoneDates', { required: true })} />
          </FormControl>
        );
      case 3:
        return (
          <FormControl>
            <FormLabel>Cost</FormLabel>
            <Input {...register('cost', { required: true, min: 0 })} type="number" />
          </FormControl>
        );
      case 4:
        return (
          <FormControl>
            <FormLabel>Terms and Conditions</FormLabel>
            <Textarea {...register('termsAndConditions', { required: true })} />
          </FormControl>
        );
      case 5:
        return (
          <FormControl>
            <FormLabel>Specific Requests</FormLabel>
            <Textarea {...register('specificRequests', { required: true })} />
          </FormControl>
        );
      case 6:
        return (
          <FormControl>
            <FormLabel>Project IP</FormLabel>
            <CheckboxGroup>
              <Checkbox {...register('projectIP')} value="true">
                Protected IP
              </Checkbox>
            </CheckboxGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          {renderStep(currentStep)}
          {currentStep > 0 && (
            <Button onClick={prevStep} variant="outline">
              Previous
            </Button>)}
          {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </VStack>
      </form>
      <Box>
        <Heading as="h3" size="md">Submitted Data:</Heading>
        <pre>{JSON.stringify({ steps }, null, 2)}</pre>
      </Box>
    </Box>
  );
};

export default ClientProjectForm;

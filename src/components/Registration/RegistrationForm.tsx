// /components/Registration/RegistrationForm.tsx
import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  RadioGroup,
  Stack,
  Radio,
  Checkbox,
  Heading,
  FormHelperText,
  Text,
} from '@chakra-ui/react';
import { RegistrationState } from '@/pages/register';

interface RegistrationProps {
  registrationData: RegistrationState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePortfolioChange: (e: { target: { name: any; value: any; }; }) => void;
  handleCheckboxChange: (e: { target: { name: any; checked: any; }; }) => void;
  upsertPortfolioItem: () => void;
  editPortfolioItem: (index: number) => void;
  currentItem: { title: string; link: string; protectedIP: boolean; };
  portfolioItems: any[];
  editingIndex: number | null;
}

export const Registration: React.FC<RegistrationProps> = ({
  registrationData,
  handleChange,
  handleRoleChange,
  handleSubmit,
  handlePortfolioChange,
  handleCheckboxChange,
  upsertPortfolioItem,
  editPortfolioItem,
  currentItem,
  portfolioItems,
  editingIndex,
}) => {

  return (
    <Box>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        ContractCanvas Registration
      </Heading>
      <Text fontSize="md" textAlign="center" mb={6}>
        Please fill the below form to register. Items checked for protected IP will not be shared with other users unless authorized by you.
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} boxShadow="lg" p={8} borderRadius="md" borderWidth={1}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={registrationData.name}
              onChange={handleChange}
              required
            />
            <FormHelperText>Enter your full name.</FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={registrationData.email}
              onChange={handleChange}
              required
            />
            <FormHelperText>Enter a valid email address.</FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={registrationData.password}
              onChange={handleChange}
              required
            />
            <FormHelperText>Password must be at least 8 characters long.</FormHelperText>
          </FormControl>
          <FormControl>
            <Heading as="h3" size="md">Portfolio</Heading>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={currentItem.title}
              onChange={handlePortfolioChange}
            />
            <FormHelperText>Enter the title of your portfolio item.</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Link</FormLabel>
            <Input
              type="text"
              name="link"
              value={currentItem.link}
              onChange={handlePortfolioChange}
            />
            <FormHelperText>Enter a link to your portfolio item.</FormHelperText>
          </FormControl>
          <FormControl>
            <Checkbox
              name="protectedIP"
              isChecked={currentItem.protectedIP}
              onChange={handleCheckboxChange}
            >
              Mark item as protected IP
            </Checkbox>
            <FormHelperText>Check this box if the item is a protected IP.</FormHelperText>
          </FormControl>
          <Box ml={2}>
          <Button variant="outline" onClick={upsertPortfolioItem}>
            {editingIndex !== null ? 'Update' : 'Add'} portfolio item
          </Button>
          </Box>
          <Box>
          <Heading as="h4" size="sm" mb={2}>Added Portfolio Items:</Heading>
            {portfolioItems.map((item, index) => (
              <Box key={item.id} borderWidth={1} borderRadius="md" p={3} mb={2}>
                <p>
                  <strong>Title:</strong> {item.title}
                </p>
                <p>
                  <strong>Link:</strong> {item.link}
                </p>
                <p>
                  <strong>Protected IP:</strong> {item.protectedIP ? 'Yes' : 'No'}
                </p>
                <Button size="sm" onClick={() => editPortfolioItem(index)}>Edit</Button>
              </Box>
            ))}
          </Box>
          <FormControl as="fieldset">
            <FormLabel as="legend">Role</FormLabel>
            <RadioGroup
              onChange={(value) => handleRoleChange(value)}
              defaultValue='none'
            >
              <Stack direction="row">
                <Radio value="client">Client</Radio>
                <Radio value="developer">Developer</Radio>
                <Radio value="none">None</Radio>
              </Stack>
              <FormHelperText>How would you like to use ContractCanvas?</FormHelperText>
            </RadioGroup>
          </FormControl>
          <Button type="submit">Register</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Registration;


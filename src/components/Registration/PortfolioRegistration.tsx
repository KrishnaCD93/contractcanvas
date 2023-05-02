import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  useToast,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

interface PortfolioItem {
  id: string;
  title: string;
  link: string;
  protectedIp: boolean;
}

interface PortfolioRegistrationFormProps {
  forwardRef: React.Ref<HTMLDivElement>;
  setPortfolioIds: (ids: string[]) => void;
  setStep: (step: number) => void;
}

const PortfolioRegistrationForm: React.FC<PortfolioRegistrationFormProps> = ({
  forwardRef,
  setPortfolioIds,
  setStep,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    protectedIp: false,
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  const toast = useToast();

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const portfolioItem = {
      id: Date.now().toString(),
      title: formData.title,
      link: formData.link,
      protectedIp: formData.protectedIp,
    };

    setPortfolioItems([...portfolioItems, portfolioItem]);

    // Reset form data
    setFormData({
      title: "",
      link: "",
      protectedIp: false,
    });
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setPortfolioItems(
      portfolioItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
  };

  const uploadPortfolioItems = async (database: string, values: any[]) => {
    const response = await fetch(`/api/supabase-fetch?database=${database}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });
  
    const { result } = await response.json();
    console.log('Uploaded dev data:', result);
    return result;
  };  

  const handleSubmit = async () => {
    const uploadedIds = await uploadPortfolioItems('portfolio_items', portfolioItems);
    setPortfolioIds(uploadedIds);
    toast({
      title: "Portfolio items updated.",
      description: "Your portfolio items were updated successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setStep(2);
  };

  return (
    <Box
      boxShadow="lg"
      p={8}
      borderRadius="md"
      borderWidth={1}
      ref={forwardRef}
    >
      <form onSubmit={handleAddPortfolio}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Link</FormLabel>
            <Textarea
              name="link"
              value={formData.link}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <Button type="submit">Add Portfolio Item</Button>
        </VStack>
      </form>
      <VStack spacing={4} mt={4}>
        {portfolioItems.map((item) => (
          <Box key={item.id} width="100%">
            <Editable
              defaultValue={item.title}
              onSubmit={(value) => handleUpdate(item.id, "title", value)}
            >
              <EditablePreview />
              <EditableInput />
              <IconButton
                aria-label="Edit title"
                icon={<EditIcon />}
                size="sm"
                onClick={()=> {}} 
              />
            </Editable>
            <Editable
              defaultValue={item.link}
              onSubmit={(value) => handleUpdate(item.id, "link", value)}
            >
              <EditablePreview />
              <EditableInput />
              <IconButton
                aria-label="Edit link"
                icon={<EditIcon />}
                size="sm"
                onClick={() => {}}
              />
            </Editable>
            <IconButton
              aria-label="Delete portfolio item"
              icon={<CloseIcon />}
              size="sm"
              onClick={() => handleDelete(item.id)}
              colorScheme="red"
            />
          </Box>
        ))}
        <Button onClick={handleSubmit}>Submit Portfolio</Button>
      </VStack>
    </Box>
  );
};

export default PortfolioRegistrationForm;        
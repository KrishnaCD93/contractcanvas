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
  Icon
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import RegistrationContainer from "./RegistrationContainer";

interface PortfolioItem {
  id: string;
  title: string;
  link: string;
  description: string;
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
    description: "",
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
      description: formData.description,
    };

    setPortfolioItems([...portfolioItems, portfolioItem]);

    // Reset form data
    setFormData({
      title: "",
      link: "",
      description: "",
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
    if (portfolioItems.length === 0 && (!formData.title || !formData.link)) return;
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
    <RegistrationContainer 
      forwardRef={forwardRef} 
      title="Portfolio"
      description="Describe your work and show us your portfolio. You can add as many portfolio items as you like. Help build trust by showing us your work."
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
            <Input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <Button
            size="lg"
            variant="outline"
            borderColor="brand.light-cyan"
            color="brand.space-cadet"
            _hover={{ bg: "brand.light-cyan-2", color: "brand.space-cadet" }}
            type="submit"
          >
            <Icon as={PlusSquareIcon} mr={2} />
            Add Portfolio Item
          </Button>
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
        <Button
          size="lg"
          bg="brand.mint-green"
          color="brand.space-cadet"
          onClick={handleSubmit}
        >
          <Icon as={CheckIcon} mr={2} />
          Submit All Portfolio Items
        </Button>
      </VStack>
    </RegistrationContainer>
  );
};

export default PortfolioRegistrationForm;        
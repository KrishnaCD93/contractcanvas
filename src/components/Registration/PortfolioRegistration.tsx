import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Icon,
  SimpleGrid,
  EditableTextarea
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import RegistrationContainer from "./RegistrationContainer";
import { PortfolioItemsToUpload } from "@/pages/freelancer-register";

interface PortfolioItem {
  id: string;
  title: string;
  link: string;
  description: string;
}

interface PortfolioRegistrationFormProps {
  forwardRef: React.Ref<HTMLDivElement>;
  setPortfolioItemsToUpload: (items: PortfolioItemsToUpload[]) => void;
  step: number;
  setStep: (step: number) => void;
  setProgressPercent: (percent: number) => void;
}

const PortfolioRegistrationForm: React.FC<PortfolioRegistrationFormProps> = ({
  forwardRef,
  setPortfolioItemsToUpload,
  step,
  setStep,
  setProgressPercent,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  
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

  const handleSubmit = async () => {
    if (portfolioItems.length === 0 && (!formData.title || !formData.link)) return;
    const portfolioItemsToUpload: any[] = [];
    portfolioItems.forEach((item) => {
      portfolioItemsToUpload.push({
        title: item.title,
        link: item.link,
        description: item.description,
      });
    });
    if (portfolioItemsToUpload.length > 0) {
      setPortfolioItemsToUpload(portfolioItemsToUpload)
      setProgressPercent(66);
      setStep(step + 1);
    };
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
        <SimpleGrid columns={3} spacing={4} width="100%">
          {portfolioItems.map((item) => (
            <Box key={item.id} width="100%" borderWidth={1} borderColor="brand.light-cyan" p={2}>
              <Editable
                defaultValue={item.title}
                onSubmit={(value) => handleUpdate(item.id, "title", value)}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              <Editable
                defaultValue={item.link}
                onSubmit={(value) => handleUpdate(item.id, "link", value)}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              <Editable
                defaultValue={item.description}
                onSubmit={(value) => handleUpdate(item.id, "description", value)}
              >
                <EditablePreview />
                <EditableTextarea />
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
        </SimpleGrid>
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
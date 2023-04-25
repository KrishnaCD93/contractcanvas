// /pages/register.tsx
import React, { useEffect, useState } from 'react';
import RegistrationForm from '../components/Registration/RegistrationForm';
import ClientProjectForm from '../components/Registration/ClientRegistration';
import DeveloperRegistrationForm from '../components/Registration/DeveloperRegistration';
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '../../types_db';
import { useRouter } from 'next/router';

export interface RegistrationState {
  name: string;
  email: string;
  password: string;
  userType: string;
  portfolioItems: any[];
};

const RegisterPage: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>()
  
  const [registrationData, setRegistrationData] = useState<RegistrationState>({
    name: '',
    email: '',
    password: '',
    userType: '',
    portfolioItems: [],
  });

  const [devFormData, setDevFormData] = useState<{
    rate: string;
    resume: File | null;
    availability: string;
    skills: string[];
    exclusions: string;
  }>({
    rate: '',
    resume: null,
    availability: '',
    skills: [],
    exclusions: '',
  });

  const [clientFormData, setClientFormData] = useState<{
    scope: '',
    milestones: [], 
    cost: '',
    termsAndConditions: '',
    specificRequests: '',
    protectedIP: false,
  }>({
    scope: '',
    milestones: [],
    cost: '',
    termsAndConditions: '',
    specificRequests: '',
    protectedIP: false,
  });

  const [currentItem, setCurrentItem] = useState({
    title: '',
    link: '',
    protectedIP: false,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [clientId, setClientId] = useState<string | null>(null);
  const [developerId, setDeveloperId] = useState<string | null>(null);

  const scrollToTarget = React.useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setRegistrationData((prevData) => ({ ...prevData, userType: value }));
  };

  const handlePortfolioChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };  

  const handleCheckboxChange = (e: { target: { name: any; checked: any; }; }) => {
    const { name, checked } = e.target;
    setCurrentItem({ ...currentItem, [name]: checked });
  };

  const upsertPortfolioItem = () => {
    if (editingIndex !== null) {
      const updatedPortfolioItems = [...registrationData.portfolioItems];
      updatedPortfolioItems[editingIndex] = currentItem;
      setRegistrationData((prevData) => ({ ...prevData, portfolioItems: updatedPortfolioItems }));
      setEditingIndex(null);
    } else {
      setRegistrationData((prevData) => ({ ...prevData, portfolioItems: [...prevData.portfolioItems, currentItem] }));
    }
    setCurrentItem({ title: '', link: '', protectedIP: false });
  };

  const editPortfolioItem = (index: number) => {
    setCurrentItem(registrationData.portfolioItems[index]);
    setEditingIndex(index);
  };

  const uploadPortfolioItem = async (database: string, values: any[]) => {
    const response = await fetch(`/api/supabase-fetch?database=${database}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });
  
    const { result } = await response.json();
    console.log('Uploaded portfolio item:', result);
    return result;
  };  

  useEffect(() => {
    if (registrationData.userType !== '' && scrollToTarget.current) {
      scrollToTarget.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [registrationData.userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(registrationData);

    const portfolioItemsToInsert = registrationData.portfolioItems.map((item) => ({
      title: item.title,
      link: item.link,
      protected_ip: item.protectedIP,
    }));

    const portfolioId = await uploadPortfolioItem('portfolio_items', portfolioItemsToInsert);

    if (portfolioId === '') {
      toast({
        title: 'Error',
        description: 'There was an error uploading your portfolio items.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return;
    }

    const { error } = await supabaseClient.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: {
          full_name: registrationData.name,
          user_type: registrationData.userType,
          portfolio_id: portfolioId,
          client_project_id: clientId,
          developer_id: developerId,
        },
      },
    });    

    if (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    toast({
      title: 'Account created.',
      description: 'Your account has been created. Please check your email to verify your account.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })

    router.push('/dashboard')
  };

  const renderForm = () => {
    if (registrationData.userType === 'client') {
      return <ClientProjectForm forwardRef={scrollToTarget} formData={clientFormData} setFormData={setClientFormData} setClientId={setClientId} />;
    } else if (registrationData.userType === 'developer') {
      return <DeveloperRegistrationForm forwardRef={scrollToTarget} formData={devFormData} setFormData={setDevFormData} setDeveloperId={setDeveloperId} />;
    }
    return null;
  };

  const renderDrawerContent = () => (
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Registration Data</DrawerHeader>
      <DrawerBody>
        <Tabs>
          <TabList>
            <Tab>Registration</Tab>
            <Tab>{registrationData.userType !== 'none' && registrationData.userType === 'client' ? 'Client' : 'Developer'} Data</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <pre>{JSON.stringify(registrationData.portfolioItems, null, 2)}</pre>
            </TabPanel>
            <TabPanel>
              <pre>{registrationData.userType !== 'none' && registrationData.userType === 'client' ? JSON.stringify(clientFormData, null, 2) : JSON.stringify(devFormData, null, 2)}</pre>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DrawerBody>
      <DrawerFooter>
        <Button onClick={onClose}>Close</Button>
      </DrawerFooter>
    </DrawerContent>
  );

  return (
    <VStack spacing={4}>
      <RegistrationForm
        renderForm={renderForm}
        registrationData={registrationData}
        handleChange={handleChange}
        handleRoleChange={handleRoleChange}
        handleSubmit={handleSubmit}
        handlePortfolioChange={handlePortfolioChange}
        handleCheckboxChange={handleCheckboxChange}
        upsertPortfolioItem={upsertPortfolioItem}
        editPortfolioItem={editPortfolioItem}
        currentItem={currentItem}
        portfolioItems={registrationData.portfolioItems}
        editingIndex={editingIndex}
      />
      <Button onClick={onOpen}>View Registration Data</Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
        <DrawerOverlay />
        {renderDrawerContent()}
      </Drawer>
    </VStack>
  );
};

export default RegisterPage;

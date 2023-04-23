// /pages/register.tsx
import React, { useState } from 'react';
import RegistrationForm from '../components/Registration/RegistrationForm';
import ClientProjectForm from '../components/Registration/ClientRegistration';
import DeveloperRegistrationForm from '../components/Registration/DeveloperRegistration';
import { VStack } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '../../types_db';

export interface RegistrationState {
  name: string;
  email: string;
  password: string;
  userType: string;
  portfolioItems: any[];
};

const RegisterPage: React.FC = () => {
  const supabaseClient = useSupabaseClient<Database>()
  
  const [registrationData, setRegistrationData] = useState<RegistrationState>({
    name: '',
    email: '',
    password: '',
    userType: '',
    portfolioItems: [],
  });

  const [currentItem, setCurrentItem] = useState({
    title: '',
    link: '',
    protectedIP: false,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    // Handle form submission
    console.log(registrationData);
    // Insert the portfolio items
    const portfolioItemsToInsert = registrationData.portfolioItems.map((item) => ({
      title: item.title,
      link: item.link,
      protected_ip: item.protectedIP,
    }));

    const { error } = await supabaseClient.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: {
          full_name: registrationData.name,
          user_type: registrationData.userType,
          portfolioItems: portfolioItemsToInsert,
        },
      }
    })
  
    const { error: portfolioError } = await supabaseClient
      .from('portfolio_items')
      .insert(portfolioItemsToInsert);
  
    if (portfolioError) {
      console.error('Error inserting portfolio items:', portfolioError);
      return;
    }
  };

  const renderForm = () => {
    if (registrationData.userType === 'client') {
      return <ClientProjectForm />;
    } else if (registrationData.userType === 'developer') {
      return <DeveloperRegistrationForm />;
    }
    return null;
  };

  return (
    <VStack spacing={4}>
      <RegistrationForm
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
      {renderForm()}
    </VStack>
  );
};

export default RegisterPage;

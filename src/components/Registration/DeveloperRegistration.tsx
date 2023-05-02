// /components/Registration/DeveloperRegistration.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  Heading,
  Text,
  FormHelperText,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

interface DeveloperRegistrationProps {
  forwardRef: React.RefObject<HTMLDivElement>;
  setDeveloperId: (id: string) => void;
  setStep: (step: number) => void;
}

const DeveloperRegistrationForm: React.FC<DeveloperRegistrationProps> = ({
  forwardRef,
  setDeveloperId,
  setStep,
}) => {
  const toast = useToast();
  const [devStep, setDevStep] = useState(0);
  const [formData, setFormData] = useState<{
    rate: string;
    resume: File | null;
    availability: string;
    skills: string;
    exclusions: string;
  }>({
    rate: '',
    resume: null,
    availability: '',
    skills: '',
    exclusions: '',
  });

  const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const uploadResume = async () => {
    if (!formData.resume) {
      return '';
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.resume);
  
    const response = await fetch('/api/supabase-storage', {
      method: 'POST',
      body: formDataToSend,
    });
  
    const { result } = await response.json();
    console.log('Uploaded resume:', result);
    return result;
  };  

  const uploadDev = async (database: string, values: any[]) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('developer form data:', formData);

    let uploadedResumeUrl = '';
    if (formData.resume) {
      uploadedResumeUrl = await uploadResume();
    }

    const developerData = {
      rate: formData.rate,
      resume_url: uploadedResumeUrl || '',
      availability: formData.availability,
      skills: formData.skills.split(',').map((skill: string) => skill.trim()),
      exclusions: formData.exclusions.split(',').map((exclusion: string) => exclusion.trim()),
    };    

    const dev = await uploadDev('developers', [developerData]);

    if (dev === '') {
      toast({
        title: 'Developer registration failed.',
        description: 'There was an error submitting your registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setDeveloperId(dev);
    setStep(1);
    toast({
      title: 'Developer registration complete.',
      description:
        'Your developer profile is complete. Please continue to register your portfolio items.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const nextDevStep = () => setDevStep(devStep + 1);
  const prevDevStep = () => setDevStep(devStep - 1);

  const renderStepContent = () => {
    switch (devStep) {
      case 0:
        return (
          <FormControl isRequired>
            <FormLabel>
              Rate{' '}
              <Tooltip label="Your hourly rate is important for matching you with projects that fit your desired compensation.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Input
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleFormChange}
              required
            />
            <FormHelperText>Enter your hourly rate in USD.</FormHelperText>
          </FormControl>
        );
      case 1:
        return (
          <FormControl>
            <FormLabel>
              Resume{' '}
              <Tooltip label="Upload your resume to showcase your experience and skills to potential clients.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Input type="file" name="resume" onChange={handleFileChange} />
            <FormHelperText>Upload your resume in PDF format.</FormHelperText>
          </FormControl>
        );
      case 2:
        return (
          <FormControl isRequired>
            <FormLabel>
              Availability{' '}
              <Tooltip label="Your availability helps clients understand when you can work on their projects.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleFormChange}
              required
            />
            <FormHelperText>Enter your weekly availability in hours.</FormHelperText>
          </FormControl>
        );
      case 3:
        return (
          <FormControl isRequired>
            <FormLabel>
              Skills{' '}
              <Tooltip label="Listing your skills helps clients find developers with the expertise they need for their projects.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Textarea
              name="skills"
              value={formData.skills}
              onChange={handleFormChange}
              required
            />
            <FormHelperText>List your skills separated by commas.</FormHelperText>
          </FormControl>
        );
      case 4:
        return (
          <FormControl>
            <FormLabel>
              Exclusions{' '}
              <Tooltip label="Specify any project types or industries you prefer not to work in, so you are not matched with unsuitable projects.">
                <InfoOutlineIcon mb={3} boxSize={3} />
              </Tooltip>
            </FormLabel>
            <Textarea
              name="exclusions"
              value={formData.exclusions}
              onChange={handleFormChange}
            />
            <FormHelperText>List any project types or industries you prefer not to work in.</FormHelperText>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box boxShadow="lg" p={8} borderRadius="md" borderWidth={1} ref={forwardRef}>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Developer Registration
      </Heading>
      <Text fontSize="md" textAlign="center" mb={6}>
        Join ContractCanvas as a developer and collaborate on projects with people you trust, while protecting your intellectual property.
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
        {renderStepContent()}
        {devStep > 0 && <Button variant='ghost' onClick={prevDevStep}>Previous</Button>}
        {devStep < 4 ? (
          <Button variant='ghost' onClick={(e)=>{
            e.preventDefault()
            nextDevStep()
          }}>Next</Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
        </VStack>
      </form>
    </Box>
  );
};

export default DeveloperRegistrationForm;

// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   VStack,
//   Textarea,
//   Heading,
//   Text,
//   FormHelperText,
//   useToast,
//   Tooltip,
// } from '@chakra-ui/react';
// import { InfoOutlineIcon } from '@chakra-ui/icons';

// interface DeveloperRegistrationProps {
//   formData: any;
//   setFormData: any;
//   forwardRef: React.RefObject<HTMLDivElement>;
//   setDeveloperId: any;
// }

// const DeveloperRegistrationForm: React.FC<DeveloperRegistrationProps> =({ formData, setFormData, forwardRef, setDeveloperId }) => {
//   const toast = useToast();
//   const [step, setStep] = useState(0);

//   const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
//     const { name, value } = e.target;

//     if (name === 'skills') {
//       setFormData({ ...formData, [name]: value.split(',').map((skill: string) => skill.trim()) });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     if (file) {
//       setFormData({ ...formData, resume: file });
//     }
//   };

//   const uploadResume = async () => {
//     const response = await fetch('/api/supabase-storage', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ file: formData.resume }),
//     });
  
//     const { result } = await response.json();
//     console.log('Uploaded portfolio items:', result);
//     return result;
//   };

//   const uploadDev = async (database: string, values: any[]) => {
//     const response = await fetch(`/api/supabase-fetch?database=${database}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ values }),
//     });
  
//     const { result } = await response.json();
//     console.log('Uploaded dev data:', result);
//     return result;
//   };  

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('developer form data:', formData);
  
//     let uploadedResumeUrl = '';
//     if (formData.resume) {
//       uploadedResumeUrl = await uploadResume();
//     }
  
//     const developerData = {
//       rate: formData.rate,
//       resume_url: uploadedResumeUrl || '',
//       availability: formData.availability,
//       skills: formData.skills,
//       exclusions: formData.exclusions,
//     };
  
//     const dev = await uploadDev('developers', [developerData]);
  
//     if (dev === '') {
//       toast({
//         title: 'Developer registration failed.',
//         description: 'There was an error submitting your registration.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//       return;
//     }
  
//     setDeveloperId(dev);
//     toast({
//       title: 'Developer registration complete.',
//       description: 'Your developer profile is complete. Please continue to register your email and portfolio.',
//       status: 'success',
//       duration: 5000,
//       isClosable: true,
//     });
//   };  

//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => setStep(step - 1);

//   const renderStepContent = () => {
//     switch (step) {
//       case 0:
//         return (
//           <FormControl isRequired>
//             <FormLabel>
//               Rate{' '}
//               <Tooltip label="Your hourly rate is important for matching you with projects that fit your desired compensation.">
//                 <InfoOutlineIcon mb={3} boxSize={3} />
//               </Tooltip>
//             </FormLabel>
//             <Input
//               type="text"
//               name="rate"
//               value={formData.rate}
//               onChange={handleFormChange}
//               required
//             />
//             <FormHelperText>Enter your hourly rate in USD.</FormHelperText>
//           </FormControl>
//         );
//       case 1:
//         return (
//           <FormControl>
//             <FormLabel>
//               Resume{' '}
//               <Tooltip label="Upload your resume to showcase your experience and skills to potential clients.">
//                 <InfoOutlineIcon mb={3} boxSize={3} />
//               </Tooltip>
//             </FormLabel>
//             <Input type="file" name="resume" onChange={handleFileChange} />
//             <FormHelperText>Upload your resume in PDF format.</FormHelperText>
//           </FormControl>
//         );
//       case 2:
//         return (
//           <FormControl isRequired>
//             <FormLabel>
//               Availability{' '}
//               <Tooltip label="Your availability helps clients understand when you can work on their projects.">
//                 <InfoOutlineIcon mb={3} boxSize={3} />
//               </Tooltip>
//             </FormLabel>
//             <Input
//               type="text"
//               name="availability"
//               value={formData.availability}
//               onChange={handleFormChange}
//               required
//             />
//             <FormHelperText>Enter your weekly availability in hours.</FormHelperText>
//           </FormControl>
//         );
//       case 3:
//         return (
//           <FormControl isRequired>
//             <FormLabel>
//               Skills{' '}
//               <Tooltip label="Listing your skills helps clients find developers with the expertise they need for their projects.">
//                 <InfoOutlineIcon mb={3} boxSize={3} />
//               </Tooltip>
//             </FormLabel>
//             <Textarea
//               name="skills"
//               defaultValue={formData.skills.join(', ')}
//               onChange={handleFormChange}
//               required
//             />
//             <FormHelperText>List your skills separated by commas.</FormHelperText>
//           </FormControl>
//         );
//       case 4:
//         return (
//           <FormControl>
//             <FormLabel>
//               Exclusions{' '}
//               <Tooltip label="Specify any project types or industries you prefer not to work in, so you are not matched with unsuitable projects.">
//                 <InfoOutlineIcon mb={3} boxSize={3} />
//               </Tooltip>
//             </FormLabel>
//             <Textarea
//               name="exclusions"
//               defaultValue={formData.exclusions.join(', ')}
//               onChange={handleFormChange}
//             />
//             <FormHelperText>List any project types or industries you prefer not to work in.</FormHelperText>
//           </FormControl>
//         );
//       default:
//         return null;
//     }
//   };
  

//   return (
//     <Box boxShadow="lg" p={8} borderRadius="md" borderWidth={1} ref={forwardRef}>
//       <Heading as="h2" size="lg" textAlign="center" mb={6}>
//         Developer Registration
//       </Heading>
//       <Text fontSize="md" textAlign="center" mb={6}>
//         Join ContractCanvas as a developer and collaborate on projects with people you trust, while protecting your intellectual property.
//       </Text>
//       <form onSubmit={handleSubmit}>
//         <VStack spacing={4}>
//           {renderStepContent()}
//           {step > 0 && <Button variant='ghost' onClick={prevStep}>Previous</Button>}
//           {step < 4 ? (
//             <Button variant='ghost' onClick={nextStep}>Next</Button>
//           ) : (
//             <Button type="submit">Submit</Button>
//           )}
//         </VStack>
//       </form>
//     </Box>
//   );
// };

// export default DeveloperRegistrationForm;

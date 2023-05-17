import ReactMarkdown from 'react-markdown';
import { Box, Center, Container, Text, VStack } from '@chakra-ui/react'

const mermaidCode = `![](https://mermaid.ink/img/pako:eNqlVduO2jAQ_ZVRHlZdLUTcsq14WGmBtg-tKrRoW2mFVLnOEKwmdmo7bOlq_73jXCAkoTyUh5GxT2bOmYv94nEVojf1DP7KUHJcCBZplqwl0C9l2gouUiYtPBrU3--BGZjHAqU9g5jlCCWtZtwqvZYFTiO3oKMfb0bjQQ9GI2eCwXVxWLju393dFC6m8ODYGAsMaGMnOEKBRBkWi8JKZRG0iLYW1KZ0M4WVJVLwBSNlBbNCtSgEgaPwzpnguuZJ7VCXXnpQURn6sNBsY-EK3v_mWyYjhKVWamMa5KvwBbpKQReIvH5EiZpRTCZD0kjm6dOy7nFWA39FLTb7dtRZvxaWTlNlEOY5RVPLV6f8sTODy_JHfjuTsVJpe7dT50IYnhlzyqotkvjfRxqJg3afMLduVLxTSkcztaRUVMZ-ESM5NG-L7QchWSz-YFf1Zqe53okQYSUiyWym8V_tWPmqvNdS1mjng67h2zFJGt66Og0ulmjiO0IkjfJ8BY9pSH1lziicayy6DtBwrZ6Bca4y2RTabypNREzzqCRCVvffVZRhMHL1GPaAVhfJBz58U_onZSlJY3SpIQ15wwtey1RrJko8wjN93cDcHG6CcrBcORwO-CHKmeEtR-3o9P8n6NZ3LZ1mdP6ARsVZLvIzzVBtmtqI1lCdTlWOPtI8eyfk1eOtO6Ehrbtz84aFJdurzDaLPJm4FNAdSqvmNd4_mSd6I44OKKbX8xLUCRMhPTsvbnvt2S2N5dqb0jJkpMlby1fCscyq1V5yb7phscGeVzRf-UYddun1eVKK_lud4etfRnwprw?type=png)`;

const About = () => {
  return (
    <Container maxW="container.xl">
      <Box as="section" pt={10} pb={32}>
        <VStack
          alignItems="center"
          justifyContent="center"
          spacing={4}
          mt={16}
        >
          <Text fontSize="2xl" color="brand.delft-blue" fontWeight="bold">
            Secure your projects with Zero-Knowledge Proofs
          </Text>
          <Text fontSize="lg" textAlign="center">
            ContractCanvas leverages Zero-Knowledge Proofs to create a trustless system
            that enables you to collaborate with confidence, ensuring your sensitive
            information remains secure.
          </Text>
          <Center>
            <VStack>
              <Text fontSize="xl" color="brand.delft-blue" fontWeight="bold">How it works:</Text>
              <ReactMarkdown>{mermaidCode}</ReactMarkdown>
            </VStack>
          </Center>
        </VStack>
      </Box>
    </Container>
  )
}

export default About;
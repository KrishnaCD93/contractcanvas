// /lib/MatchUsers.tsx
/* This page will receive developer_id and an array of client projects.
  Then a match function will be used to create a rating for how well they'd match up to a job.
  The match function will perform the following steps:
  - Perform feature engineering to clean up developer data which includes a resume, an array of portfolio items, and a developer skills, exclusions, availability, and rate.
  - Create an embedding of developer data
  - Create an embedding of client project data
  - Create a similarity score between the two embeddings
  - Return the similarity score
  Other potential features to add:
  - ELO rating
  - TrueSkill rating */

import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '../../types_db';
import { OpenAIApi, Configuration } from 'openai';
import { inspect } from 'util';
import type { GetServerSideProps } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  developer_id: string;
  portfolio_id: string;
}

interface PortfolioItem extends Profile {
  id: string;
  title: string;
  link: string;
  protected_ip: boolean;
}

interface Developer extends PortfolioItem {
  resume: Blob;
  id: string;
  user_id: string;
  rate: number;
  resumeUrl: string;
  availability: string;
  skills: string[];
  exclusions: string;
  portfolioItems: PortfolioItem[];
  profile: Profile; 
}

interface Resume {
  resume: Blob;
}

interface ClientProject {
  id: string;
  user_id: string;
  scope: string;
  milestones: string[];
  cost: number;
  terms_and_conditions: string;
  specific_requests: string;
  protected_ip: boolean;
}

type Props = {
  developer: Developer;
}

const MatchUsers = async ({ developer }: Props, client: any) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const user = useUser();

  async function readPDFContent(resumeBlob: Blob): Promise<string> {
    const arrayBuffer = await resumeBlob.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
    let content = '';
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      content += textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
  }
  
    return content;
  }

  async function readDocxContent(resumeBlob: Blob): Promise<string> {
    const arrayBuffer = await resumeBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
  
    return result.value;
  }
  
    async function crawlPortfolio(portfolioItems: PortfolioItem[]): Promise<string> {
      // Implementation for reading resume and crawling portfolio website
      // Crawl portfolio websites
      if (!portfolioItems) return '';
      const portfolioItemsData = await Promise.all(
        portfolioItems.map(async (item: any) => {
          // Fetch the content of the portfolio item's link
          const itemResponse = await fetch(item.link);
          if (itemResponse.ok) {
            const html = await itemResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
    
            // Extract relevant information from the crawled website
            const pageTitle = doc.querySelector('title')?.innerText;
            const pageDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
            const pageKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content');
    
            return `${pageTitle} ${pageDescription} ${pageKeywords}`;
          } else {
            console.error('Error fetching portfolio item link:', itemResponse.status, itemResponse.statusText);
            return '';
          }
        })
      );
    
    const itemsAsString = portfolioItemsData.join(' ');
  
    return itemsAsString;
  }

  // crawl portfolio
  async function callCrawlPortfolio(portfolioItems: PortfolioItem[]) {
    const portfolioItemsData = await crawlPortfolio(portfolioItems);
    return portfolioItemsData;
  }
  
  async function cleanData(content: string): Promise<string> {
    // Implementatfeature engineering techniques to clean up developer data (resume, portfolio) and client requests (projects)
    const input = content.replace(/\n/g, ' ');
    const cleanedInput = input.replace(/[^a-zA-Z0-9 ]/g, '');
    
    return cleanedInput || '';
  }
  
  async function generateEmbeddings(input: string): Promise<any[]> {
    // Implementation for generating OpenAI embeddings for resume, portfolio, and projects=
    let embeddings;
    try {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_KEY,
      })
      const openai = new OpenAIApi(configuration)

      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input,
      })

      embeddings = embeddingResponse.data?.data;

    } catch (error: any) {
      console.error('Error generating embeddings:', error.message);
    }

    return embeddings || [];
  }

  function cosineSimilarity(a: any[], b: any[]) {
    const dotProduct = a.reduce((sum, aVal, idx) => sum + aVal * b[idx], 0);
    const aMagnitude = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
    const bMagnitude = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
  
    return dotProduct / (aMagnitude * bMagnitude);
  }
  
  async function calculateSimilarity(devEmbeddings: any[], clientEmbeddings: any[]): Promise<number> {
    // Calculate similarity score between developer and client using cosine similarity
    if (devEmbeddings.length === 0 || clientEmbeddings.length === 0) {
      console.error('Error calculating similarity score: Empty embeddings');
      return 0;
    }
  
    const similarityScore = cosineSimilarity(devEmbeddings, clientEmbeddings);
  
    return similarityScore;
  }
  
  async function createZKPCircuit() {
    // Implementation for creating ZKP circuit to match the two databases securely
  }
  
  async function sendZKPKeysAndEmail() {
    // Implementation for sending ZKP keys and client email to the developer
  }
  
  const handleMatch = async () => {
    // Implementation for handling the match process
    // Read resume content
    async function readResumeContent(resumeBlob: Blob,): Promise<string> {
      const fileType = resumeBlob.type.split('/')[1];
      if (fileType === 'pdf') {
        const pdfContent = await readPDFContent(resumeBlob);
        return pdfContent;
      } else if (fileType === 'docx') {
        const docxContent = await readDocxContent(resumeBlob);
        return docxContent;
      } else {
        throw new Error('Unsupported file type');
      }
    }

    const resumeString = await readResumeContent(developer.resume);
    const portfolioString = await callCrawlPortfolio(developer.portfolioItems);
    const cleanedDevString = await cleanData(`${resumeString} ${portfolioString}`);
    const devEmbeddings = await generateEmbeddings(cleanedDevString);
    const clientEmbeddings = await generateEmbeddings(client.toSting());
    const similarityScore = await calculateSimilarity(devEmbeddings, clientEmbeddings);
  }
  await handleMatch();
}

export default MatchUsers;

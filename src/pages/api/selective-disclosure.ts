// pages/api/selective-disclosure.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
const snarkjs = require("snarkjs");

const verificationKeyPath = path.join(process.cwd(), '/zkp/SelectiveDisclosure/verification_key.json');
const wasmFile = path.join(process.cwd(), '/zkp/SelectiveDisclosure/SelectiveDisclosure_js/SelectiveDisclosure.wasm');
const zkeyFile = path.join(process.cwd(), '/zkp/SelectiveDisclosure/SelectiveDisclosure_0001.zkey');

// Helper function to convert a string to a number using ASCII codes
const stringToNumber = (str: any) => {
  if(str === undefined) {
    throw new Error(`Input ${str} is undefined`);
  }

  let num = '';
  for(let i = 0; i < str.length; i++) {
    // Convert each character to its ASCII value and pad it to ensure it has three digits
    num += str.charCodeAt(i).toString().padStart(3, '0');
  }
  
  // Convert the resulting string to a BigInt
  return BigInt(num);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end(
    `Method ${req.method} Not Allowed`
  );
  try {
    // Retrieve input values from the request
    console.log(req.body);
    const {
      values: {
        rate,
        rateDisclosed,
        availability,
        availabilityDisclosed,
        skills,
        skillsDisclosed,
        resumeFileName,
        resumeFileNameDisclosed,
        exclusions,
        exclusionsDisclosed
      }
    } = req.body;    

    // Convert string inputs to numbers
    let availabilityNum;
    if (availability === '') {
      availabilityNum = 0;
    } else if (availability) {
      availabilityNum = stringToNumber(availability);
    }
    let skillsNum;
    if (skills === '') {
      skillsNum = 0;
    } else if (skills) {
      skillsNum = stringToNumber(skills);
    }
    let resumeFileNameNum;
    if (resumeFileName === '') {
      resumeFileNameNum = 0;
    } else if (resumeFileName) {
      resumeFileNameNum = stringToNumber(resumeFileName);
    }
    let exclusionsNum;
    if (exclusions === '') {
      exclusionsNum = 0;
    } else if (exclusions) {
      exclusionsNum = stringToNumber(exclusions);
    }

    console.log({
      rate,
      rateDisclosed: rateDisclosed === true ? 1 : 0,
      availability: availabilityNum,
      availabilityDisclosed: availabilityDisclosed === true ? 1 : 0,
      skills: skillsNum,
      skillsDisclosed: skillsDisclosed === true ? 1 : 0,
      resumeFileName: resumeFileNameNum,
      resumeFileNameDisclosed: resumeFileNameDisclosed === true ? 1 : 0,
      exclusions: exclusionsNum,
      exclusionsDisclosed: exclusionsDisclosed === true ? 1 : 0
    })

    // Run proof generation and verification
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({
      rate,
      rateDisclosed: rateDisclosed === true ? 1 : 0,
      availability: availabilityNum,
      availabilityDisclosed: availabilityDisclosed === true ? 1 : 0,
      skills: skillsNum,
      skillsDisclosed: skillsDisclosed === true ? 1 : 0,
      resumeFileName: resumeFileNameNum,
      resumeFileNameDisclosed: resumeFileNameDisclosed === true ? 1 : 0,
      exclusions: exclusionsNum,
      exclusionsDisclosed: exclusionsDisclosed === true ? 1 : 0
    }, wasmFile, zkeyFile);

    const vkey = JSON.parse(fs.readFileSync(verificationKeyPath, 'utf8'));
    const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);

    // Return the proof, publicSignals, and isValid in the API response
    res.status(200).json({ proof, publicSignals, isValid });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export default handler;

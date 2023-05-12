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
  let num = 0;
  for(let i = 0; i < str.length; i++) {
    num += str.charCodeAt(i);
  }
  return num;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Retrieve input values from the request
    const {
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
    } = req.body;

    // Convert string inputs to numbers
    const availabilityNum = stringToNumber(availability);
    const skillsNum = stringToNumber(skills);
    const resumeFileNameNum = stringToNumber(resumeFileName);
    const exclusionsNum = stringToNumber(exclusions);

    // Run proof generation and verification
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({
      rate,
      rateDisclosed,
      availability: availabilityNum,
      availabilityDisclosed,
      skills: skillsNum,
      skillsDisclosed,
      resumeFileName: resumeFileNameNum,
      resumeFileNameDisclosed,
      exclusions: exclusionsNum,
      exclusionsDisclosed
    }, wasmFile, zkeyFile);

    const vkey = JSON.parse(fs.readFileSync(verificationKeyPath, 'utf8'));
    const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);

    // Return the proof, publicSignals, and isValid in the API response
    res.status(200).json({ proof, publicSignals, isValid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export default handler;

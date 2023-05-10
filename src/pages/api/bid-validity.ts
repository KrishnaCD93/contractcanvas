// pages/api/bid-validity.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
const snarkjs = require("snarkjs");

const verificationKeyPath = path.join(process.cwd(), '/zkp/BidValidity/verification_key.json');
const wasmFile = path.join(process.cwd(), '/zkp/BidValidity/BidValidity_js/BidValidity.wasm');
const zkeyFile = path.join(process.cwd(), '/zkp/BidValidity/BidValidity_0001.zkey');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Retrieve input values from the request
    const { maxBudget, acceptedPrice } = req.body;

    // Run proof generation and verification, similar to the original example
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({ maxBudget, acceptedPrice }, wasmFile, zkeyFile);
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

import express from "express";

import { Connection } from "@solana/web3.js";
import { HyperspaceClient } from "hyperspace-client-js";

export const APP = express();
export const PORT = process.env.PORT || 3333;

export const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
export const CONNECTION = new Connection(SOLANA_RPC_URL);

import dotenv from "dotenv";
dotenv.config();

// Internal Solana Pay constants
export const SOLANA_PAY_LABEL = "Solana Labs ChatGPT Plugin";
export const TRANSACTION_ENDPOINTS = [
  "createBuyNFT",
  "createWriteNFTMetadata",
  "createCloseNFTMetadata",
];
export type TransactionEndpoints = (typeof TRANSACTION_ENDPOINTS)[number];
export const TX_DESCRIPTIONS: Record<TransactionEndpoints, string> = {
  createBuyNFT: "Sign to Buy NFT",
  createWriteNFTMetadata: "Sign to Write NFT Metadata",
  createCloseNFTMetadata: "Sign to Close NFT Metadata",
  createTransferToken: "Sign to Transfer Token",
  createTransferSol: "Sign to Transfer Sol",
};

// Inferred Constants
export let HELIUS_URL: string;
export let SELF_URL: string;
export let HYPERSPACE_CLIENT: HyperspaceClient;

export default function index() {
  HELIUS_URL = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
  if (process.env.DEV === "true") {
    SELF_URL = `http://localhost:${PORT}`;
  } else {
    SELF_URL = "https://chatgpt.solanalabs.com";
    // SELF_URL = "https://1f1c-66-65-157-10.ngrok-free.app";
    // SELF_URL = "https://d4d7-74-108-48-114.ngrok-free.app";
  }

  HYPERSPACE_CLIENT = new HyperspaceClient(
    process.env.HYPERSPACE_API_KEY as string
  );
}

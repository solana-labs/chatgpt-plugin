import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();

import { getTransaction } from "./handlers/getTransaction";

import configConstants, { APP, PORT, TX_DESCRIPTIONS } from "./constants";
configConstants();

import { getSignaturesForAddress } from "./handlers/getSignaturesForAddress";
import { getAccountInfo } from "./handlers/getAccountInfo";
import { getBalance } from "./handlers/getBalance";
import { getAssetsByOwner } from "./handlers/getAssetsByOwner";
import { getListedCollectionNFTs } from "./handlers/getListedCollectionNFTs";
import { getCollectionsByFloorPrice } from "./handlers/getCollectionsByFloorPrice";
import { makeRedirectToLinkPreview } from "./handlers/solana-pay/redirectToLinkPreview";
import { makeQrcodeLinkPreview } from "./handlers/solana-pay/qrcodeLinkPreview";
import { makeCreateQrCode } from "./handlers/solana-pay/createQrCode";
import {
  respondToSolanaPayGet,
  makeRespondToSolanaPayPost,
} from "./handlers/solana-pay/tx-request-server";
import { getTokenAccounts } from "./handlers/getTokenAccounts";

APP.use(bodyParser.json());
APP.use(
  cors({
    origin: "*",
  })
);

if (process.env.DEV === "true") {
  APP.use("/.well-known", express.static("./.well-known-dev"));
} else {
  APP.use("/.well-known", express.static("./.well-known"));
}

function errorHandle(
  handler: (
    req: Request,
    res: Response<any, Record<string, any>>
  ) => Promise<void>
) {
  return (req: Request, res: Response<any, Record<string, any>>) => {
    handler(req, res).catch((error) => {
      console.error(error);

      // Prevent ChatGPT from getting access to error messages until we have better error handling
      res.status(500).send({ message: "An error occurred" });
    });
  };
}

// Solana RPC
APP.post("/getBalance", errorHandle(getBalance));
APP.post("/getAccountInfo", errorHandle(getAccountInfo));
APP.post("/getTransaction", errorHandle(getTransaction));
APP.post("/getTokenAccounts", errorHandle(getTokenAccounts));
APP.post("/getSignaturesForAddress", errorHandle(getSignaturesForAddress));

// Metaplex ReadAPI (using Helius)
APP.post("/getAssetsByOwner", errorHandle(getAssetsByOwner));

// NFT Listings (using Hyperspace)
APP.post("/getListedCollectionNFTs", errorHandle(getListedCollectionNFTs));
APP.post(
  "/getCollectionsByFloorPrice",
  errorHandle(getCollectionsByFloorPrice)
);

// Write API
// -> Shows SolanaPay QR code in link previews
for (const methodName of Object.keys(TX_DESCRIPTIONS)) {
  // Create redirect to link preview
  // This is the only ChatGPT accessible endpoint per tx
  APP.post(
    `/${methodName}`,
    errorHandle(makeRedirectToLinkPreview(methodName))
  );

  // ==================================
  //        INTERNAL ENDPOINTS
  // ==================================

  // Creates an OpenGraph HTML page with a link to a QR code
  // so SolanaPay QR Codes can show up in ChatGPT's link previews
  APP.get(
    `/page/${methodName}`,
    errorHandle(makeQrcodeLinkPreview(methodName))
  );

  // Create QR code image
  APP.get(`/qr/${methodName}`, errorHandle(makeCreateQrCode(methodName)));

  // SolanaPay Transaction Request server impl
  APP.get(`/sign/${methodName}`, respondToSolanaPayGet);
  APP.post(
    `/sign/${methodName}`,
    errorHandle(makeRespondToSolanaPayPost(methodName))
  );
}

APP.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

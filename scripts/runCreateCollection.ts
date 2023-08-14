import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
import { uploadMetadata } from "./uploadMetadata";
dotenv.config();

(async () => {
  console.log("process.env.HELIUS_API_KEY: ", process.env.HELIUS_API_KEY);

  const HELIUS_URL = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
  //   // const HELIUS_URL = `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  const CONNECTION = new Connection(HELIUS_URL);
  const payer = Keypair.fromSecretKey(
    Uint8Array.from(
      Buffer.from(process.env.COLLECTION_OWNER_SECRET_KEY as string, "base64")
    )
  );
  console.log("collection owner(payer): ", payer.publicKey.toBase58());

  const balance = await CONNECTION.getBalance(payer.publicKey);
  console.log("balance: ", balance);

  const metaplex = Metaplex.make(CONNECTION)
    .use(keypairIdentity(payer))
    .use(
      bundlrStorage({
        address: "https://node1.bundlr.network",
        providerUrl: HELIUS_URL,
        timeout: 60000,
      })
    );

  //STEP 1: create a collection on mainnet/devnet
  // await createNFTCollection(payer, metaplex);

  //STEP 2: create a nft on mainnet/devnet
  // following code is to create a sample metadata to be supplied to the chatbot, sample creating nft #1 for the collection
  const uri = uploadMetadata(metaplex, 4);

  // following is the code to create a tree on the devnet, on mainnet you have to use already created trees with empty leaves
  //   await createTree(payer, metaplex.connection, 1, 2, {
  //     maxDepth: 5,
  //     maxBufferSize: 8,
  //   });
})();

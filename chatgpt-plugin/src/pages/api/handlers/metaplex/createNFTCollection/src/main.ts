import { Keypair, PublicKey } from "@solana/web3.js";
import { loadNonceFromFile, loadPublicKeysFromFile } from "../utils/helper";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import { createNFTCollection } from "./src/createNFTCollection";
import {CONNECTION } from "../../../constants";
// import { createTree } from "./createTree";
// import { mintNft } from "./mintNft";
// import { mintCompressedNft } from "./mintCompressedNft";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY ?? "[]"))
  );
  console.log("payer: ", payer.publicKey.toBase58());

//   const CONNECTION = new Connection(process.env.RPC_URL ?? "", "confirmed");
  const balance = await CONNECTION.getBalance(payer.publicKey);
  console.log("balance: ", balance);

  const metaplex = Metaplex.make(CONNECTION)
    .use(keypairIdentity(payer))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  let keys = loadPublicKeysFromFile();
  if (
    !keys?.collectionMint ||
    !keys?.collectionMetadataAccount ||
    !keys?.collectionMasterEditionAccount
  ) {
    await createNFTCollection(payer, metaplex);
  }

//   if (!keys?.treeAddress1 || !keys?.treeAuthority1) {
//     await createTree(payer, CONNECTION, 1, 2, {
//       maxDepth: 5,
//       maxBufferSize: 8,
//     });
//   }

//   if (!keys?.treeAddress2 || !keys?.treeAuthority2) {
//     await createTree(payer, CONNECTION, 2, 8, {
//       maxDepth: 14,
//       maxBufferSize: 64,
//     });
//   }

//   keys = loadPublicKeysFromFile();
//   const treeAddress1: PublicKey = keys.treeAddress1;
//   const treeAuthority1: PublicKey = keys.treeAuthority1;
//   const treeAddress2: PublicKey = keys.treeAddress2;
//   const treeAuthority2: PublicKey = keys.treeAuthority2;
//   const collectionMint: PublicKey = keys.collectionMint;
//   const collectionMetadataAccount: PublicKey = keys.collectionMetadataAccount;
//   const collectionMasterEditionAccount: PublicKey =
//     keys.collectionMasterEditionAccount;

//   await mintNft(payer, metaplex, collectionMint, 6);
//   await mintNft(payer, metaplex, collectionMint, 7);
//   await mintCompressedNft(
//     payer,
//     CONNECTION,
//     treeAddress1,
//     treeAuthority1,
//     collectionMint,
//     collectionMetadataAccount,
//     collectionMasterEditionAccount,
//     11
//   );
//   await mintCompressedNft(
//     payer,
//     CONNECTION,
//     treeAddress1,
//     treeAuthority1,
//     collectionMint,
//     collectionMetadataAccount,
//     collectionMasterEditionAccount,
//     9
//   );
//   await mintCompressedNft(
//     payer,
//     CONNECTION,
//     treeAddress2,
//     treeAuthority2,
//     collectionMint,
//     collectionMetadataAccount,
//     collectionMasterEditionAccount,
//     10
//   );
})();
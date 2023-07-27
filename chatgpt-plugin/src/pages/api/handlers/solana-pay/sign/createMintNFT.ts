import { NextApiRequest } from "next";
import {
    PublicKey,
    Transaction
  } from "@solana/web3.js";
import { CONNECTION } from "../../../constants";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";

import { Metaplex } from "@metaplex-foundation/js";

async function createMintNFT(req: NextApiRequest) { 
    // check if you even have to do this, 
    // if (req.method !== 'POST') {
    //     return res.status(405).json({ error: 'Method not allowed, use POST' });
    //   }
    const { name, account: sender, metadataUri, sellerFee } = req.body;
    const metaplex = Metaplex.make(CONNECTION);
    // use metaplex.identity() to see what's the real identity here

    // todo: decide and add the other params once basic one is tested
    const mintTransactionBuilder = await metaplex
    .nfts()
    .builders()
    .create({
      name: name,
      uri: metadataUri,
      sellerFeeBasisPoints: sellerFee, // 2.5%
    });
    const tx = new Transaction();
    const latestBlockhashWithExpiryBlockHeight = await CONNECTION.getLatestBlockhash();
    tx.add(
      mintTransactionBuilder.toTransaction(latestBlockhashWithExpiryBlockHeight),
    );
    tx.feePayer = new PublicKey(sender);

    return {
        transaction: tx
          .serialize({ requireAllSignatures: true })
          .toString("base64"),
      };
}
export default makeRespondToSolanaPayGet(
  makeRespondToSolanaPayPost(createMintNFT)
);


// TODO: older code for reference - to be deleted before merge
// await mintNFT(connection, mint, metadata, payerPublicKey, instructions, signers);

    //todo: get wallet from the phantom call

    // const mintNFTResponse = await metaplex.nfts().create({
    //     uri: metadataUri,
    //     name: name,
    //   });

    // will add the other params once basic one is tested
    // const mintNFTResponse = await metaplex.nfts().create({
    //     uri: metadataUri,
    //     name: name,
    //     sellerFeeBasisPoints: sellerFee,
    //     symbol: symbol,
    //     creators: creators,
    //     isMutable: false,
    // });

    // console.log(`   Success!🎉`);
    // console.log(`   Minted NFT: https://explorer.solana.com/address/${mintNFTResponse.nft.address}?cluster=devnet`);
/* code to directly mint nfts it will create and sent the transaction as well*/
// const { nft } = await metaplex
    // .nfts()
    // .create({
    //     uri: metadataUri,
    //     name: 'My on-chain NFT',
    //     sellerFeeBasisPoints: 250, // 2.5%
    // });



// const mint = await metaplex.fts().mintFT({
//     connection,
//     wallet,
//     uri: arweaveMetadata.url, 
//     maxSupply: 1
// });


//TODO: export default something something


//TODOS:
// 1. see if you wanna split the params in the requeest in to different interfaces
import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import { walletNameToAddressAndProfilePicture } from "@portal-payments/solana-wallet-names";
import { walletAddressToNameAndProfilePictureCustom } from "@/lib/address";
import configConstants, { CONNECTION } from "../../constants";
configConstants();
import { makeApiPostRequest } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletName } = req.body;
  try {
    const dotAnything = await walletAddressToNameAndProfilePictureCustom(
      CONNECTION,
      new PublicKey(walletName),
    );
    res.status(200).send(dotAnything);
  } catch (error) {
    const walletInfo = await walletNameToAddressAndProfilePicture(CONNECTION, walletName);
    res.status(200).send(walletInfo);
  }
}

export default makeApiPostRequest(handler);

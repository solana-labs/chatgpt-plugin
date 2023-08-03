import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey, Connection } from "@solana/web3.js";
import {
  walletNameToAddressAndProfilePicture,
  walletAddressToDotAnything,
  getProfilePictureUsingSolanaPFPStandard,
  walletAddressToDotGlow,
  walletAddressToDotBackpack,
} from "@portal-payments/solana-wallet-names";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

interface WalletNames {
  walletNames: string[];
}

const walletAddressToDotSolCustom = async (
  connection: Connection,
  wallet: PublicKey,
): Promise<WalletNames> => {
  try {
    const result = await fetch(
      // See https://github.com/Bonfida/sns-sdk#sdk-proxy
      // There's a 'favorite-domain' endpoint butmost SNS users haven't set up a
      // favorite domain, as the UI to do so is complex
      // `https://sns-sdk-proxy.bonfida.workers.dev/favorite-domain/${wallet.toBase58()}`
      `https://sns-sdk-proxy.bonfida.workers.dev/domains/${wallet.toBase58()}`,
      {
        method: "GET",
      },
    );

    const body = await result.json();
    let walletNames: string[] = body.result.map((info: any) => `${info.domain}.sol`);
    return {
      walletNames,
    };
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message === "Invalid wallet account provided") {
      return {
        walletNames: [],
      };
    }
    throw error;
  }
};

const walletAddressToNameAndProfilePictureCustom = async (
  connection: Connection,
  wallet: PublicKey,
  backpackJWT: string | null = null,
): Promise<WalletNames> => {
  let walletNames: string[] = [];
  const dotAnything = await walletAddressToDotAnything(connection, wallet);
  if (dotAnything.walletName) {
    walletNames.push(dotAnything.walletName);
  }

  const dotSol = await walletAddressToDotSolCustom(connection, wallet);
  walletNames = walletNames.concat(dotSol.walletNames);

  const dotGlow = await walletAddressToDotGlow(wallet);
  if (dotGlow?.walletName && dotGlow.walletName !== "null.glow") {
    walletNames.push(dotGlow.walletName);
  }

  if (backpackJWT) {
    const dotBackpack = await walletAddressToDotBackpack(wallet, backpackJWT);
    if (dotBackpack?.walletName) {
      walletNames.push(dotBackpack.walletName);
    }
  }

  return {
    walletNames,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

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

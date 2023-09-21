import {
  walletAddressToDotAnything,
  walletAddressToDotGlow,
  walletAddressToDotBackpack,
  walletNameToAddressAndProfilePicture,
} from "@portal-payments/solana-wallet-names";
import { Connection, PublicKey } from "@solana/web3.js";
import { Client } from "@solflare-wallet/utl-sdk";
import configConstants, { CONNECTION } from "../pages/api/constants";
configConstants();

export interface WalletNames {
  walletNames: string[];
}

export const walletAddressToDotSolCustom = async (
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

export const walletAddressToNameAndProfilePictureCustom = async (
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

export async function resolveAddress(address: string): Promise<PublicKey> {
  if (!address) {
    throw new Error(`No address provided for: ${address}`);
  }

  if (address.search(/\./g) !== -1) {
    let info: { walletAddress: string | null };
    try {
      info = await walletNameToAddressAndProfilePicture(CONNECTION, address);
    } catch (e) {
      throw new Error(`Wallet name ${address} does not exist or cannot be resolved.`);
    }

    if (info.walletAddress === null) {
      throw new Error(`Wallet name does not exist: ${address}`);
    }
    return new PublicKey(info.walletAddress);
  }

  try {
    return new PublicKey(address);
  } catch (_e) {
    throw new Error(`Provided address is invalid base58 Solana address: ${address}`);
  }
}

export async function resolveToken(tokenName: string): Promise<PublicKey> {
  if (!tokenName) {
    throw new Error(`No token name provided for: ${tokenName}`);
  }

  const utl = new Client();
  try {
    let results = (await utl.searchMints(tokenName))
      .filter((res: any) => {
        return res["verified"] && res["holders"] > 0 && res["chainId"] === 101;
      })
      .map((res: any) => {
        return {
          mintAddress: res["address"],
          tokenName: res["name"],
          tokenSymbol: res["symbol"],
          holders: res["holders"],
          verified: res["verified"],
          chainId: res["chainId"],
          logoURI: res["logoURI"],
        };
      });
    return new PublicKey(results[0].mintAddress);
  } catch (_e) {
    throw new Error(
      `Provided token address does not have any relevant token addresses: ${tokenName}`,
    );
  }
}

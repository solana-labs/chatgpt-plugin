import fs from "fs";
import path from "path";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

// define some default locations
const DEFAULT_KEY_DIR_NAME = ".local_keys";
const DEFAULT_PUBLIC_KEY_FILE = "keys.json";
const DEFAULT_NONCE_FILE = "nonce.json";

/*
  Load locally stored PublicKey addresses
*/
export function loadPublicKeysFromFile(
  absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_PUBLIC_KEY_FILE}`
) {
  try {
    if (!absPath) throw Error("No path provided");
    if (!fs.existsSync(absPath)) throw Error("File does not exist.");

    // load the public keys from the file
    const data =
      JSON.parse(fs.readFileSync(absPath, { encoding: "utf-8" })) || {};

    // convert all loaded keyed values into valid public keys
    for (const [key, value] of Object.entries(data)) {
      data[key] = new PublicKey(value as string) ?? "";
    }

    return data;
  } catch (err) {
    // console.warn("Unable to load local file");
  }
  // always return an object
  return {};
}

/*
  Locally save a PublicKey addresses to the filesystem for later retrieval
*/
export function savePublicKeyToFile(
  name: string,
  publicKey: PublicKey,
  absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_PUBLIC_KEY_FILE}`
) {
  try {
    // if (!absPath) throw Error("No path provided");
    // if (!fs.existsSync(absPath)) throw Error("File does not exist.");

    // fetch all the current values
    let data: any = loadPublicKeysFromFile(absPath);

    // convert all loaded keyed values from PublicKeys to strings
    for (const [key, value] of Object.entries(data)) {
      data[key as any] = (value as PublicKey).toBase58();
    }
    data = { ...data, [name]: publicKey.toBase58() };

    // actually save the data to the file
    fs.writeFileSync(absPath, JSON.stringify(data), {
      encoding: "utf-8",
    });
    console.log("Saved to file: ", absPath);

    // reload the keys for sanity
    data = loadPublicKeysFromFile(absPath);

    return data;
  } catch (err) {
    console.warn("Unable to save to file");
  }
  // always return an object
  return {};
}

/*
  Load locally stored nonce of nft counr
*/
export function loadNonceFromFile(
  absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_NONCE_FILE}`
) {
  try {
    if (!absPath) throw Error("No path provided");
    if (!fs.existsSync(absPath)) throw Error("File does not exist.");

    // load the public keys from the file
    const data =
      JSON.parse(fs.readFileSync(absPath, { encoding: "utf-8" })) || {};

    // convert all loaded keyed values into valid public keys
    for (const [key, value] of Object.entries(data)) {
      data[key] = value as number;
    }

    return data;
  } catch (err) {
    // console.warn("Unable to load local file");
  }
  // always return an object
  return {};
}

/*
  Locally save a PublicKey addresses to the filesystem for later retrieval
*/
export function saveNonceToFile(
  nonce: number,
  absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_NONCE_FILE}`
) {
  try {
    // if (!absPath) throw Error("No path provided");
    // if (!fs.existsSync(absPath)) throw Error("File does not exist.");

    // fetch all the current values
    let data: any = loadNonceFromFile(absPath);

    // convert all loaded keyed values from PublicKeys to strings
    for (const [key, value] of Object.entries(data)) {
      data[key as any] = value as number;
    }
    data = { nonce };

    // actually save the data to the file
    fs.writeFileSync(absPath, JSON.stringify(data), {
      encoding: "utf-8",
    });

    // reload the keys for sanity
    data = loadPublicKeysFromFile(absPath);

    return data;
  } catch (err) {
    console.warn("Unable to save to file");
  }
  // always return an object
  return {};
}
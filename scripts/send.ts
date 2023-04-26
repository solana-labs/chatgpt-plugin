import { Connection, Transaction, Keypair, Signer } from "@solana/web3.js";
import { readFileSync } from "fs";

// Create a connection to the Solana network
const connection = new Connection("https://api.mainnet-beta.solana.com");

// Define the types of the objects returned by the `parse()` function
interface ParseResult {
  keypair: Keypair;
  base64Transaction: string;
}

// Parse the command line arguments to get the base64 transaction and keypair
function parse(): ParseResult {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== "--tx" || args[2] !== "--keypair") {
    console.error(
      "Usage: ts-node scripts/send.ts --tx <base64_transaction> --keypair <path_to_keypair>"
    );
    process.exit(1);
  }

  const base64Transaction = args[1];
  const keypairPath = args[3];

  const keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(readFileSync(keypairPath, "utf-8")))
  );

  return { keypair, base64Transaction };
}

// Simulate a transaction on the Solana network
async function simulate(
  base64Transaction: string,
  signers: Signer[]
): Promise<any> {
  const transaction = Transaction.from(
    Buffer.from(base64Transaction, "base64")
  );
  return await connection.simulateTransaction(transaction, signers);
}

// Main function to parse the command line arguments, simulate the transaction, and log the result
async function main() {
  const { keypair, base64Transaction } = parse();
  const simulationResult = await simulate(base64Transaction, [keypair]);
  console.log(simulationResult);
}

// Call the main function to start the program
main();

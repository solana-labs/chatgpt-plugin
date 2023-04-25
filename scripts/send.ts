import { Connection, Transaction, Keypair, Signer } from "@solana/web3.js";
import { readFileSync } from "fs";

const connection = new Connection("https://api.mainnet-beta.solana.com");
async function simulate(base64Transaction: string, signers: Signer[]) {
  const transaction = Transaction.from(
    Buffer.from(base64Transaction, "base64")
  );
  return await connection.simulateTransaction(transaction, signers);
}

function parse(): {
  keypair: Keypair;
  base64Transaction: string;
} {
  let args = process.argv.slice(2);
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

async function main() {
  let { keypair, base64Transaction } = parse();
  let simulationResult = await simulate(base64Transaction, [keypair]);
  console.log(simulationResult);
}

main();

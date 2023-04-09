import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  AnchorProvider,
  BN,
  BorshAccountsCoder,
  Program,
} from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const app = express();
const port = process.env.PORT || 3333;

const solanaRPCUrl = "https://api.mainnet-beta.solana.com";
const connection = new Connection(solanaRPCUrl);

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/.well-known", express.static("./.well-known"));

function replaceBNWithToString(obj: any): any {
  if (obj instanceof BN) {
    return obj.toString();
  } else if (obj instanceof PublicKey) {
    return obj.toString();
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      acc[key] = replaceBNWithToString(obj[key]);
      return acc;
    }, {});
  }

  return obj;
}

console.log(process.env.HELIUS_API_KEY);
const HELIUS_URL = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}}`;

const getAssetsByOwner = async (
  address: string,
  page: number = 1,
  limit: number = 5
) => {
  const sortBy = {
    sortBy: "created",
    sortDirection: "asc",
  };
  const before = "";
  const after = "";
  const { data } = await axios.post(HELIUS_URL, {
    jsonrpc: "2.0",
    id: "my-id",
    method: "getAssetsByOwner",
    params: [address, sortBy, limit, page, before, after],
  });
  return data.result;
};

app.post("/:methodName", async (req, res) => {
  console.log(req.params.methodName, req.body);
  try {
    if (req.params.methodName === "getAssetsByOwner") {
      const accountAddress = new PublicKey(req.body.address);
      const assets = await getAssetsByOwner(accountAddress.toString());
      res.status(200).send({ message: JSON.stringify(assets) });
    }
    if (req.params.methodName === "getAccountInfo") {
      const accountAddress = new PublicKey(req.body.address);
      const accountInfo = await connection.getAccountInfo(accountAddress);
      if (accountInfo?.owner && !accountInfo.executable) {
        try {
          const program = await Program.at(
            accountInfo.owner,
            new AnchorProvider(connection, new NodeWallet(Keypair.generate()), {
              commitment: "confirmed",
            })
          );

          const rawData = accountInfo.data;
          const coder = new BorshAccountsCoder(program.idl);
          const accountDefTmp = program.idl.accounts?.find((accountType: any) =>
            (rawData as Buffer)
              .slice(0, 8)
              .equals(BorshAccountsCoder.accountDiscriminator(accountType.name))
          );
          if (accountDefTmp) {
            const accountDef = accountDefTmp;
            try {
              const decodedAccountData = replaceBNWithToString(
                coder.decode(accountDef.name, rawData)
              );
              console.log(decodedAccountData);

              let payload = {
                ...accountInfo,
                extended: JSON.stringify(decodedAccountData),
              };
              res.status(200).send({ message: JSON.stringify(payload) });
              return;
            } catch (err) {
              console.log(err);
              res.status(500).send({ message: "An error occurred" });
              return;
            }
          }
        } catch (err) {
          res.status(200).send({ message: JSON.stringify(accountInfo) });
        }
      } else {
        res.status(200).send({ message: JSON.stringify(accountInfo) });
      }
    } else if (req.params.methodName === "getBalance") {
      const { address } = req.body;
      const balance = await connection.getBalance(new PublicKey(address));
      return res.status(200).send({ lamports: JSON.stringify(balance) });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export interface FlipsideTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    description: string;
  }[];
}

//
// From: https://flipsidecrypto.github.io/solana-models/#!/model/model.solana_models
// Last grabbed: May 30, 2023
//

const tablesCore: FlipsideTable[] = [
  {
    name: "solana.corefact_nft_mints",
    description:
      "An easy table containing information about Solana NFT mints including the purchaser, mint price, and NFT minted.",
    columns: [
      {
        name: "block_timestamp",
        type: "TIMESTAMP",
        description: "The date and time at which the block began.",
      },
      {
        name: "block_id",
        type: "NUMBER",
        description: "Slot for which a block can be created.",
      },
      {
        name: "tx_id",
        type: "TEXT",
        description: "A unique key that identifies a transaction.",
      },
      {
        name: "succeeded",
        type: "BOOLEAN",
        description: "True when a transaction is successful, otherwise false.",
      },
      {
        name: "program_id",
        type: "TEXT",
        description:
          "An address that identifies the program that is being interacted with. I.E. which DEX for a swap or marketplace for an NFT sale.",
      },
      {
        name: "purchaser",
        type: "TEXT",
        description: "The wallet address that purchased the NFT.",
      },
      {
        name: "mint_price",
        type: "FLOAT",
        description:
          "Price that it cost to mint the NFT in SOL or other currency.",
      },
      {
        name: "mint_currency",
        type: "TEXT",
        description: "Currency used to pay for the NFT mint.",
      },
      {
        name: "mint",
        type: "TEXT",
        description: "Unique address representing a specific token.",
      },
    ],
  },
  {
    name: "solana.core.fact_nft_sales",
    description:
      "NFT sales on Solana that occur on Magic Eden, Yawww, Opensea, the SMB marketplace, Solanart, Solport, Coral Cube, Hyperspace, Hadeswap and Exchange Art.",
    columns: [
      {
        name: "marketplace",
        type: "TEXT",
        description: "NFT Marketplace platform where transaction occured.",
      },
      {
        name: "block_timestamp",
        type: "TIMESTAMP",
        description: "The date and time at which the block began.",
      },
      {
        name: "block_id",
        type: "NUMBER",
        description: "Slot for which a block can be created.",
      },
      {
        name: "tx_id",
        type: "TEXT",
        description: "A unique key that identifies a transaction.",
      },
      {
        name: "succeeded",
        type: "BOOLEAN",
        description: "True when a transaction is successful, otherwise false.",
      },
      {
        name: "program_id",
        type: "TEXT",
        description:
          "An address that identifies the program that is being interacted with. I.E. which DEX for a swap or marketplace for an NFT sale.",
      },
      {
        name: "purchaser",
        type: "TEXT",
        description: "The wallet address that purchased the NFT.",
      },
      {
        name: "seller",
        type: "TEXT",
        description: "The wallet address that sold the NFT.",
      },
      {
        name: "mint",
        type: "TEXT",
        description: "Unique address representing a specific token.",
      },
      {
        name: "sales_amount",
        type: "TEXT",
        description: "The amount of Solana the NFT was purchased for.",
      },
    ],
  },
];

export default tablesCore;

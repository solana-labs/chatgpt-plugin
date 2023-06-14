import Link from "next/link";

export type Endpoint = {
  label: string;
  description: React.ReactNode;
};

export const features: Array<Endpoint> = [
  {
    label: "Fetch account balance",
    description: (
      <p>
        {`Example: "What is the balance of `}
        <i>MY-WALLET-ADDRESS</i>
        {` ?"`}
        <br /> <br />
        {`Returns the amount of Sol that the wallet address owns.`}
      </p>
    ),
  },
  {
    label: "Interpret Solana accounts",
    description: (
      <p>
        {`Example: "What data is in `}
        <i>ACCOUNT-ADDRESS</i>
        {` ?"`}
        <br /> <br />
        {`Returns data about the account, including the owner, the amount of Sol, and the potentially human-readable data stored in the account, if it's owner program has an Anchor IDL.`}
      </p>
    ),
  },
  {
    label: "Interpret Solana transactions",
    description: (
      <p>
        {`Example: "What happened in transaction `}
        <i>TRANSACTION-ID</i>
        {` ?"`}
        <br /> <br />
        {`Returns information about the transaction, and potentially human readable information about program instructions, if the programs have Anchor IDLs.`}
      </p>
    ),
  },
  {
    label: "Find NFTs for a wallet",
    description: (
      <p>
        {`Example: "What NFTs does `}
        <i>MY-WALLET-ADDRESS</i>
        {` own?"`}
        <br /> <br />
        {`The plugin can list your NFTs and their metadata. If you have a lot of NFTs, you can ask it to list all of your NFTs 5 at a time.`}
      </p>
    ),
  },
  {
    label: "Inspect wallet activity",
    description: (
      <p>
        {`Example: "What are the latest transactions for `}
        <i>WALLET-ADDRESS</i>
        {` ?"`}
        <br /> <br />
        {`The plugin can help you go through wallet transactions and explore on-chain activity.`}
      </p>
    ),
  },
  {
    label: "Search NFT collections by name or floor price",
    description: (
      <p>
        {`Example: "Can you find me the cheapest Mad Lads NFT for sale?"`}
        <br /> <br />
        {`NFTs are searched by name and sorted by floor price, you can ask the model to search explicitly by either target floor price name or by name.
        NFTs within a collection can also be sorted by floor price.`}
        <br />
        <br />
        <u>
          <b>Note:</b>
        </u>
        {` If you cannot find your NFT Collection, please see if it exists on `}
        <u>
          <Link href="https://hyperspace.xyz">hyperspace.xyz</Link>
        </u>
        {`. We
        use Hyperspace's API to support this plugin`}
      </p>
    ),
  },
  {
    label: "Buy an NFT (SolanaPay)",
    description: (
      <p>
        {`Example: "Can you help me transfer 1 EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v to `}
        <i>DESTINATION</i>
        {` ?"`}
        <br />
        <br />
        This will generate a QR code that you can scan from within your mobile wallet to send 1 USDC
        (mint address EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v) from your wallet to a
        destination wallet. See the{" "}
        <Link
          href={
            "https://github.com/solana-labs/chatgpt-plugin/blob/examples-langchain/DISCLAIMER.md"
          }
          className="legal"
        >
          Disclaimer
        </Link>
        {" and "}
        <Link href="https://solanapay.com/tos" className="legal">
          Terms of Service
        </Link>
        {"."}
      </p>
    ),
  },
  {
    label: "Transfer Sol (SolanaPay)",
    description: (
      <p>
        {`Example: "Can you help me transfer 1 SOL to `}
        <i>DESTINATION</i>
        {` ?"`}
        <br />
        <br />
        This will generate a QR code that you can scan from within your mobile wallet to send 1 Sol
        from your wallet to a destination wallet address. See the{" "}
        <Link
          href={
            "https://github.com/solana-labs/chatgpt-plugin/blob/examples-langchain/DISCLAIMER.md"
          }
          className="legal"
        >
          Disclaimer
        </Link>
        {" and "}
        <Link href="https://solanapay.com/tos" className="legal">
          Terms of Service
        </Link>
        {"."}
      </p>
    ),
  },
  {
    label: "Transfer a token (SolanaPay)",
    description: (
      <p>
        {`Example: "Can you help me transfer 1 EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v to `}
        <i>DESTINATION</i>
        {` ?"`}
        <br />
        <br />
        This will generate a QR code that you can scan from within your mobile wallet to send 1 USDC
        (mint address EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v) from your wallet to a
        destination wallet. See the{" "}
        <Link
          href={
            "https://github.com/solana-labs/chatgpt-plugin/blob/examples-langchain/DISCLAIMER.md"
          }
          className="legal"
        >
          Disclaimer
        </Link>
        {" and "}
        <Link href="https://solanapay.com/tos" className="legal">
          Terms of Service
        </Link>
        {"."}
      </p>
    ),
  },
];

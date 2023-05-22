export type Hyperspace = {
  version: "0.1.0";
  name: "hyperspace";
  instructions: [
    {
      name: "initProgramAsSigner";
      accounts: [
        {
          name: "wallet";
          isMut: true;
          isSigner: true;
        },
        {
          name: "programAsSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "programAsSignerBump";
          type: "u8";
        }
      ];
    },
    {
      name: "updateHyperspace";
      accounts: [
        {
          name: "payer";
          isMut: false;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "newAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "feeWithdrawalDestination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasuryWithdrawalDestination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasuryWithdrawalDestinationOwner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "sellerFeeBasisPoints";
          type: {
            option: "u16";
          };
        },
        {
          name: "requiresSignOff";
          type: {
            option: "bool";
          };
        },
        {
          name: "canChangeSalePrice";
          type: {
            option: "bool";
          };
        }
      ];
    },
    {
      name: "withdraw";
      accounts: [
        {
          name: "wallet";
          isMut: false;
          isSigner: false;
        },
        {
          name: "receiptAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowPaymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "escrowPaymentBump";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "deposit";
      accounts: [
        {
          name: "wallet";
          isMut: false;
          isSigner: true;
        },
        {
          name: "paymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "transferAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowPaymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspaceFeeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "escrowPaymentBump";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "permissionlessCancel";
      accounts: [
        {
          name: "wallet";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "seller";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programAsSigner";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "programAsSignerBump";
          type: "u8";
        },
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "tokenSize";
          type: "u64";
        }
      ];
    },
    {
      name: "collectionCancelBuy";
      accounts: [
        {
          name: "wallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "identifierPubkey";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionBuyerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programAsSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "buyerPrice";
          type: "u64";
        },
        {
          name: "programAsSignerBump";
          type: "u8";
        },
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "collectionTradeStateType";
          type: "u8";
        },
        {
          name: "identifierIndex";
          type: "u8";
        }
      ];
    },
    {
      name: "cancel";
      accounts: [
        {
          name: "wallet";
          isMut: true;
          isSigner: false;
          docs: ["CHECK OWNER OF TRADE_STATE TODO"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programAsSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "instructions";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenRecord";
          isMut: true;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "editionAccount";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "authorizationRules";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "mplTokenAuthRulesProgram";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        }
      ];
      args: [
        {
          name: "isBuy";
          type: "u8";
        },
        {
          name: "programAsSignerBump";
          type: "u8";
        },
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "tokenSize";
          type: "u64";
        }
      ];
    },
    {
      name: "collectionExecuteSale";
      accounts: [
        {
          name: "buyer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerBrokerWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "seller";
          isMut: true;
          isSigner: false;
        },
        {
          name: "sellerBrokerWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "editionData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowPaymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerReceiptTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspaceTreasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "identifierPubkey";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionBuyerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "sellerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mplTokenAuthRulesProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programAsSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "instructions";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ownerTokenRecord";
          isMut: true;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "destinationTokenRecord";
          isMut: true;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "authorizationRules";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        }
      ];
      args: [
        {
          name: "escrowPaymentBump";
          type: "u8";
        },
        {
          name: "programAsSignerBump";
          type: "u8";
        },
        {
          name: "buyerTradeStateBump";
          type: "u8";
        },
        {
          name: "sellerTradeStateBump";
          type: "u8";
        },
        {
          name: "maxAmountToPay";
          type: "u64";
        },
        {
          name: "buyerBrokerBasisPoints";
          type: "u16";
        },
        {
          name: "sellerBrokerBasisPoints";
          type: "u16";
        },
        {
          name: "tokenSize";
          type: "u64";
        },
        {
          name: "collectionTradeStateType";
          type: "u8";
        },
        {
          name: "identifierIndex";
          type: "u8";
        },
        {
          name: "royaltyBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "executeSale";
      accounts: [
        {
          name: "buyer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerBrokerWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "seller";
          isMut: true;
          isSigner: false;
        },
        {
          name: "sellerBrokerWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowPaymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerReceiptTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspaceTreasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "sellerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mplTokenAuthRulesProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programAsSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "instructions";
          isMut: false;
          isSigner: false;
        },
        {
          name: "editionAccount";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "ownerTokenRecord";
          isMut: true;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "destinationTokenRecord";
          isMut: true;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "authorizationRules";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        }
      ];
      args: [
        {
          name: "escrowPaymentBump";
          type: "u8";
        },
        {
          name: "programAsSignerBump";
          type: "u8";
        },
        {
          name: "buyerTradeStateBump";
          type: "u8";
        },
        {
          name: "sellerTradeStateBump";
          type: "u8";
        },
        {
          name: "maxAmountToPay";
          type: "u64";
        },
        {
          name: "buyerBrokerBasisPoints";
          type: "u16";
        },
        {
          name: "sellerBrokerBasisPoints";
          type: "u16";
        },
        {
          name: "tokenSize";
          type: "u64";
        },
        {
          name: "royaltyBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "sell";
      accounts: [
        {
          name: "wallet";
          isMut: false;
          isSigner: true;
        },
        {
          name: "sellerBrokerWallet";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspaceFeeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "sellerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programAsSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "instructions";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenRecord";
          isMut: true;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "editionAccount";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "authorizationRules";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "mplTokenAuthRulesProgram";
          isMut: false;
          isSigner: false;
          docs: ["CHECK no check needed"];
        },
        {
          name: "clock";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "programAsSignerBump";
          type: "u8";
        },
        {
          name: "minAmountToReceive";
          type: "u64";
        },
        {
          name: "brokerBasisPoints";
          type: "u16";
        },
        {
          name: "tokenSize";
          type: "u64";
        },
        {
          name: "royaltyBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "buy";
      accounts: [
        {
          name: "wallet";
          isMut: false;
          isSigner: true;
        },
        {
          name: "buyerBrokerWallet";
          isMut: false;
          isSigner: false;
        },
        {
          name: "paymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "transferAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "buyerReceiptTokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowPaymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspaceFeeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "clock";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "escrowPaymentBump";
          type: "u8";
        },
        {
          name: "maxAmountToPay";
          type: "u64";
        },
        {
          name: "brokerBasisPoints";
          type: "u16";
        },
        {
          name: "tokenSize";
          type: "u64";
        },
        {
          name: "royaltyBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "collectionBuy";
      accounts: [
        {
          name: "wallet";
          isMut: true;
          isSigner: true;
        },
        {
          name: "buyerBrokerWallet";
          isMut: false;
          isSigner: false;
        },
        {
          name: "identifierPubkey";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowPaymentAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "hyperspaceFeeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionBuyerTradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "clock";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "escrowPaymentBump";
          type: "u8";
        },
        {
          name: "buyerPrice";
          type: "u64";
        },
        {
          name: "brokerBasisPoints";
          type: "u16";
        },
        {
          name: "collectionTradeStateType";
          type: "u8";
        },
        {
          name: "identifierIndex";
          type: "u8";
        },
        {
          name: "royaltyBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "createCollectionBuyTradeState";
      accounts: [
        {
          name: "wallet";
          isMut: true;
          isSigner: true;
        },
        {
          name: "identifierPubkey";
          isMut: false;
          isSigner: false;
        },
        {
          name: "brokerWallet";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "clock";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "buyPrice";
          type: "u64";
        },
        {
          name: "brokerBasisPoints";
          type: "u16";
        },
        {
          name: "collectionTradeStateType";
          type: "u8";
        },
        {
          name: "identifierIndex";
          type: "u8";
        },
        {
          name: "royaltyBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "createTradeState";
      accounts: [
        {
          name: "wallet";
          isMut: true;
          isSigner: true;
        },
        {
          name: "collection";
          isMut: false;
          isSigner: false;
        },
        {
          name: "brokerWallet";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tradeState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "clock";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "isBuy";
          type: "u8";
        },
        {
          name: "tradeStateBump";
          type: "u8";
        },
        {
          name: "buyPrice";
          type: "u64";
        },
        {
          name: "brokerBasisPoints";
          type: "u16";
        },
        {
          name: "tokenSize";
          type: "u64";
        },
        {
          name: "royaltyBasisPoints";
          type: "u16";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "hyperspace";
      type: {
        kind: "struct";
        fields: [
          {
            name: "hyperspaceFeeAccount";
            type: "publicKey";
          },
          {
            name: "hyperspaceTreasury";
            type: "publicKey";
          },
          {
            name: "treasuryWithdrawalDestination";
            type: "publicKey";
          },
          {
            name: "feeWithdrawalDestination";
            type: "publicKey";
          },
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "treasuryBump";
            type: "u8";
          },
          {
            name: "feePayerBump";
            type: "u8";
          },
          {
            name: "sellerFeeBasisPoints";
            type: "u16";
          },
          {
            name: "requiresSignOff";
            type: "bool";
          },
          {
            name: "canChangeSalePrice";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "programAsSigner";
      type: {
        kind: "struct";
        fields: [
          {
            name: "firstByte";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "tradeState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "buyPrice";
            type: "u64";
          },
          {
            name: "userWallet";
            type: "publicKey";
          },
          {
            name: "isBuy";
            type: "u8";
          },
          {
            name: "collection";
            type: "publicKey";
          },
          {
            name: "brokerWallet";
            type: "publicKey";
          },
          {
            name: "brokerBasisPoints";
            type: "u16";
          },
          {
            name: "tokenMint";
            type: "publicKey";
          },
          {
            name: "royaltyBasisPoints";
            type: "u16";
          },
          {
            name: "timestamp";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "collectionBuyTradeState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "userWallet";
            type: "publicKey";
          },
          {
            name: "collectionTradeStateType";
            type: "u8";
          },
          {
            name: "identifierIndex";
            type: "u8";
          },
          {
            name: "identifierPubkey";
            type: "publicKey";
          },
          {
            name: "brokerWallet";
            type: "publicKey";
          },
          {
            name: "brokerBasisPoints";
            type: "u16";
          },
          {
            name: "royaltyBasisPoints";
            type: "u16";
          },
          {
            name: "timestamp";
            type: "i64";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "AuthorizationDataLocal";
      type: {
        kind: "struct";
        fields: [
          {
            name: "payload";
            type: {
              vec: {
                defined: "TaggedPayload";
              };
            };
          }
        ];
      };
    },
    {
      name: "TaggedPayload";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "payload";
            type: {
              defined: "PayloadTypeLocal";
            };
          }
        ];
      };
    },
    {
      name: "SeedsVecLocal";
      type: {
        kind: "struct";
        fields: [
          {
            name: "seeds";
            docs: ["The vector of derivation seeds."];
            type: {
              vec: "bytes";
            };
          }
        ];
      };
    },
    {
      name: "ProofInfoLocal";
      type: {
        kind: "struct";
        fields: [
          {
            name: "proof";
            docs: ["The merkle proof."];
            type: {
              vec: {
                array: ["u8", 32];
              };
            };
          }
        ];
      };
    },
    {
      name: "PayloadTypeLocal";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Pubkey";
            fields: ["publicKey"];
          },
          {
            name: "Seeds";
            fields: [
              {
                defined: "SeedsVecLocal";
              }
            ];
          },
          {
            name: "MerkleProof";
            fields: [
              {
                defined: "ProofInfoLocal";
              }
            ];
          },
          {
            name: "Number";
            fields: ["u64"];
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "PublicKeyMismatch";
      msg: "PublicKeyMismatch";
    },
    {
      code: 6001;
      name: "InvalidMintAuthority";
      msg: "InvalidMintAuthority";
    },
    {
      code: 6002;
      name: "UninitializedAccount";
      msg: "UninitializedAccount";
    },
    {
      code: 6003;
      name: "IncorrectOwner";
      msg: "IncorrectOwner";
    },
    {
      code: 6004;
      name: "PublicKeysShouldBeUnique";
      msg: "PublicKeysShouldBeUnique";
    },
    {
      code: 6005;
      name: "StatementFalse";
      msg: "StatementFalse";
    },
    {
      code: 6006;
      name: "NotRentExempt";
      msg: "NotRentExempt";
    },
    {
      code: 6007;
      name: "NumericalOverflow";
      msg: "NumericalOverflow";
    },
    {
      code: 6008;
      name: "ExpectedSolAccount";
      msg: "Expected a sol account but got an spl token account instead";
    },
    {
      code: 6009;
      name: "CannotExchangeSOLForSol";
      msg: "Cannot exchange sol for sol";
    },
    {
      code: 6010;
      name: "SOLWalletMustSign";
      msg: "If paying with sol, sol wallet must be signer";
    },
    {
      code: 6011;
      name: "CannotTakeThisActionWithoutHyperspaceSignOff";
      msg: "Cannot take this action without hyperspace signing too";
    },
    {
      code: 6012;
      name: "NoPayerPresent";
      msg: "No payer present on this txn";
    },
    {
      code: 6013;
      name: "DerivedKeyInvalid";
      msg: "Derived key invalid";
    },
    {
      code: 6014;
      name: "MetadataDoesntExist";
      msg: "Metadata doesn't exist";
    },
    {
      code: 6015;
      name: "InvalidTokenAmount";
      msg: "Invalid token amount";
    },
    {
      code: 6016;
      name: "BothPartiesNeedToAgreeToSale";
      msg: "Both parties need to agree to this sale";
    },
    {
      code: 6017;
      name: "CannotMatchFreeSalesWithoutHyperspaceOrSellerSignoff";
      msg: "Cannot match free sales unless the hyperspace or seller signs off";
    },
    {
      code: 6018;
      name: "SaleRequiresSigner";
      msg: "This sale requires a signer";
    },
    {
      code: 6019;
      name: "OldSellerNotInitialized";
      msg: "Old seller not initialized";
    },
    {
      code: 6020;
      name: "SellerATACannotHaveDelegate";
      msg: "Seller ata cannot have a delegate set";
    },
    {
      code: 6021;
      name: "BuyerATACannotHaveDelegate";
      msg: "Buyer ata cannot have a delegate set";
    },
    {
      code: 6022;
      name: "NoValidSignerPresent";
      msg: "No valid signer present";
    },
    {
      code: 6023;
      name: "InvalidBasisPoints";
      msg: "BP must be less than or equal to 10000";
    },
    {
      code: 6024;
      name: "InvalidBrokerInformation";
      msg: "Broker information must match";
    },
    {
      code: 6025;
      name: "InvalidTokenAccount";
      msg: "Token Account holding selling token must be owned by seller";
    },
    {
      code: 6026;
      name: "InvalidPermissionlessCancel";
      msg: "Cannot permissionless cancel this trade state";
    },
    {
      code: 6027;
      name: "InvalidCollectionTradeStateType";
      msg: "Invalid Collection Trade State Type";
    },
    {
      code: 6028;
      name: "InvalidCollectionTradeStateIdentifier";
      msg: "Invalid Collection Trade State Identifier";
    },
    {
      code: 6029;
      name: "BumpSeedNotInHashMap";
      msg: "Bump seed not in hash map.";
    },
    {
      code: 6030;
      name: "MetaplexTransferFailed";
      msg: "Failed to transfer NFT using metaplex";
    },
    {
      code: 6031;
      name: "MetaplexDelegateFailed";
      msg: "Failed to set Sale delegate on NFT using metaplex";
    },
    {
      code: 6032;
      name: "MetaplexRevokeFailed";
      msg: "Failed to revoke Sale delegate on NFT using metaplex";
    },
    {
      code: 6033;
      name: "IncorrectTokenStandard";
      msg: "Token standard must be Programmable NFT or Standard NFT";
    },
    {
      code: 6034;
      name: "PNFTDelegateSetAlready";
      msg: "PNFT Delegate set already";
    },
    {
      code: 6035;
      name: "RoyaltyBPMismatch";
      msg: "Royalty basis points mismatch";
    }
  ];
};

export const hyperspaceIdl: Hyperspace = {
  version: "0.1.0",
  name: "hyperspace",
  instructions: [
    {
      name: "initProgramAsSigner",
      accounts: [
        {
          name: "wallet",
          isMut: true,
          isSigner: true,
        },
        {
          name: "programAsSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "programAsSignerBump",
          type: "u8",
        },
      ],
    },
    {
      name: "updateHyperspace",
      accounts: [
        {
          name: "payer",
          isMut: false,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "newAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "feeWithdrawalDestination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasuryWithdrawalDestination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasuryWithdrawalDestinationOwner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "sellerFeeBasisPoints",
          type: {
            option: "u16",
          },
        },
        {
          name: "requiresSignOff",
          type: {
            option: "bool",
          },
        },
        {
          name: "canChangeSalePrice",
          type: {
            option: "bool",
          },
        },
      ],
    },
    {
      name: "withdraw",
      accounts: [
        {
          name: "wallet",
          isMut: false,
          isSigner: false,
        },
        {
          name: "receiptAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowPaymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "escrowPaymentBump",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "deposit",
      accounts: [
        {
          name: "wallet",
          isMut: false,
          isSigner: true,
        },
        {
          name: "paymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "transferAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowPaymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspaceFeeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "escrowPaymentBump",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "permissionlessCancel",
      accounts: [
        {
          name: "wallet",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "seller",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programAsSigner",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "programAsSignerBump",
          type: "u8",
        },
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "tokenSize",
          type: "u64",
        },
      ],
    },
    {
      name: "collectionCancelBuy",
      accounts: [
        {
          name: "wallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "identifierPubkey",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionBuyerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programAsSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "buyerPrice",
          type: "u64",
        },
        {
          name: "programAsSignerBump",
          type: "u8",
        },
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "collectionTradeStateType",
          type: "u8",
        },
        {
          name: "identifierIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "cancel",
      accounts: [
        {
          name: "wallet",
          isMut: true,
          isSigner: false,
          docs: ["CHECK OWNER OF TRADE_STATE TODO"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programAsSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "instructions",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenRecord",
          isMut: true,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "editionAccount",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "authorizationRules",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "mplTokenAuthRulesProgram",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
      ],
      args: [
        {
          name: "isBuy",
          type: "u8",
        },
        {
          name: "programAsSignerBump",
          type: "u8",
        },
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "tokenSize",
          type: "u64",
        },
      ],
    },
    {
      name: "collectionExecuteSale",
      accounts: [
        {
          name: "buyer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyerBrokerWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "seller",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sellerBrokerWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "editionData",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowPaymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyerReceiptTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspaceTreasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "identifierPubkey",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionBuyerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sellerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mplTokenAuthRulesProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programAsSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "instructions",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ownerTokenRecord",
          isMut: true,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "destinationTokenRecord",
          isMut: true,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "authorizationRules",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
      ],
      args: [
        {
          name: "escrowPaymentBump",
          type: "u8",
        },
        {
          name: "programAsSignerBump",
          type: "u8",
        },
        {
          name: "buyerTradeStateBump",
          type: "u8",
        },
        {
          name: "sellerTradeStateBump",
          type: "u8",
        },
        {
          name: "maxAmountToPay",
          type: "u64",
        },
        {
          name: "buyerBrokerBasisPoints",
          type: "u16",
        },
        {
          name: "sellerBrokerBasisPoints",
          type: "u16",
        },
        {
          name: "tokenSize",
          type: "u64",
        },
        {
          name: "collectionTradeStateType",
          type: "u8",
        },
        {
          name: "identifierIndex",
          type: "u8",
        },
        {
          name: "royaltyBasisPoints",
          type: "u16",
        },
      ],
    },
    {
      name: "executeSale",
      accounts: [
        {
          name: "buyer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyerBrokerWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "seller",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sellerBrokerWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowPaymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyerReceiptTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspaceTreasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sellerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mplTokenAuthRulesProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programAsSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "instructions",
          isMut: false,
          isSigner: false,
        },
        {
          name: "editionAccount",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "ownerTokenRecord",
          isMut: true,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "destinationTokenRecord",
          isMut: true,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "authorizationRules",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
      ],
      args: [
        {
          name: "escrowPaymentBump",
          type: "u8",
        },
        {
          name: "programAsSignerBump",
          type: "u8",
        },
        {
          name: "buyerTradeStateBump",
          type: "u8",
        },
        {
          name: "sellerTradeStateBump",
          type: "u8",
        },
        {
          name: "maxAmountToPay",
          type: "u64",
        },
        {
          name: "buyerBrokerBasisPoints",
          type: "u16",
        },
        {
          name: "sellerBrokerBasisPoints",
          type: "u16",
        },
        {
          name: "tokenSize",
          type: "u64",
        },
        {
          name: "royaltyBasisPoints",
          type: "u16",
        },
      ],
    },
    {
      name: "sell",
      accounts: [
        {
          name: "wallet",
          isMut: false,
          isSigner: true,
        },
        {
          name: "sellerBrokerWallet",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspaceFeeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sellerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programAsSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "instructions",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenRecord",
          isMut: true,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "editionAccount",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "authorizationRules",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "mplTokenAuthRulesProgram",
          isMut: false,
          isSigner: false,
          docs: ["CHECK no check needed"],
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "programAsSignerBump",
          type: "u8",
        },
        {
          name: "minAmountToReceive",
          type: "u64",
        },
        {
          name: "brokerBasisPoints",
          type: "u16",
        },
        {
          name: "tokenSize",
          type: "u64",
        },
        {
          name: "royaltyBasisPoints",
          type: "u16",
        },
      ],
    },
    {
      name: "buy",
      accounts: [
        {
          name: "wallet",
          isMut: false,
          isSigner: true,
        },
        {
          name: "buyerBrokerWallet",
          isMut: false,
          isSigner: false,
        },
        {
          name: "paymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "transferAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "buyerReceiptTokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowPaymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspaceFeeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "escrowPaymentBump",
          type: "u8",
        },
        {
          name: "maxAmountToPay",
          type: "u64",
        },
        {
          name: "brokerBasisPoints",
          type: "u16",
        },
        {
          name: "tokenSize",
          type: "u64",
        },
        {
          name: "royaltyBasisPoints",
          type: "u16",
        },
      ],
    },
    {
      name: "collectionBuy",
      accounts: [
        {
          name: "wallet",
          isMut: true,
          isSigner: true,
        },
        {
          name: "buyerBrokerWallet",
          isMut: false,
          isSigner: false,
        },
        {
          name: "identifierPubkey",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowPaymentAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "hyperspaceFeeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionBuyerTradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "escrowPaymentBump",
          type: "u8",
        },
        {
          name: "buyerPrice",
          type: "u64",
        },
        {
          name: "brokerBasisPoints",
          type: "u16",
        },
        {
          name: "collectionTradeStateType",
          type: "u8",
        },
        {
          name: "identifierIndex",
          type: "u8",
        },
        {
          name: "royaltyBasisPoints",
          type: "u16",
        },
      ],
    },
    {
      name: "createCollectionBuyTradeState",
      accounts: [
        {
          name: "wallet",
          isMut: true,
          isSigner: true,
        },
        {
          name: "identifierPubkey",
          isMut: false,
          isSigner: false,
        },
        {
          name: "brokerWallet",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "buyPrice",
          type: "u64",
        },
        {
          name: "brokerBasisPoints",
          type: "u16",
        },
        {
          name: "collectionTradeStateType",
          type: "u8",
        },
        {
          name: "identifierIndex",
          type: "u8",
        },
        {
          name: "royaltyBasisPoints",
          type: "u16",
        },
      ],
    },
    {
      name: "createTradeState",
      accounts: [
        {
          name: "wallet",
          isMut: true,
          isSigner: true,
        },
        {
          name: "collection",
          isMut: false,
          isSigner: false,
        },
        {
          name: "brokerWallet",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tradeState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "isBuy",
          type: "u8",
        },
        {
          name: "tradeStateBump",
          type: "u8",
        },
        {
          name: "buyPrice",
          type: "u64",
        },
        {
          name: "brokerBasisPoints",
          type: "u16",
        },
        {
          name: "tokenSize",
          type: "u64",
        },
        {
          name: "royaltyBasisPoints",
          type: "u16",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "hyperspace",
      type: {
        kind: "struct",
        fields: [
          {
            name: "hyperspaceFeeAccount",
            type: "publicKey",
          },
          {
            name: "hyperspaceTreasury",
            type: "publicKey",
          },
          {
            name: "treasuryWithdrawalDestination",
            type: "publicKey",
          },
          {
            name: "feeWithdrawalDestination",
            type: "publicKey",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "treasuryBump",
            type: "u8",
          },
          {
            name: "feePayerBump",
            type: "u8",
          },
          {
            name: "sellerFeeBasisPoints",
            type: "u16",
          },
          {
            name: "requiresSignOff",
            type: "bool",
          },
          {
            name: "canChangeSalePrice",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "programAsSigner",
      type: {
        kind: "struct",
        fields: [
          {
            name: "firstByte",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "tradeState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "buyPrice",
            type: "u64",
          },
          {
            name: "userWallet",
            type: "publicKey",
          },
          {
            name: "isBuy",
            type: "u8",
          },
          {
            name: "collection",
            type: "publicKey",
          },
          {
            name: "brokerWallet",
            type: "publicKey",
          },
          {
            name: "brokerBasisPoints",
            type: "u16",
          },
          {
            name: "tokenMint",
            type: "publicKey",
          },
          {
            name: "royaltyBasisPoints",
            type: "u16",
          },
          {
            name: "timestamp",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "collectionBuyTradeState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "userWallet",
            type: "publicKey",
          },
          {
            name: "collectionTradeStateType",
            type: "u8",
          },
          {
            name: "identifierIndex",
            type: "u8",
          },
          {
            name: "identifierPubkey",
            type: "publicKey",
          },
          {
            name: "brokerWallet",
            type: "publicKey",
          },
          {
            name: "brokerBasisPoints",
            type: "u16",
          },
          {
            name: "royaltyBasisPoints",
            type: "u16",
          },
          {
            name: "timestamp",
            type: "i64",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "AuthorizationDataLocal",
      type: {
        kind: "struct",
        fields: [
          {
            name: "payload",
            type: {
              vec: {
                defined: "TaggedPayload",
              },
            },
          },
        ],
      },
    },
    {
      name: "TaggedPayload",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "payload",
            type: {
              defined: "PayloadTypeLocal",
            },
          },
        ],
      },
    },
    {
      name: "SeedsVecLocal",
      type: {
        kind: "struct",
        fields: [
          {
            name: "seeds",
            docs: ["The vector of derivation seeds."],
            type: {
              vec: "bytes",
            },
          },
        ],
      },
    },
    {
      name: "ProofInfoLocal",
      type: {
        kind: "struct",
        fields: [
          {
            name: "proof",
            docs: ["The merkle proof."],
            type: {
              vec: {
                array: ["u8", 32],
              },
            },
          },
        ],
      },
    },
    {
      name: "PayloadTypeLocal",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Pubkey",
            fields: ["publicKey"],
          },
          {
            name: "Seeds",
            fields: [
              {
                defined: "SeedsVecLocal",
              },
            ],
          },
          {
            name: "MerkleProof",
            fields: [
              {
                defined: "ProofInfoLocal",
              },
            ],
          },
          {
            name: "Number",
            fields: ["u64"],
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "PublicKeyMismatch",
      msg: "PublicKeyMismatch",
    },
    {
      code: 6001,
      name: "InvalidMintAuthority",
      msg: "InvalidMintAuthority",
    },
    {
      code: 6002,
      name: "UninitializedAccount",
      msg: "UninitializedAccount",
    },
    {
      code: 6003,
      name: "IncorrectOwner",
      msg: "IncorrectOwner",
    },
    {
      code: 6004,
      name: "PublicKeysShouldBeUnique",
      msg: "PublicKeysShouldBeUnique",
    },
    {
      code: 6005,
      name: "StatementFalse",
      msg: "StatementFalse",
    },
    {
      code: 6006,
      name: "NotRentExempt",
      msg: "NotRentExempt",
    },
    {
      code: 6007,
      name: "NumericalOverflow",
      msg: "NumericalOverflow",
    },
    {
      code: 6008,
      name: "ExpectedSolAccount",
      msg: "Expected a sol account but got an spl token account instead",
    },
    {
      code: 6009,
      name: "CannotExchangeSOLForSol",
      msg: "Cannot exchange sol for sol",
    },
    {
      code: 6010,
      name: "SOLWalletMustSign",
      msg: "If paying with sol, sol wallet must be signer",
    },
    {
      code: 6011,
      name: "CannotTakeThisActionWithoutHyperspaceSignOff",
      msg: "Cannot take this action without hyperspace signing too",
    },
    {
      code: 6012,
      name: "NoPayerPresent",
      msg: "No payer present on this txn",
    },
    {
      code: 6013,
      name: "DerivedKeyInvalid",
      msg: "Derived key invalid",
    },
    {
      code: 6014,
      name: "MetadataDoesntExist",
      msg: "Metadata doesn't exist",
    },
    {
      code: 6015,
      name: "InvalidTokenAmount",
      msg: "Invalid token amount",
    },
    {
      code: 6016,
      name: "BothPartiesNeedToAgreeToSale",
      msg: "Both parties need to agree to this sale",
    },
    {
      code: 6017,
      name: "CannotMatchFreeSalesWithoutHyperspaceOrSellerSignoff",
      msg: "Cannot match free sales unless the hyperspace or seller signs off",
    },
    {
      code: 6018,
      name: "SaleRequiresSigner",
      msg: "This sale requires a signer",
    },
    {
      code: 6019,
      name: "OldSellerNotInitialized",
      msg: "Old seller not initialized",
    },
    {
      code: 6020,
      name: "SellerATACannotHaveDelegate",
      msg: "Seller ata cannot have a delegate set",
    },
    {
      code: 6021,
      name: "BuyerATACannotHaveDelegate",
      msg: "Buyer ata cannot have a delegate set",
    },
    {
      code: 6022,
      name: "NoValidSignerPresent",
      msg: "No valid signer present",
    },
    {
      code: 6023,
      name: "InvalidBasisPoints",
      msg: "BP must be less than or equal to 10000",
    },
    {
      code: 6024,
      name: "InvalidBrokerInformation",
      msg: "Broker information must match",
    },
    {
      code: 6025,
      name: "InvalidTokenAccount",
      msg: "Token Account holding selling token must be owned by seller",
    },
    {
      code: 6026,
      name: "InvalidPermissionlessCancel",
      msg: "Cannot permissionless cancel this trade state",
    },
    {
      code: 6027,
      name: "InvalidCollectionTradeStateType",
      msg: "Invalid Collection Trade State Type",
    },
    {
      code: 6028,
      name: "InvalidCollectionTradeStateIdentifier",
      msg: "Invalid Collection Trade State Identifier",
    },
    {
      code: 6029,
      name: "BumpSeedNotInHashMap",
      msg: "Bump seed not in hash map.",
    },
    {
      code: 6030,
      name: "MetaplexTransferFailed",
      msg: "Failed to transfer NFT using metaplex",
    },
    {
      code: 6031,
      name: "MetaplexDelegateFailed",
      msg: "Failed to set Sale delegate on NFT using metaplex",
    },
    {
      code: 6032,
      name: "MetaplexRevokeFailed",
      msg: "Failed to revoke Sale delegate on NFT using metaplex",
    },
    {
      code: 6033,
      name: "IncorrectTokenStandard",
      msg: "Token standard must be Programmable NFT or Standard NFT",
    },
    {
      code: 6034,
      name: "PNFTDelegateSetAlready",
      msg: "PNFT Delegate set already",
    },
    {
      code: 6035,
      name: "RoyaltyBPMismatch",
      msg: "Royalty basis points mismatch",
    },
  ],
};

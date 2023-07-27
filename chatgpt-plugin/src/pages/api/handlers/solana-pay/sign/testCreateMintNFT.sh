curl --location 'localhost:3000/api/handlers/solana-pay/sign/createMintNFT?=null' \
--header 'Content-Type: application/json' \
--data '{
    "name": "test first AI minted NFT",
    "account":"8rcvXRDktcqzNZ9N1iDAptYky93HuZvbzs76ZFXPmKQs",
    "metadataUri":"https://arweave.net/9XciS8hnBhf1PLf7B1zlUEP_cLiQQ9Zu8xiKV5hd7rc",
    "sellerFee":250
}'
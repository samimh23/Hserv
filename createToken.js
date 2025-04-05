const {
    AccountId,
    PrivateKey,
    Client,
    TokenCreateTransaction,
    TokenType
} = require("@hashgraph/sdk");
require('dotenv').config({ path: './.env' });

async function main() {
    let client;
    try {
        const MY_ACCOUNT_ID = process.env.MY_ACCOUNT_ID;
        const MY_PRIVATE_KEY = process.env.MY_PRIVATE_KEY;

        if (!MY_ACCOUNT_ID || !MY_PRIVATE_KEY) {
            throw new Error("Environment variables MY_ACCOUNT_ID or MY_PRIVATE_KEY are missing");
        }

        // Convert private key from string to PrivateKey object
        const operatorKey = PrivateKey.fromString(MY_PRIVATE_KEY);

        client = Client.forTestnet().setOperator(MY_ACCOUNT_ID, operatorKey);

        // Create the transaction and freeze for manual signing
        const txTokenCreate = await new TokenCreateTransaction()
            .setTokenName("Hanouti Coin")
            .setTokenSymbol("HC")
            .setTokenType(TokenType.FUNGIBLE_COMMON)
            .setTreasuryAccountId(MY_ACCOUNT_ID)
            .setInitialSupply(5000)
            .freezeWith(client);

        // Sign the transaction with the token treasury account private key
        const signTxTokenCreate = await txTokenCreate.sign(operatorKey);

        // Submit the transaction to a Hedera network
        const txTokenCreateResponse = await signTxTokenCreate.execute(client);

        // Get the receipt of the transaction
        const receiptTokenCreateTx = await txTokenCreateResponse.getReceipt(client);

        // Get the token ID from the receipt
        const tokenId = receiptTokenCreateTx.tokenId;

        // Get the transaction consensus status
        const statusTokenCreateTx = receiptTokenCreateTx.status;

        // Get the Transaction ID
        const txTokenCreateId = txTokenCreateResponse.transactionId.toString();

        console.log("--------------------------------- Token Creation ---------------------------------");
        console.log("Receipt status           :", statusTokenCreateTx.toString());
        console.log("Transaction ID           :", txTokenCreateId);
        console.log("Hashscan URL             :", "https://hashscan.io/testnet/tx/" + txTokenCreateId);
        console.log("Token ID                 :", tokenId.toString());

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (client) client.close();
    }
}

main();

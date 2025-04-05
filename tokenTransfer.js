const {
    AccountId,
    PrivateKey,
    Client,
    TransferTransaction
} = require("@hashgraph/sdk"); // v2.46.0
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

        // Start your code here
        const tokenId = "0.0.5677997";
        const receiverId = "0.0.5678161"; 

        // Create the transfer transaction
        const txTransfer = await new TransferTransaction()
            .addTokenTransfer(tokenId, MY_ACCOUNT_ID, -360)
            .addTokenTransfer(tokenId, receiverId, 360)
            .freezeWith(client);

        // Sign with the sender account private key
        const signTxTransfer = await txTransfer.sign(operatorKey);

        // Submit to a Hedera network
        const txTransferResponse = await signTxTransfer.execute(client);

        // Request the receipt of the transaction
        const receiptTransferTx = await txTransferResponse.getReceipt(client);

        // Get transaction status and ID
        const statusTransferTx = receiptTransferTx.status;
        const txTransferId = txTransferResponse.transactionId.toString();

        console.log("--------------------------------- Token Transfer ---------------------------------");
        console.log("Receipt status           :", statusTransferTx.toString());
        console.log("Transaction ID           :", txTransferId);
        console.log("Hashscan URL             :", `https://hashscan.io/testnet/tx/${txTransferId}`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (client) client.close();
    }
}

main();

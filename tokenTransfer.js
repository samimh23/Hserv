const {
    AccountId,
    PrivateKey,
    Client,
    TransferTransaction
} = require("@hashgraph/sdk"); // v2.46.0
require('dotenv').config({ path: './.env' });

async function transferTokens(senderAccountId, senderPrivateKey, receiverAccountId, amount) {
    let client;
    try {
        if (!senderAccountId || !senderPrivateKey || !receiverAccountId || !amount) {
            throw new Error("Missing input parameters: senderAccountId, senderPrivateKey, receiverAccountId, or amount");
        }

        // Convert private key from string to PrivateKey object
        const operatorKey = PrivateKey.fromString(senderPrivateKey);

        client = Client.forTestnet().setOperator(senderAccountId, operatorKey);

        // Token ID (replace with your actual token ID)
        const tokenId = "0.0.5677997";

        // Create the transfer transaction
        const txTransfer = await new TransferTransaction()
            .addTokenTransfer(tokenId, senderAccountId, -amount)
            .addTokenTransfer(tokenId, receiverAccountId, amount)
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

module.exports = transferTokens;

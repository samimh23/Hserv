const {
  AccountId,
  PrivateKey,
  Client,
  AccountCreateTransaction,
  TokenAssociateTransaction
} = require("@hashgraph/sdk"); // v2.46.0
require('dotenv').config({ path: './.env' });

async function createWallet() {
  let client;
  try {
    // Your account ID and private key from string value
    const MY_ACCOUNT_ID = process.env.MY_ACCOUNT_ID;
    const MY_PRIVATE_KEY = process.env.MY_PRIVATE_KEY;

    // Pre-configured client for test network (testnet)
    client = Client.forTestnet();

    // Set the operator with the account ID and private key
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    // Generate a new key for the account
    const accountPrivateKey = PrivateKey.generateECDSA();
    const accountPublicKey = accountPrivateKey.publicKey;
    
    const txCreateAccount = new AccountCreateTransaction()
      .setAlias(accountPublicKey.toEvmAddress()) // Do NOT set an alias if you need to update/rotate keys
      .setKey(accountPublicKey);

    // Sign the transaction with the client operator private key and submit to a Hedera network
    const txCreateAccountResponse = await txCreateAccount.execute(client);

    // Request the receipt of the transaction
    const receiptCreateAccountTx = await txCreateAccountResponse.getReceipt(client);

    // Get the Account ID from the receipt
    const accountId = receiptCreateAccountTx.accountId;

    // Associate a token to the newly created account and freeze the unsigned transaction for signing
    const tokenId = "0.0.5677997";  // Replace with your actual token ID
    const txTokenAssociate = new TokenAssociateTransaction()
      .setAccountId(accountId)  // Use accountId here
      .setTokenIds([tokenId])
      .freezeWith(client);

    // Sign with the private key of the account being associated to the token
    const signTxTokenAssociate = await txTokenAssociate.sign(accountPrivateKey);

    // Execute the token association transaction
    const txTokenAssociateResponse = await signTxTokenAssociate.execute(client);

    // Request the receipt for token association transaction
    const receiptTokenAssociateTx = await txTokenAssociateResponse.getReceipt(client);

    // Get the status of the token association transaction
    const statusCreateAccountTx = receiptCreateAccountTx.status;
    const statusTokenAssociateTx = receiptTokenAssociateTx.status;

    // Get the Transaction ID of account creation and token association
    const txIdAccountCreated = txCreateAccountResponse.transactionId.toString();
    const txIdTokenAssociated = txTokenAssociateResponse.transactionId.toString();

    console.log("------------------------------ Create Account ------------------------------ ");
    console.log("Account Created Status  :", statusCreateAccountTx.toString());
    console.log("Token Association Status:", statusTokenAssociateTx.toString());
    console.log("Account ID             :", accountId.toString());
    console.log("Account Private Key    :", accountPrivateKey.toString());
    console.log("Account Public Key     :", accountPublicKey.toString());
    console.log("Transaction ID Account Created:", txIdAccountCreated);
    console.log("Transaction ID Token Associated:", txIdTokenAssociated);
    console.log("Hashscan URL Account Created:", `https://hashscan.io/testnet/tx/${txIdAccountCreated}`);
    console.log("Hashscan URL Token Associated:", `https://hashscan.io/testnet/tx/${txIdTokenAssociated}`);

  } catch (error) {
    console.error(error);
  } finally {
    if (client) client.close();
  }
}


CreateWallet();
module.exports ={createWallet};
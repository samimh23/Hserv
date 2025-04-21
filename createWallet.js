const {
  AccountId,
  PrivateKey,
  Client,
  AccountCreateTransaction,
  TokenAssociateTransaction,
  TransferTransaction,
  Hbar
} = require("@hashgraph/sdk");
require('dotenv').config({ path: './.env' });

async function createWallet() {
  let client;
  try {
    const MY_ACCOUNT_ID = process.env.MY_ACCOUNT_ID;
    const MY_PRIVATE_KEY = process.env.MY_PRIVATE_KEY;

    client = Client.forTestnet();
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    const accountPrivateKey = PrivateKey.generateECDSA();
    const accountPublicKey = accountPrivateKey.publicKey;

    const txCreateAccount = new AccountCreateTransaction()
      .setAlias(accountPublicKey.toEvmAddress())
      .setKey(accountPublicKey);

    const txCreateAccountResponse = await txCreateAccount.execute(client);
    const receiptCreateAccountTx = await txCreateAccountResponse.getReceipt(client);
    const accountId = receiptCreateAccountTx.accountId;

    const tokenId = "0.0.5883473";  // Replace with your actual token ID
    const txTokenAssociate = new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([tokenId])
      .freezeWith(client);  

    const signTxTokenAssociate = await txTokenAssociate.sign(accountPrivateKey);
    const txTokenAssociateResponse = await signTxTokenAssociate.execute(client);
    const receiptTokenAssociateTx = await txTokenAssociateResponse.getReceipt(client);

    console.log("✅ Account and token association successful");
            // Send some money to make the account opperetable
                const txTransfer= new TransferTransaction()
                .addHbarTransfer(MY_ACCOUNT_ID, new Hbar(-10))
                .addHbarTransfer(accountId, new Hbar(10)); 
                    
            //Submit the transaction to a Hedera network
            const txTransferResponse = await txTransfer.execute(client);
    
            //Request the receipt of the transaction
            const receiptTransferTx = await txTransferResponse.getReceipt(client);

    return {
      accountId: accountId.toString(),
      privateKey: accountPrivateKey.toString()
    };

  } catch (error) {
    console.error("❌ Error creating wallet:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

module.exports = createWallet;

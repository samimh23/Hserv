const {
    AccountId,
    PrivateKey,
    Client,
    TokenAssociateTransaction
  } = require("@hashgraph/sdk");
  
  async function main() {
    let client;
    try {
      const accountId = "0.0.5820764";
      const privateKey = PrivateKey.fromString("302e020100300506032b657004220420d00066c6e4b0fbbab82a04e650c801a8071a950ea105ad93cefa09fdbaa1e6f1");
  
      // Set the client with operator
      client = Client.forTestnet().setOperator(accountId, privateKey);
  
      const tokenId = "0.0.5883473";
  
      const txTokenAssociate = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(client);
  
      const signedTx = await txTokenAssociate.sign(privateKey);
      const txResponse = await signedTx.execute(client);
      const receipt = await txResponse.getReceipt(client);
  
      console.log("--------------------------------- Token Associate ---------------------------------");
      console.log("Receipt status           :", receipt.status.toString());
      console.log("Transaction ID           :", txResponse.transactionId.toString());
      console.log("Hashscan URL             :", "https://hashscan.io/testnet/tx/" + txResponse.transactionId.toString());
    } catch (error) {
      console.error(error);
    } finally {
      if (client) client.close();
    }
  }
  
  main();
  
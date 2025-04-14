const {
    AccountId,
    PrivateKey,
    Client,
    AccountBalanceQuery,
    TokenId
} = require("@hashgraph/sdk"); // v2.46.0
require('dotenv').config({ path: './.env' });

async function getBalance(accountID, privateKey) {
  let client;
  try {
    // Pre-configured client for test network (testnet)
    client = Client.forTestnet();

    // Set the operator with the account ID and private key
    client.setOperator(accountID, privateKey);

    // Define the token ID you want to check balance for
    const tokenId = TokenId.fromString('0.0.5677997'); // The token ID you want to query

    // Create the account balance query for the specific token
    const accountBalanceQuery = new AccountBalanceQuery()
      .setAccountId(accountID);

    // Submit the query to a Hedera network
    const accountBalance = await accountBalanceQuery.execute(client);

    // Get the balance of the specific token from the account's token balances
    const tokenBalance = accountBalance.tokens.get(tokenId.toString());

    console.log("-------------------------------- Account Balance ------------------------------");
    console.log("HBAR account balance     :", accountBalance.hbars.toString());
    
    // Check if the account has the specified token
    if (tokenBalance) {
      console.log(`Token balance for ${tokenId.toString()}:`, tokenBalance.toString());
      return tokenBalance.toString();
    } else {
      console.log(`Account does not have the specified token (${tokenId.toString()}).`);
      return "Token balance not found";
    }

  } catch (error) {
    console.error(error);
  } finally {
    if (client) client.close();
  }
}

module.exports = getBalance;

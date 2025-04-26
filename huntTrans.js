const axios = require("axios");

async function fetchTransactions(accountId) {
  const url = `https://testnet.mirrornode.hedera.com/api/v1/transactions?account.id=${accountId}`;

  try {
    const response = await axios.get(url);
    const transactions = response.data.transactions;
    let tracedTransactions = [];

    if (transactions && transactions.length > 0) {
      transactions.forEach((tx, index) => {
        // Filter out transactions with ID starting with '0.0.5314413-'
        if (tx.transaction_id.startsWith("0.0.5314413-")) {
          return; // Skip the transaction
        }

        let transactionDetails = {
          id: tx.transaction_id,
          type: tx.name,
          timestamp: tx.consensus_timestamp,
          result: tx.result
        };

        tracedTransactions.push(transactionDetails);
      });
    } else {
      return { message: "No transactions found for this account." };
    }

    return tracedTransactions;
  } catch (error) {
    if (error.response) {
      throw new Error(`Mirror Node Error: ${error.response.status}`);
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
}

module.exports = fetchTransactions;

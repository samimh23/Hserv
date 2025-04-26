const axios = require("axios");

async function fetchTransactions(accountId) {
  const url = `https://testnet.mirrornode.hedera.com/api/v1/transactions?account.id=${accountId}`;

  try {
    const response = await axios.get(url);
    const transactions = response.data.transactions;
    let tracedTransactions = [];

    if (transactions && transactions.length > 0) {
      transactions.forEach((tx) => {
        if (tx.transaction_id.startsWith("0.0.5314413-")) {
          return; // Skip
        }

        let direction = "UNKNOWN"; // default
        let amount = 0;

        if (tx.transfers && tx.transfers.length > 0) {
          tx.transfers.forEach((transfer) => {
            if (transfer.account === accountId) {
              amount = transfer.amount;
              direction = amount > 0 ? "RECEIVE" : "SEND";
            }
          });
        }

        let transactionDetails = {
          id: tx.transaction_id,
          type: tx.name,
          timestamp: tx.consensus_timestamp,
          result: tx.result,
          direction: direction,
          amount: amount / 1e8 // HBAR amount (because Hedera amounts are in tinybar = HBAR * 10^8)
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

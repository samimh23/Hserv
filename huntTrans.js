const axios = require("axios");
require("dotenv").config();

const accountId = process.env.MY_ACCOUNT_ID;

async function fetchTransactions() {
  const url = `https://testnet.mirrornode.hedera.com/api/v1/transactions?account.id=${accountId}`;

  try {
    const response = await axios.get(url);
    const transactions = response.data.transactions;

    if (transactions && transactions.length > 0) {
      console.log("📦 Transactions for Account:", accountId);
      transactions.forEach((tx, index) => {
        // Filter out transactions with ID starting with '0.0.5314413-'
        if (tx.transaction_id.startsWith("0.0.5314413-")) {
          console.log(`\n🔹 Skipped Transaction ${index + 1} (ID starts with 0.0.5314413-)`);
          return; // Skip the transaction
        }

        console.log(`\n🔹 Transaction ${index + 1}`);
        console.log("  ✅ ID:         ", tx.transaction_id);
        console.log("  🔄 Type:       ", tx.name);
        console.log("  ⏰ Timestamp:  ", tx.consensus_timestamp);
        console.log("  💬 Result:     ", tx.result);
      });
    } else {
      console.log("ℹ️ No transactions found for this account.");
    }
  } catch (error) {
    if (error.response) {
      console.error("❌ Mirror Node Error:");
      console.error("Status Code:", error.response.status);
      console.error("Message:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("❌ Request Error:", error.message);
    }
  }
}

fetchTransactions();

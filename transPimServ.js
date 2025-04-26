const express = require('express');
const dotenv = require('dotenv');
const createWallet = require('./createWallet');
const tokenTransfer = require('./tokenTransfer');
const getBalance = require('./getBalance');
const fetchTransactions = require('./huntTrans');  // Use huntTrans.js

dotenv.config();

const app = express();
const PORT = process.env.PORT ;
const operatorAccount = process.env.MY_ACCOUNT_ID;
const operatorKey = process.env.MY_PRIVATE_KEY;

// Middleware
app.use(express.json());

// Routes

// Testing Route
app.get('/', (req, res) => {
  res.send('Hedera fractional NFT API server is running!');
});

// Create Account Route
app.post('/api/wallet/create', async (req, res) => {
  try {
    const wallet = await createWallet();
    res.status(201).json(wallet);
  } catch (error) {
    console.error('Error in /api/wallet/create:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Lock Amount
app.post('/api/token/Lock', async (req, res) => {
  try {
    const { senderAccountId, senderPrivateKey, amount } = req.body;

    if (!senderAccountId || !senderPrivateKey || !amount) {
      return res.status(400).json({ error: 'Missing required fields in request body' });
    }

    await tokenTransfer(senderAccountId, senderPrivateKey, operatorAccount, amount);

    res.status(200).json({ message: 'Token transfer successful' });
  } catch (error) {
    console.error('Error in /api/token/Lock:', error);
    res.status(500).json({ error: 'Failed to process token transfer' });
  }
});

// Unlock Amount
app.post('/api/token/Unlock', async (req, res) => {
  try {
    const { receiverAccountId, amount } = req.body;

    if (!receiverAccountId || !amount) {
      return res.status(400).json({ error: 'Missing required fields in request body' });
    }

    await tokenTransfer(operatorAccount, operatorKey, receiverAccountId, amount);

    res.status(200).json({ message: 'Token transfer successful' });
  } catch (error) {
    console.error('Error in /api/token/Unlock:', error);
    res.status(500).json({ error: 'Failed to process token transfer' });
  }
});

// Transfer Route
app.post('/api/token/transfer', async (req, res) => {
  try {
    const { senderAccountId, senderPrivateKey, receiverAccountId, amount } = req.body;

    if (!senderAccountId || !senderPrivateKey || !receiverAccountId || !amount) {
      return res.status(400).json({ error: 'Missing required fields in request body' });
    }

    await tokenTransfer(senderAccountId, senderPrivateKey, receiverAccountId, amount);

    res.status(200).json({ message: 'Token transfer successful' });
  } catch (error) {
    console.error('Error in /api/token/transfer:', error);
    res.status(500).json({ error: 'Failed to process token transfer' });
  }
});

// Get Balance Route
app.post('/api/token/balance', async (req, res) => {
  try {
    const { accountId, privateKey } = req.body;

    if (!accountId || !privateKey) {
      return res.status(400).json({ error: 'Missing required fields in request body' });
    }

    const balance = await getBalance(accountId, privateKey);

    res.status(200).json({ balance });
  } catch (error) {
    console.error('Error in /api/token/balance:', error);
    res.status(500).json({ error: 'Failed to get token balance' });
  }
});

// ✅ Updated Recursive Trace Route
app.post("/api/token/trace", async (req, res) => {
  const { accountId } = req.body;  // Account ID is now in the request body

  if (!accountId) {
    return res.status(400).json({ error: "Missing accountId" });
  }

  try {
    const traced = await fetchTransactions(accountId);  // Use the updated fetchTransactions
    res.status(200).json({ traced });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

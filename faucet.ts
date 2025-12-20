import { CdpClient } from "@coinbase/cdp-sdk";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const RECEIVER_WALLET_ADDRESS = process.env.EXTERNAL_WALLET_ADDRESS as string;
const NETWORK = 'base-sepolia'
const TOKEN = 'eth' // (Native token)

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logError(error: any): void {
  const errorType = error.errorType || 'unknown_error';
  const errorMessage = error.errorMessage || error.message || 'An unknown error occurred';
  const statusCode = error.statusCode || 'N/A';
  const errorLink = error.errorLink || '';

  console.log('\n' + '═'.repeat(60));
  console.log('  ⚠️  ERROR OCCURRED');
  console.log('═'.repeat(60));
  console.log(`  Type:        ${errorType}`);
  console.log(`  Status:      ${statusCode}`);
  console.log(`  Message:     ${errorMessage}`);

  if (errorLink) {
    console.log(`  Docs:        ${errorLink}`);
  }
  console.log('═'.repeat(60) + '\n');
}

async function withRetry(fn: () => Promise<any>) {
  let delay = 1000;
  while (true) {
    try {
      return await fn();
    } catch (e: any) {
      if (e.errorType === "rate_limit_exceeded") {
        await sleep(delay);
        delay *= 2;
        continue;
      }
      // Handle faucet limit exceeded error gracefully
      if (e.errorType === "faucet_limit_exceeded") {
        logError(e);
        return null; // Return null to signal limit reached
      }
      // Log other errors and rethrow
      logError(e);
      throw e;
    }
  }
}

async function requestFaucetFunds() {
  const cdp = new CdpClient();

  console.log('🚀 Starting faucet requests...\n');
  console.log(`📍 Network: ${NETWORK}`);
  console.log(`💰 Token: ${TOKEN.toUpperCase()}`);
  console.log(`👛 Wallet: ${RECEIVER_WALLET_ADDRESS}\n`);
  console.log('─'.repeat(60) + '\n');

  // do it for 1000 times
  for (let i = 0; i < 1000; i++) {
    try {
      const faucetResponse = await withRetry(async () => {
        return await cdp.evm.requestFaucet({
          address: RECEIVER_WALLET_ADDRESS,
          network: NETWORK,
          token: TOKEN,
        });
      });

      // Check if limit was reached
      if (faucetResponse === null) {
        console.log('\n' + '─'.repeat(60));
        console.log(`  ✅ Completed ${i} successful requests before limit reached`);
        console.log('  ⏸️  Faucet limit reached. Please try again later.');
        console.log('─'.repeat(60) + '\n');
        break;
      }

      console.log(`✅ Transaction ${i + 1}:`);
      console.log(`   🔗 https://sepolia.basescan.org/tx/${faucetResponse.transactionHash}\n`);
    } catch (error: any) {
      logError(error);
      console.log(`\n❌ Failed at request ${i + 1}. Exiting...\n`);
      process.exit(1);
    }
  }

  console.log('─'.repeat(60));
  console.log('  ✨ All requests completed successfully!');
  console.log('─'.repeat(60) + '\n');
}

// Run the faucet script
requestFaucetFunds().catch((error) => {
  logError(error);
  process.exit(1);
});

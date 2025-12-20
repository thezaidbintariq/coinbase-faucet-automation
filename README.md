# Coinbase Faucet Automation

An automated TypeScript script for requesting testnet tokens from the Coinbase Developer Platform (CDP) faucet on Base Sepolia. This script uses Bun runtime and the official Coinbase CDP SDK to automate faucet requests with built-in rate limit handling and retry logic.

## Overview

This script automates the process of requesting ETH testnet tokens from the Coinbase faucet. It will make 1000 faucet requests to your specified wallet address on the Base Sepolia testnet, with automatic retry logic for rate limit errors.

## Features

- 🚀 **Automated Requests**: Makes 1000 faucet requests automatically
- 🔄 **Rate Limit Handling**: Built-in exponential backoff retry logic for rate limit errors
- 🔐 **Secure**: Uses environment variables for sensitive credentials
- 📊 **Transaction Tracking**: Logs transaction hashes with BaseScan explorer links
- ⚡ **Fast**: Built with Bun for optimal performance

## Prerequisites

1. **Bun Runtime**: Install Bun from [bun.sh](https://bun.sh/)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Coinbase Developer Platform Account**: 
   - Sign up at [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com/)
   - Create an API key in the portal

3. **Base Sepolia Wallet**: A valid Ethereum wallet address on Base Sepolia testnet

## Installation

1. **Clone or navigate to the repository**:
   ```bash
   cd coinbase-faucet
   ```

2. **Install dependencies using Bun**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your credentials:
   ```env
   CDP_API_KEY_NAME=your_api_key_name_here
   CDP_API_KEY_PRIVATE_KEY=your_api_key_private_key_here
   EXTERNAL_WALLET_ADDRESS=0xYourWalletAddressHere
   ```

## Configuration

### Environment Variables

The script requires the following environment variables in your `.env` file:

| Variable | Description | Required |
|----------|-------------|----------|
| `CDP_API_KEY_NAME` | Your Coinbase Developer Platform API key name | Yes |
| `CDP_API_KEY_PRIVATE_KEY` | Your Coinbase Developer Platform API key private key | Yes |
| `EXTERNAL_WALLET_ADDRESS` | Ethereum wallet address to receive faucet funds | Yes |

### Script Configuration

You can modify the following constants in `faucet.ts`:

- `NETWORK`: Currently set to `'base-sepolia'` (Base Sepolia testnet)
- `TOKEN`: Currently set to `'eth'` (Native ETH token)
- Request count: Currently set to `1000` iterations (line 36)

## Usage

### Run the Faucet Script

```bash
bun run fund
```

Or directly:

```bash
bun faucet.ts
```

### What Happens

1. The script loads your environment variables
2. Initializes the Coinbase CDP client
3. Makes 1000 faucet requests to your specified wallet address
4. For each request:
   - Attempts to request ETH from the faucet
   - If rate limited, automatically retries with exponential backoff
   - Logs the transaction hash and BaseScan explorer link
5. Continues until all 1000 requests are completed

### Example Output

```
ETH faucet transaction 1:
https://sepolia.basescan.org/tx/0x1234...
ETH faucet transaction 2:
https://sepolia.basescan.org/tx/0x5678...
...
```

## How to Get API Credentials

1. **Visit Coinbase Developer Platform**:
   - Go to [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com/)

2. **Sign In or Create Account**:
   - Sign in with your Coinbase account or create a new one

3. **Navigate to API Keys**:
   - Go to the **API Keys** section in the portal

4. **Create a New API Key**:
   - Click "Create API Key"
   - Give it a descriptive name
   - Copy the **API Key Name** and **Private Key** immediately (the private key is only shown once)

5. **Add to `.env` File**:
   - Paste the API Key Name as `CDP_API_KEY_NAME`
   - Paste the Private Key as `CDP_API_KEY_PRIVATE_KEY`

## Network and Token Support

### Current Configuration

- **Network**: Base Sepolia (Testnet)
- **Token**: ETH (Native token)

### Supported Networks

The Coinbase CDP SDK supports multiple networks. You can modify the `NETWORK` constant in `faucet.ts` to use other supported networks.

### Supported Tokens

The script currently requests ETH, but you can modify the `TOKEN` constant to request other tokens supported by the faucet (e.g., USDC, EURC, cbBTC).

## Rate Limiting

The script includes built-in rate limit handling:

- **Automatic Retry**: When a rate limit error occurs, the script automatically retries
- **Exponential Backoff**: Starts with 1 second delay, doubles on each retry (1s, 2s, 4s, 8s, ...)
- **Error Handling**: Only retries on rate limit errors; other errors are thrown immediately

## Troubleshooting

### Common Issues

#### "Invalid API credentials"
- **Solution**: Verify that your `.env` file contains the correct `CDP_API_KEY_NAME` and `CDP_API_KEY_PRIVATE_KEY`
- Make sure there are no extra spaces or quotes around the values
- Ensure the API key is active in the Coinbase Developer Platform portal

#### "Wallet address not found" or "Invalid address"
- **Solution**: Verify that `EXTERNAL_WALLET_ADDRESS` is a valid Ethereum address
- Ensure the address is correctly formatted (starts with `0x` and is 42 characters long)
- The address should be a valid wallet on Base Sepolia

#### "Rate limit exceeded" (persistent)
- **Solution**: The script handles this automatically, but if it persists:
  - Wait a few minutes before running again
  - Reduce the number of iterations in the script
  - Check Coinbase Developer Platform for rate limit information

#### "Module not found" or "Cannot find package"
- **Solution**: Run `bun install` to install all dependencies
- Ensure you're using Bun (not Node.js)

#### Script exits immediately
- **Solution**: Check that all required environment variables are set in your `.env` file
- Verify the `.env` file is in the project root directory
- Check console for error messages

## Development

### Project Structure

```
coinbase-faucet/
├── faucet.ts          # Main script file
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── .env.example       # Environment variables template
├── .env               # Your environment variables (not in git)
└── README.md          # This file
```

### Dependencies

- `@coinbase/cdp-sdk`: Official Coinbase Developer Platform SDK
- `dotenv`: Environment variable management
- `typescript`: TypeScript support
- `@types/node`: Node.js type definitions

### Scripts

- `bun run fund`: Runs the faucet script (alias for `bun faucet.ts`)

### Modifying the Script

To customize the script:

1. **Change the number of requests**: Modify the loop count on line 36
2. **Change the network**: Update the `NETWORK` constant on line 8
3. **Change the token**: Update the `TOKEN` constant on line 9
4. **Modify retry logic**: Adjust the `withRetry` function (lines 15-29)
5. **Change delay timing**: Modify the `sleep` function or retry delay logic

## Security Best Practices

1. **Never commit `.env` file**: The `.env` file is gitignored and should never be committed
2. **Protect API keys**: Keep your API keys secure and never share them
3. **Use testnet**: This script is designed for testnet use only
4. **Rotate keys**: Regularly rotate your API keys if compromised
5. **Review permissions**: Ensure your API keys have only necessary permissions

## Limitations

- The script makes 1000 requests sequentially, which may take some time
- Rate limits are handled automatically but may slow down execution
- This is for testnet use only - do not use on mainnet
- Each faucet request may have daily/hourly limits set by Coinbase

## Contributing

Feel free to submit issues or pull requests to improve this script.

## License

MIT

## Additional Resources

- [Coinbase Developer Platform Documentation](https://docs.cdp.coinbase.com/)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Bun Documentation](https://bun.sh/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

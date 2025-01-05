# create-dapp-kit

Create a Next.js Web3 dapp with Wagmi and ConnectKit in seconds.

## Features

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Wagmi for Ethereum interactions
- ConnectKit for wallet connection
- ESLint configured
- Ready to use with WalletConnect

## Quick Start

```bash
npx create-dapp-kit my-dapp
cd my-dapp
npm run dev
```

## What's included?

- Next.js 13+ setup with App Router
- TypeScript and ESLint configuration
- Tailwind CSS for styling
- shadcn/ui for beautiful, accessible components
- Wagmi hooks for Ethereum interactions
- ConnectKit for beautiful wallet connection
- Pre-configured with mainnet and sepolia networks
- Environment variables setup for WalletConnect
- Ready-to-use UI components and layouts

## Requirements

Before running this, make sure you have:
1. Node.js 18.18.0 or later
2. A WalletConnect Project ID (get one from https://cloud.walletconnect.com)

## Configuration

The generated project will ask for your WalletConnect Project ID during setup. This will be saved in `.env.local`.

You can customize:
- Chains and RPC URLs in `src/providers.tsx`
- UI components using shadcn/ui's CLI
- Theme and styling through Tailwind configuration

## License

MIT 
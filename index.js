// Import required modules
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function promptWalletConnectId() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Please enter your WalletConnect Project ID (from https://cloud.walletconnect.com): ', (projectId) => {
      rl.close();
      resolve(projectId);
    });
  });
}

function configureWagmi() {
  const wagmiConfigContent = `'use client';

import { createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    appName: 'My Web3 App',
    chains: [mainnet, goerli],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  })
);

export function WagmiProvider({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
};
`;

  const layoutContent = `import './globals.css';
import { WagmiProvider } from '../wagmi';

export const metadata = {
  title: 'Web3 App',
  description: 'Created with create-better-wagmi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{
          \`
          /* Override ConnectKit's empty href styles */
          a[href=""] {
            pointer-events: none;
            text-decoration: none;
          }
          \`
        }</style>
      </head>
      <body suppressHydrationWarning={true}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}
`;

  const pageContent = `'use client';

import { ConnectKitButton } from 'connectkit';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-center">
        <h1 className="mb-8 text-4xl font-bold">Welcome to Your Web3 App</h1>
        <div className="flex justify-center">
          <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName, truncatedAddress }) => {
              return (
                <button
                  onClick={show}
                  type="button"
                  className="rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 transition-colors"
                >
                  {isConnected ? (ensName ?? truncatedAddress ?? address) : "Connect Wallet"}
                </button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </main>
  );
}
`;

  // Create src directory if it doesn't exist
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
  }

  // Create app directory if it doesn't exist
  const appDir = path.join(srcDir, 'app');
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir);
  }

  fs.writeFileSync(path.join(process.cwd(), 'src/wagmi.js'), wagmiConfigContent);
  fs.writeFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), layoutContent);
  fs.writeFileSync(path.join(process.cwd(), 'src/app/page.tsx'), pageContent);

  // Install additional dependency for pino-pretty
  console.log('Installing additional dependencies...');
  execSync('npm install pino-pretty', { stdio: 'inherit' });
}

async function bootstrapProject(projectName) {
  try {
    // Get WalletConnect Project ID
    const walletConnectId = await promptWalletConnectId();

    // Step 1: Create Next.js app
    console.log('Creating Next.js project...');
    execSync(`npx create-next-app@latest ${projectName} --typescript --eslint --use-npm --tailwind --src-dir --app --no-turbopack --import-alias "@/*"`, { stdio: 'inherit' });

    const projectPath = path.join(process.cwd(), projectName);
    process.chdir(projectPath);

    // Create .env.local with WalletConnect Project ID
    fs.writeFileSync('.env.local', `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="${walletConnectId}"`);

    // Step 2: Install dependencies
    console.log('Installing dependencies: shadcn/ui, wagmi, and connectkit...');
    execSync('npm install react@18 react-dom@18 && npm install @shadcn/ui wagmi viem connectkit @tanstack/react-query --legacy-peer-deps', { stdio: 'inherit' });

    // Step 3: Set up ShadCN/UI
    console.log('Setting up ShadCN/UI...');
    configureWagmi();

    console.log('Project setup complete!');
    console.log(`
Next steps:
  1. cd ${projectName}
  2. npm run dev
  3. Customize your project as needed.

Your WalletConnect Project ID has been added to .env.local
`);
  } catch (error) {
    console.error('Error during project setup:', error);
  }
}

// CLI Entry Point
const projectName = process.argv[2];
if (!projectName) {
  console.error('Please provide a project name.');
  process.exit(1);
}

bootstrapProject(projectName);


'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { getCheckoutPage } from '../../../utils/database';
import Image from 'next/image';
import { FaEnvelope, FaMapMarkerAlt, FaWallet, FaCopy, FaCheck } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

// Make sure to import the required CSS for the wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

interface CheckoutPageData {
  id: number;
  storeName: string;
  storeLogo: string | null;
  productName: string;
  productDetails: string;
  productImage: string | null;
  productPrice: string;
  walletAddress: string;
  email: string;
  address: string | null;
}

export default function CheckoutPage() {
  const params = useParams();
  const id = params.id as string;
  const [pageData, setPageData] = useState<CheckoutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCheckoutPage();
    }
  }, [id]);

  const fetchCheckoutPage = async () => {
    try {
      const data = await getCheckoutPage(Number(id));
      setPageData(data);
    } catch (err) {
      setError('Failed to load checkout page');
    } finally {
      setLoading(false);
    }
  };

  // Set up Solana wallet adapter for Devnet
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!pageData) return <ErrorMessage message="Checkout page not found" />;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CheckoutPageContent pageData={pageData} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
}

function CheckoutPageContent({ pageData }: { pageData: CheckoutPageData }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const handleWalletAction = async () => {
    setVisible(true);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handlePayNow = async () => {
    if (!publicKey || !connection) {
      setTransactionError("Wallet not connected");
      return;
    }

    setIsProcessing(true);
    setTransactionError(null);

    try {
      const usdcMint = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
      const amount = BigInt(Math.round(parseFloat(pageData.productPrice) * 1_000_000)); // USDC has 6 decimal places

      const buyerTokenAccount = await getAssociatedTokenAddress(usdcMint, publicKey);
      const sellerPublicKey = new PublicKey(pageData.walletAddress);
      const sellerTokenAccount = await getAssociatedTokenAddress(usdcMint, sellerPublicKey);

      let transaction = new Transaction();

      // Check if buyer's token account exists, if not, create it
      const buyerAccountInfo = await connection.getAccountInfo(buyerTokenAccount);
      if (!buyerAccountInfo) {
        console.log("Creating associated token account for buyer");
        const createBuyerATAInstruction = createAssociatedTokenAccountInstruction(
          publicKey,
          buyerTokenAccount,
          publicKey,
          usdcMint
        );
        transaction.add(createBuyerATAInstruction);
      }

      // Check if seller's token account exists, if not, create it
      const sellerAccountInfo = await connection.getAccountInfo(sellerTokenAccount);
      if (!sellerAccountInfo) {
        console.log("Creating associated token account for seller");
        const createSellerATAInstruction = createAssociatedTokenAccountInstruction(
          publicKey,
          sellerTokenAccount,
          sellerPublicKey,
          usdcMint
        );
        transaction.add(createSellerATAInstruction);
      }

      // Add transfer instruction
      const transferInstruction = createTransferInstruction(
        buyerTokenAccount,
        sellerTokenAccount,
        publicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      );
      transaction.add(transferInstruction);

      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Simulate the transaction
      const simulation = await connection.simulateTransaction(transaction);

      if (simulation.value.err) {
        console.error("Transaction simulation failed:", simulation.value.logs);
        throw new Error("Transaction simulation failed: " + JSON.stringify(simulation.value.err));
      }

      // If simulation is successful, send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      console.log("Transaction successful:", signature);
      setTransactionSuccess(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionError((error as Error).message || "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left column */}
          <div className="md:w-1/3 bg-blue-600 text-white p-8 flex flex-col justify-between">
            {/* Existing left column content */}
            <div>
              <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden mb-6 shadow-lg transition-transform hover:scale-105">
                {pageData.storeLogo ? (
                  <Image
                    src={pageData.storeLogo}
                    alt={pageData.storeName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{pageData.storeName.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2 text-center">{pageData.storeName}</h1>
              <p className="text-blue-200 mb-6 text-center">{pageData.productName}</p>
            </div>
            <div className="text-sm">
              <p className="flex items-center mb-2"><FaEnvelope className="mr-2" />{pageData.email}</p>
              {pageData.address && (
                <p className="flex items-center"><FaMapMarkerAlt className="mr-2" />{pageData.address}</p>
              )}
            </div>
          </div>
          {/* Right column */}
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              {pageData.productImage && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                  <Image
                    src={pageData.productImage}
                    alt={pageData.productName}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{pageData.productName}</h2>
              <p className="text-gray-600 mb-4">{pageData.productDetails}</p>
              <p className="text-3xl font-bold text-blue-600">${pageData.productPrice} USDC</p>
            </div>
            <div className="bg-white p-4 rounded-md mb-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                <FaWallet className="mr-2 text-blue-600" />
                Seller's Wallet
              </h3>
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                <p className="text-gray-700 font-mono text-sm break-all mr-2">{pageData.walletAddress}</p>
                <button
                  onClick={() => copyToClipboard(pageData.walletAddress)}
                  className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
                  title="Copy full address"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                </button>
              </div>
            </div>
            <button
              onClick={handleWalletAction}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              {publicKey ? 'Disconnect Wallet' : 'Select Wallet'}
            </button>
            {publicKey && !transactionSuccess && (
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full mt-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            )}
            {transactionSuccess && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Thank you for your purchase! </strong>
                <span className="block sm:inline">Your transaction was successful. Thanks for shopping with us.</span>
              </div>
            )}
            {transactionError && (
              <p className="mt-2 text-red-500 text-sm">{transactionError}</p>
            )}
          </div>
        </div>
        <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
          <p>© 2024 {pageData.storeName}. All rights reserved.</p>
          <p className="mt-1">Powered by GlobalGear</p>
        </footer>
      </div>
    </div>
  );
}

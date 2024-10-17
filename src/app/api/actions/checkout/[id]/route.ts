import { NextResponse } from 'next/server';
import { ActionGetResponse, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { getCheckoutPage } from '@/utils/database';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL, 
  VersionedTransaction,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction, 
  TOKEN_PROGRAM_ID, 
  createAssociatedTokenAccountInstruction,
  getAccount
} from "@solana/spl-token";

// Correct Devnet USDC token address
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const pageData = await getCheckoutPage(Number(id));

    if (!pageData) {
      console.error(`Checkout page not found for id: ${id}`);
      return NextResponse.json({ error: "Checkout page not found" }, {
        status: 404,
        headers: {
          ...ACTIONS_CORS_HEADERS,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const payload: ActionGetResponse = {
      icon: pageData.productImage || pageData.storeLogo || "",
      title: pageData.productName,
      description: `${pageData.productDetails.slice(0, 100)}...`,
      label: `Buy for $${pageData.productPrice} USDC`,
    };

    return NextResponse.json(payload, {
      headers: {
        ...ACTIONS_CORS_HEADERS,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ error: "Internal server error" }, {
      status: 500,
      headers: {
        ...ACTIONS_CORS_HEADERS,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const POST = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  
  try {
    const { account } = await req.json();
    console.log(`Received POST request for id: ${id}, account: ${account}`);

    const pageData = await getCheckoutPage(Number(id));

    if (!pageData) {
      console.error(`Checkout page not found for id: ${id}`);
      return NextResponse.json({ error: "Checkout page not found" }, {
        status: 404,
        headers: {
          ...ACTIONS_CORS_HEADERS,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const buyerPublicKey = new PublicKey(account);
    const sellerPublicKey = new PublicKey(pageData.walletAddress);
    
    // Calculate USDC amount (USDC has 6 decimal places)
    const amount = BigInt(Math.round(parseFloat(pageData.productPrice) * 1_000_000));

    console.log(`Creating transaction for ${amount} USDC from ${buyerPublicKey.toBase58()} to ${sellerPublicKey.toBase58()}`);

    let transaction = new Transaction();

    try {
      const buyerTokenAccount = await getAssociatedTokenAddress(USDC_MINT, buyerPublicKey);
      const sellerTokenAccount = await getAssociatedTokenAddress(USDC_MINT, sellerPublicKey);

      console.log(`Buyer token account: ${buyerTokenAccount.toBase58()}`);
      console.log(`Seller token account: ${sellerTokenAccount.toBase58()}`);

      // Check if buyer has enough USDC
      try {
        const buyerAccount = await getAccount(connection, buyerTokenAccount);
        console.log(`Buyer USDC balance: ${buyerAccount.amount}`);
        if (BigInt(buyerAccount.amount) < amount) {
          throw new Error("Insufficient USDC balance");
        }
      } catch (error) {
        console.error("Error checking buyer USDC balance:", error);
        if (error instanceof Error && error.message.includes("could not find account")) {
          console.log("Buyer token account does not exist, will be created in the transaction");
        } else {
          throw new Error("Failed to verify USDC balance");
        }
      }

      // Check and create token accounts if necessary
      const buyerAccountInfo = await connection.getAccountInfo(buyerTokenAccount);
      if (!buyerAccountInfo) {
        console.log("Creating buyer associated token account");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            buyerPublicKey,
            buyerTokenAccount,
            buyerPublicKey,
            USDC_MINT
          )
        );
      }

      const sellerAccountInfo = await connection.getAccountInfo(sellerTokenAccount);
      if (!sellerAccountInfo) {
        console.log("Creating seller associated token account");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            buyerPublicKey,
            sellerTokenAccount,
            sellerPublicKey,
            USDC_MINT
          )
        );
      }

      // Add transfer instruction
      console.log("Adding transfer instruction");
      transaction.add(
        createTransferInstruction(
          buyerTokenAccount,
          sellerTokenAccount,
          buyerPublicKey,
          amount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = buyerPublicKey;

      // Log the complete transaction for debugging
      console.log("Complete transaction:", JSON.stringify(transaction, null, 2));

      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          type: 'transaction',
          transaction,
          message: `Purchase of ${pageData.productName} for $${pageData.productPrice} USDC`,
        },
      });

      console.log("Transaction created successfully");

      return NextResponse.json(payload, {
        headers: {
          ...ACTIONS_CORS_HEADERS,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      return NextResponse.json(
        { 
          error: "Failed to create transaction", 
          details: error instanceof Error ? error.message : String(error) 
        },
        { status: 500, headers: {
          ...ACTIONS_CORS_HEADERS,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: {
        ...ACTIONS_CORS_HEADERS,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const OPTIONS = async () => {
  return NextResponse.json({}, {
    headers: {
      ...ACTIONS_CORS_HEADERS,
      'Access-Control-Allow-Origin': '*',
    },
  });
};

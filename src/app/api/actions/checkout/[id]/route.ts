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

// Update the USDC mint address constant
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Update the connection to use mainnet
const connection = new Connection(process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL || 'https://api.mainnet-beta.solana.com', 'confirmed');

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

    try {
      // Create new transaction
      const transaction = new Transaction();

      // Get token accounts
      const buyerTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        buyerPublicKey
      );

      const sellerTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        sellerPublicKey
      );

      // Check if seller account exists and create if necessary
      const sellerAccountInfo = await connection.getAccountInfo(sellerTokenAccount);

      if (!sellerAccountInfo) {
        console.log("Adding instruction to create seller's token account");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            buyerPublicKey, // payer
            sellerTokenAccount, // ata
            sellerPublicKey, // owner
            USDC_MINT // mint
          )
        );
      }

      // Add transfer instruction
      console.log("Adding transfer instruction");
      transaction.add(
        createTransferInstruction(
          buyerTokenAccount, // source
          sellerTokenAccount, // destination
          buyerPublicKey, // owner
          amount // amount
        )
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = buyerPublicKey;

      // Create the payload
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          type: 'transaction',
          transaction: transaction,
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
        { 
          status: 500, 
          headers: {
            ...ACTIONS_CORS_HEADERS,
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { 
        status: 500, 
        headers: {
          ...ACTIONS_CORS_HEADERS,
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
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

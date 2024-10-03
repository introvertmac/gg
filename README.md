# GlobalGear - E-commerce Project with PYUSD and Solana 

GlobalGear is a modern e-commerce platform built with Next.js, showcasing a collection of branded merchandise. This project demonstrates the integration of blockchain technology for payments using the Portal API, PYUSD stablecoin, and Solana blockchain.

## Features

- **Product Catalog**: Display a grid of products with details and images.
- **Shopping Cart**: Add products to cart, adjust quantities, and remove items.
- **Wallet Integration**: Connect to Portal wallet for Solana-based transactions.
- **Checkout Process**: Secure checkout using PYUSD tokens on the Solana blockchain.
- **Order Confirmation**: View order details and transaction information.
- **Order History**: Access a list of past orders and their details.
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Portal API (for Solana wallet integration and PYUSD transactions)
- Solana Web3.js
- PYUSD (PayPal USD stablecoin on Solana)
- Airtable (for order management and history)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/introvertmac/globalgear.git
   cd globalgear
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_PORTAL_API_KEY=[Your Portal API Key]
   NEXT_PUBLIC_SOLANA_CHAIN_ID=[Solana Chain ID]
   NEXT_PUBLIC_SOLANA_RPC_URL=[Solana RPC URL]
   NEXT_PUBLIC_SOL_MINT=[SOL Mint Address]
   NEXT_PUBLIC_PYUSD_MINT=[PYUSD Mint Address]
   AIRTABLE_API_KEY=[Your Airtable API Key]
   AIRTABLE_BASE_ID=[Your Airtable Base ID]
   AIRTABLE_TABLE_NAME=[Your Airtable Table Name]
   ```

   Note: 
   - For Portal API related variables (NEXT_PUBLIC_PORTAL_API_KEY, NEXT_PUBLIC_SOLANA_CHAIN_ID, NEXT_PUBLIC_SOLANA_RPC_URL), sign up at [Portal](https://www.portalhq.io/) to obtain the necessary credentials.
   - For NEXT_PUBLIC_SOL_MINT and NEXT_PUBLIC_PYUSD_MINT, use the appropriate token mint addresses for SOL and PYUSD on the Solana network you're using (mainnet, devnet, or testnet).
   - For Airtable related variables, sign up at [Airtable](https://airtable.com/) and create a base with the structure described in the "Airtable Structure" section below.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `pages/`: Contains Next.js pages and API routes.
- `components/`: Reusable React components.
- `context/`: React context providers for global state management.
- `config/`: Configuration files, including product data and Portal API settings.
- `styles/`: Global styles and Tailwind CSS configuration.
- `public/`: Static assets like images.

## Airtable Structure

The project uses Airtable for order management and history. The Airtable base consists of a single table with the following structure:

- `id`: Unique identifier for each order (Text)
- `customerEmail`: Email address of the customer (Email)
- `orderDate`: Date and time of the order (DateTime)
- `totalAmount`: Total amount of the order in PYUSD (Number)
- `status`: Current status of the order (e.g., "Pending", "Shipped", "Delivered") (Single Select)
- `items`: JSON string containing the ordered items (Long Text)
- `shippingAddress`: JSON string containing the shipping address details (Long Text)
- `transactionHash`: Solana transaction hash for the payment (Text)

This structure allows for efficient storage and retrieval of order information, enabling features like order history and status tracking.

## Deployment

The project is ready to be deployed on platforms like Vercel or Netlify. Make sure to set up the environment variables in your deployment platform's settings, including the necessary Portal API, Solana, and PYUSD configurations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
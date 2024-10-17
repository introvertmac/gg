# GlobalGear - Solana Checkout for Global Commerce

GlobalGear is a Next.js-based web application that provides a seamless, secure, and lightning-fast checkout experience for global businesses using Solana blockchain technology.

## Features

- User authentication with Google OAuth
- Dashboard for managing checkout pages
- Creation of custom checkout pages
- Solana wallet integration for payments
- Multi-currency support
- Responsive design for various devices

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Solana Wallet Adapter
- Drizzle ORM
- Neon Database (PostgreSQL)
- Cloudinary (for image storage)
- Axios (for API requests)
- React Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/globalgear.git
   cd globalgear
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   NEXT_PUBLIC_DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   OKTO_API_URL=https://sandbox-api.okto.tech/api/v1
   ```

   Replace the placeholder values with your actual credentials.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Migration

To set up the database schema, run the migration script:

```bash
npm run migrate
# or
yarn migrate
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](
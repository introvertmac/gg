import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

neonConfig.fetchConnectionCache = true;

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error('NEXT_PUBLIC_DATABASE_URL is not set in the environment variables');
}

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
const db = drizzle(sql);

const checkoutPages = pgTable('checkout_pages', {
  id: serial('id').primaryKey(),
  storeName: text('store_name').notNull(),
  storeLogo: text('store_logo'),
  productName: text('product_name').notNull(),
  productDetails: text('product_details').notNull(),
  productImage: text('product_image'),
  productPrice: varchar('product_price', { length: 20 }).notNull(),
  walletAddress: text('wallet_address').notNull(),
  email: text('email').notNull(),
  address: text('address'),
});

export const createCheckoutPage = async (data: Omit<typeof checkoutPages.$inferInsert, 'id'>) => {
  const result = await db.insert(checkoutPages).values(data).returning({ id: checkoutPages.id });
  return result[0].id;
};

export const getCheckoutPage = async (id: number) => {
  const result = await db.select().from(checkoutPages).where(eq(checkoutPages.id, id)).limit(1);
  return result[0] || null;
};

CREATE TABLE IF NOT EXISTS checkout_pages (
  id SERIAL PRIMARY KEY,
  store_name TEXT NOT NULL,
  store_logo TEXT,
  product_name TEXT NOT NULL,
  product_details TEXT NOT NULL,
  product_image TEXT,
  product_price VARCHAR(20) NOT NULL,
  wallet_address TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT
);
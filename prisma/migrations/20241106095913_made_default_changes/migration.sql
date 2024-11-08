-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "ratingSum" SET DEFAULT 0,
ALTER COLUMN "ratingTotal" SET DEFAULT 0,
ALTER COLUMN "categories" SET DEFAULT ARRAY[]::"Category"[];

-- AlterTable
ALTER TABLE "Salt" ALTER COLUMN "power" SET DEFAULT 0;

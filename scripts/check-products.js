/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('../app/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.product.count();
    console.log(`Total products: ${count}`);

    if (count > 0) {
      const products = await prisma.product.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          isActive: true,
          featured: true,
          createdAt: true,
          comparePrice: true,
          price: true,
          images: true,
          category: {
            select: {
              name: true
            }
          }
        }
      });
      console.log('First 5 products:', JSON.stringify(products, null, 2));
    } else {
        console.log('No products found in the database.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

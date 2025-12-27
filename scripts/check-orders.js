
const { PrismaClient } = require('../app/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orderItems: true,
        user: true
      }
    });
    console.log(`Total orders: ${orders.length}`);
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}: ${order.orderNumber}, userId: ${order.userId}, customer: ${order.customerName}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

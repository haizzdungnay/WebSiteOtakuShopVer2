import { PrismaClient } from './app/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      price: true,
      isActive: true
    }
  })

  console.log('\n📦 PRODUCTS IN DATABASE:\n')
  products.forEach(p => {
    console.log(`ID: ${p.id}`)
    console.log(`Name: ${p.name}`)
    console.log(`Price: ${p.price}`)
    console.log(`Active: ${p.isActive}`)
    console.log('---')
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error)

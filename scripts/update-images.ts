
import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting product image update...')

  // Fetch all products
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      category: {
        select: {
          name: true
        }
      }
    }
  })

  console.log(`📦 Found ${products.length} products.`)

  let updatedCount = 0

  for (const product of products) {
    // Generate image URL based on product name
    // Using Pollinations.ai to generate/search image by prompt
    const prompt = `anime figure ${product.name} high quality detailed product shot white background`
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${product.id}&model=flux`

    // Update product
    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: [imageUrl]
      }
    })

    updatedCount++
    if (updatedCount % 10 === 0) {
      console.log(`✅ Updated ${updatedCount}/${products.length} products`)
    }
  }

  console.log(`\n🎉 Successfully updated images for ${updatedCount} products!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

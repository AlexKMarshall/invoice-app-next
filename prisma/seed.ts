import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('generating seeds...')
  const postOne = await prisma.post.create({
    data: {
      title: 'Building a full stack app with NextJS and Prisma',
      content: 'Best practices for setting up the project',
    },
  })
  const postTwo = await prisma.post.create({
    data: {
      title:
        'Setting up for success with linting, formatting and type checking',
      content: 'Clean code from the start',
    },
  })

  console.log('Generated seeds', [postOne, postTwo])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

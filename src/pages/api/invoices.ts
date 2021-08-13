import { NextApiRequest, NextApiResponse } from 'next'

import { GetInvoiceSummary } from 'src/shared/dtos'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import faker from 'faker'

// import prisma from 'src/server/prisma'

function randomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

function buildMockInvoiceSummary() {
  return {
    id: faker.datatype.uuid(),
    paymentDue: faker.date.soon(),
    clientName: faker.name.findName(),
    total: faker.datatype.number(),
    status: randomStatus(),
  }
}

const mockInvoices = [
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetInvoiceSummary>
) {
  // const posts = await prisma.post.findMany({})

  res.status(200).json({
    data: {
      invoices: mockInvoices,
    },
  })
}

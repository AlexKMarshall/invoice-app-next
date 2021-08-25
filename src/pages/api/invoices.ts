import { GetInvoiceSummaryDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'
import { NextApiRequest, NextApiResponse } from 'next'

// import { Merge } from 'type-fest'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import faker from 'faker'
import { generateInvoiceId } from 'src/client/shared/utils'

// import prisma from 'src/server/prisma'

function randomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

function buildMockInvoiceSummary() {
  return {
    id: generateInvoiceId(),
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

type CustomNextApiRequest = NextApiRequest

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse<GetInvoiceSummaryDTO | NewInvoiceReturnDTO>
): Promise<void> {
  // const posts = await prisma.post.findMany({})
  switch (req.method) {
    case 'GET':
      res.status(200).json({
        data: {
          invoices: mockInvoices,
        },
      })
      return
    case 'POST':
      res.status(201).json({
        data: {
          savedInvoice: { id: generateInvoiceId(), ...req.body },
        },
      })
      return
    default:
      return
  }
}

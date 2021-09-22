import {
  DrawerContainer,
  DrawerOverlayContainer,
  DrawerProvider,
} from '../shared/components/drawer'
import { NewInvoiceInputDTO, UpdateInvoiceInputDTO } from 'src/shared/dtos'
import { QueryClient, QueryClientProvider } from 'react-query'
import { render as rtlRender, screen, within } from '@testing-library/react'

import { FunctionComponent } from 'react'
import { ScreenReaderNotificationProvider } from '../shared/components/screen-reader-notification'
import { format } from 'date-fns'
import userEvent from '@testing-library/user-event'

// eslint-disable-next-line @typescript-eslint/ban-types
const Providers: FunctionComponent<{}> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ScreenReaderNotificationProvider>
        <DrawerProvider>
          <DrawerOverlayContainer>{children}</DrawerOverlayContainer>
          <DrawerContainer />
        </DrawerProvider>
      </ScreenReaderNotificationProvider>
    </QueryClientProvider>
  )
}

type UI = Parameters<typeof rtlRender>[0]
type RenderOptions = Parameters<typeof rtlRender>[1]
type RenderResult = ReturnType<typeof rtlRender>
function render(ui: UI, options: RenderOptions = {}): RenderResult {
  return rtlRender(ui, { wrapper: Providers, ...options })
}

export function validateTextfieldEntry(
  field: HTMLElement,
  entryValue: string | undefined,
  expectedValue: string | number | undefined = entryValue
): void {
  if (!entryValue) return
  userEvent.clear(field)
  userEvent.type(field, entryValue)
  expect(field).toHaveValue(expectedValue)
}

export function fillInInvoiceForm(
  invoice: NewInvoiceInputDTO | UpdateInvoiceInputDTO
): void {
  const elBillFromGroup = screen.getByRole('group', { name: /bill from/i })
  const inBillFrom = within(elBillFromGroup)

  validateTextfieldEntry(
    inBillFrom.getByLabelText(/street address/i),
    invoice.senderAddress.street
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/city/i),
    invoice.senderAddress.city
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/post code/i),
    invoice.senderAddress.postcode
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/country/i),
    invoice.senderAddress.country
  )

  const elBillToGroup = screen.getByRole('group', { name: /bill to/i })
  const inBillTo = within(elBillToGroup)

  validateTextfieldEntry(
    inBillTo.getByLabelText(/client's name/i),
    invoice.clientName
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/client's email/i),
    invoice.clientEmail
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/street address/i),
    invoice.senderAddress.street
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/city/i),
    invoice.senderAddress.city
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/post code/i),
    invoice.senderAddress.postcode
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/country/i),
    invoice.senderAddress.country
  )

  validateTextfieldEntry(
    screen.getByLabelText(/issue date/i),
    format(invoice.issuedAt, 'yyyy-MM-dd')
  )
  validateTextfieldEntry(
    screen.getByLabelText(/payment terms/i),
    invoice.paymentTerms.toString(),
    invoice.paymentTerms
  )
  validateTextfieldEntry(
    screen.getByLabelText(/project description/i),
    invoice.projectDescription
  )

  const elItemList = screen.getByRole('table', { name: /item list/i })
  const inItemList = within(elItemList)

  invoice.itemList.forEach((item) => {
    userEvent.click(screen.getByRole('button', { name: /add new item/i }))

    const [lastRow] = inItemList.getAllByRole('row').slice(-1)
    const inLastRow = within(lastRow)

    validateTextfieldEntry(inLastRow.getByLabelText(/item name/i), item.name)
    validateTextfieldEntry(
      inLastRow.getByLabelText(/quantity/i),
      item.quantity.toString(),
      item.quantity
    )
    validateTextfieldEntry(
      inLastRow.getByLabelText(/price/i),
      item.price.toString(),
      item.price
    )
  })
}

export * from '@testing-library/react'
export { render, userEvent }
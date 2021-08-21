import { useFieldArray, useForm } from 'react-hook-form'

import { InvoiceDetail } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { format } from 'date-fns'
import { useCreateInvoice } from './invoice.queries'
import { useId } from '@react-aria/utils'

type Props = {
  onSubmit?: (data: NewInvoiceInputDTO) => void
  onSubmitSuccess?: (data: InvoiceDetail) => void
}

type NewInvoiceFormFields = Omit<NewInvoiceInputDTO, 'status'>

const DEFAULT_ITEM_VALUES = { name: '', quantity: 0, price: 0 }
const DEFAULT_FORM_VALUES = {
  senderAddress: {
    street: '',
    city: '',
    postcode: '',
    country: '',
  },
  clientName: '',
  clientEmail: '',
  clientAddress: {
    street: '',
    city: '',
    postcode: '',
    country: '',
  },
  issuedAt: format(new Date(), 'yyyy-MM-dd') ?? '',
  paymentTerms: 0,
  projectDescription: '',
  itemList: [DEFAULT_ITEM_VALUES],
}

export function NewInvoiceForm({
  onSubmit,
  onSubmitSuccess,
}: Props): JSX.Element {
  const createInvoiceMutation = useCreateInvoice({
    onSuccess: (savedInvoice) => {
      onSubmitSuccess?.(savedInvoice)
    },
  })
  const formHeadingId = useId()
  const billFromHeadingId = useId()
  const billToHeadingId = useId()
  const itemListHeadingId = useId()
  const { register, handleSubmit, control } = useForm<NewInvoiceFormFields>({
    defaultValues: DEFAULT_FORM_VALUES,
  })
  const itemsFieldArray = useFieldArray({
    control,
    name: 'itemList',
  })

  return (
    <form
      aria-labelledby={formHeadingId}
      onSubmit={handleSubmit((data) => {
        createInvoiceMutation.mutate({ status: 'draft', ...data })
        onSubmit?.({ ...data, status: 'draft' })
      })}
    >
      <h2 id={formHeadingId}>New Invoice</h2>
      <section aria-labelledby={billFromHeadingId}>
        <h3 id={billFromHeadingId}>Bill From</h3>
        <label>
          <span>Street Address</span>
          <input type="text" {...register('senderAddress.street')} />
        </label>
        <label>
          <span>City</span>
          <input type="text" {...register('senderAddress.city')} />
        </label>
        <label>
          <span>Post Code</span>
          <input type="text" {...register('senderAddress.postcode')} />
        </label>
        <label>
          <span>Country</span>
          <input type="text" {...register('senderAddress.country')} />
        </label>
      </section>
      <section aria-labelledby={billToHeadingId}>
        <h3 id={billToHeadingId}>Bill To</h3>
        <label>
          <span>Client&apos;s Name</span>
          <input type="text" {...register('clientName')} />
        </label>
        <label>
          <span>Client&apos;s Email</span>
          <input type="text" {...register('clientEmail')} />
        </label>
        <label>
          <span>Street Address</span>
          <input type="text" {...register('clientAddress.street')} />
        </label>
        <label>
          <span>City</span>
          <input type="text" {...register('clientAddress.city')} />
        </label>
        <label>
          <span>Post Code</span>
          <input type="text" {...register('clientAddress.postcode')} />
        </label>
        <label>
          <span>Country</span>
          <input type="text" {...register('clientAddress.country')} />
        </label>
      </section>
      <section>
        <label>
          <span>Issue Date</span>
          <input
            type="date"
            {...register('issuedAt', {
              valueAsDate: true,
            })}
          />
        </label>
        <label>
          <span>Payment Terms</span>
          <input
            type="number"
            {...register('paymentTerms', { valueAsNumber: true })}
          />
        </label>
        <label>
          <span>Project Description</span>
          <input type="text" {...register('projectDescription')} />
        </label>
      </section>
      <section>
        <h3 id={itemListHeadingId}>Item List</h3>
        <ul aria-labelledby={itemListHeadingId}>
          {itemsFieldArray.fields.map((item, index) => (
            <li key={item.id} style={{ display: 'flex' }}>
              <label>
                <span>Item Name</span>
                <input
                  type="text"
                  defaultValue={`${item.name}`}
                  {...register(`itemList.${index}.name`)}
                />
              </label>
              <label>
                <span>Qty.</span>
                <input
                  type="number"
                  defaultValue={`${item.quantity}`}
                  {...register(`itemList.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </label>
              <label>
                <span>Price</span>
                <input
                  type="number"
                  defaultValue={`${item.price}`}
                  {...register(`itemList.${index}.price`, {
                    valueAsNumber: true,
                  })}
                />
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => itemsFieldArray.append(DEFAULT_ITEM_VALUES)}
        >
          Add New Item
        </button>
      </section>
      <button type="submit">Save as Draft</button>
    </form>
  )
}

import {
  buttonGroup,
  fieldset,
  fieldsetHeader,
  form,
  gridWrapper,
  itemListHeader,
  spanFull,
  spanHalf,
  spanThird,
  table,
  tableInput,
  th,
} from './new-invoice-form.css'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from 'src/client/shared/components/button'
import { Input } from 'src/client/shared/components/input'
import { InvoiceDetail } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { format } from 'date-fns'
import { newInvoiceInputDtoSchema } from 'src/shared/invoice.schema'
import { useCreateInvoice } from './invoice.queries'
import { useId } from '@react-aria/utils'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
  onCancel?: () => void
  onSubmit?: (data: NewInvoiceInputDTO) => void
  onSubmitSuccess?: (data: InvoiceDetail) => void
  'aria-labelledby': string
}

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
  itemList: [],
  status: 'draft' as const,
}

export function NewInvoiceForm({
  onCancel,
  onSubmit,
  onSubmitSuccess,
  ...delegatedProps
}: Props): JSX.Element {
  const createInvoiceMutation = useCreateInvoice({
    onSuccess: (savedInvoice) => {
      onSubmitSuccess?.(savedInvoice)
    },
  })
  const billFromLegendId = useId()
  const billToLegendId = useId()
  const itemListHeadingId = useId()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<NewInvoiceInputDTO>({
    defaultValues: DEFAULT_FORM_VALUES,
    resolver: zodResolver(newInvoiceInputDtoSchema),
  })
  const itemsFieldArray = useFieldArray({
    control,
    name: 'itemList',
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        createInvoiceMutation.mutate(data)
        onSubmit?.(data)
      })}
      {...delegatedProps}
      className={form}
    >
      <fieldset className={fieldset} aria-labelledby={billFromLegendId}>
        <div className={gridWrapper}>
          <h3 className={fieldsetHeader} id={billFromLegendId}>
            Bill From
          </h3>
          <Input
            className={spanFull}
            label="Street Address"
            errorMessage={errors.senderAddress?.street?.message}
            {...register('senderAddress.street')}
          />
          <Input
            className={spanThird}
            label="City"
            errorMessage={errors.senderAddress?.city?.message}
            {...register('senderAddress.city')}
          />
          <Input
            className={spanThird}
            label="Post Code"
            errorMessage={errors.senderAddress?.postcode?.message}
            {...register('senderAddress.postcode')}
          />
          <Input
            className={spanThird}
            label="Country"
            errorMessage={errors.senderAddress?.country?.message}
            {...register('senderAddress.country')}
          />
        </div>
      </fieldset>
      <fieldset className={fieldset} aria-labelledby={billToLegendId}>
        <div className={gridWrapper}>
          <h3 className={fieldsetHeader} id={billToLegendId}>
            Bill To
          </h3>
          <Input
            className={spanFull}
            label="Client's Name"
            errorMessage={errors.clientName?.message}
            {...register('clientName')}
          />
          <Input
            className={spanFull}
            label="Client's Email"
            type="email"
            errorMessage={errors.clientEmail?.message}
            {...register('clientEmail')}
          ></Input>
          <Input
            className={spanFull}
            label="Street Address"
            errorMessage={errors.clientAddress?.street?.message}
            {...register('clientAddress.street')}
          />
          <Input
            className={spanThird}
            label="City"
            errorMessage={errors.clientAddress?.city?.message}
            {...register('clientAddress.city')}
          />
          <Input
            className={spanThird}
            label="Post Code"
            errorMessage={errors.clientAddress?.postcode?.message}
            {...register('clientAddress.postcode')}
          />
          <Input
            className={spanThird}
            label="Country"
            errorMessage={errors.clientAddress?.country?.message}
            {...register('clientAddress.country')}
          />
        </div>
      </fieldset>
      <fieldset className={fieldset}>
        <div className={gridWrapper}>
          <Input
            className={spanHalf}
            label="Issue Date"
            type="date"
            {...register('issuedAt', {
              valueAsDate: true,
            })}
          />
          <Input
            className={spanHalf}
            label="Payment Terms"
            type="number"
            {...register('paymentTerms', { valueAsNumber: true })}
          />
          <Input
            className={spanFull}
            label="Project Description"
            errorMessage={errors.projectDescription?.message}
            {...register('projectDescription')}
          />
        </div>
      </fieldset>
      <fieldset className={fieldset}>
        <div className={gridWrapper}>
          <h3 className={itemListHeader} id={itemListHeadingId}>
            Item List
          </h3>
          <table className={table} aria-labelledby={itemListHeadingId}>
            <thead>
              <tr>
                <th className={th} scope="col">
                  Item Name
                </th>
                {/* Don't like this hardcoding of widths */}
                <th className={th} scope="col" style={{ width: '20%' }}>
                  Qty.
                </th>
                <th className={th} scope="col" style={{ width: '30%' }}>
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {itemsFieldArray.fields.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input
                      className={tableInput}
                      type="text"
                      defaultValue={`${item.name}`}
                      aria-label="Item Name"
                      {...register(`itemList.${index}.name`)}
                    />
                  </td>
                  <td>
                    <input
                      className={tableInput}
                      type="number"
                      aria-label="Quantity"
                      defaultValue={`${item.quantity}`}
                      {...register(`itemList.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td>
                    <input
                      className={tableInput}
                      size={0}
                      type="number"
                      aria-label="Price"
                      defaultValue={`${item.price}`}
                      {...register(`itemList.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            type="button"
            prefix="+"
            color="muted"
            onClick={() => itemsFieldArray.append(DEFAULT_ITEM_VALUES)}
            className={spanFull}
          >
            Add New Item
          </Button>
        </div>
      </fieldset>
      <input type="hidden" {...register('status')} />
      <div className={buttonGroup}>
        <Button type="button" color="muted" onClick={() => onCancel?.()}>
          Discard
        </Button>
        <Button
          type="submit"
          color="mono"
          onClick={() => {
            setValue('status', 'draft')
          }}
        >
          Save as Draft
        </Button>
        <Button
          type="submit"
          color="primary"
          onClick={() => {
            setValue('status', 'pending')
          }}
        >
          Save & Send
        </Button>
      </div>
    </form>
  )
}

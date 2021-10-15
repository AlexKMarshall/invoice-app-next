import {
  Button,
  CurrencyValue,
  IconButton,
  Input,
  Select,
  Stack,
} from 'src/client/shared/components'
import { CreateInvoiceRequest, UpdateInvoiceRequest } from 'src/shared/dtos'
import { ReactNode, useReducer } from 'react'
import {
  bottomShadowRecipe,
  buttonGroup,
  deleteButton,
  deleteIcon,
  fieldset,
  fieldsetHeader,
  form,
  gridWrapper,
  itemListHeader,
  itemTotal,
  marginLeftAuto,
  scrollArea,
  spanFull,
  spanHalf,
  spanThird,
  table,
  tableInput,
  tableWrapper,
  th,
  topShadowRecipe,
} from './invoice-form.css'
import {
  createInvoiceRequestDtoSchema,
  updateInvoiceInputDtoSchema,
} from 'src/shared/invoice.schema'
import { useFieldArray, useForm } from 'react-hook-form'

import { Delete } from 'src/client/shared/icons'
import { format } from 'date-fns'
import { useId } from '@react-aria/utils'
import { usePaymentTerms } from './payment-term.queries'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
  kind: 'create' | 'update'
  onCancel?: () => void
  onSubmit: (data: CreateInvoiceRequest) => void
  defaultValues?: Partial<CreateInvoiceRequest | UpdateInvoiceRequest>
  'aria-labelledby': string
  heading: ReactNode
}

const defaultItemValues = { name: '', quantity: 0, price: 0 }
const defaultFormValues = {
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
  issuedAt: new Date(), //format(new Date(), 'yyyy-MM-dd'),
  // paymentTermId: '',
  projectDescription: '',
  itemList: [],
  status: 'draft' as const,
}

export function InvoiceForm({
  kind,
  onCancel,
  onSubmit,
  defaultValues = defaultFormValues,
  heading,
  ...props
}: Props): JSX.Element {
  const billFromLegendId = useId()
  const billToLegendId = useId()
  const itemListHeadingId = useId()

  const formattedDefaultValues = {
    ...defaultValues,
    issuedAt: defaultValues.issuedAt
      ? format(defaultValues.issuedAt, 'yyyy-MM-dd')
      : undefined,
  }

  const paymentTermsQuery = usePaymentTerms()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateInvoiceRequest>({
    defaultValues: formattedDefaultValues,
    resolver: zodResolver(
      kind === 'create'
        ? createInvoiceRequestDtoSchema
        : updateInvoiceInputDtoSchema
    ),
  })
  const itemsFieldArray = useFieldArray({
    control,
    name: 'itemList',
  })

  const watchItemFieldArray = watch('itemList')

  const watchedItems = itemsFieldArray.fields.map((_, index) => ({
    ...watchItemFieldArray[index],
  }))

  const [scrollState, dispatch] = useReducer(scrollReducer, 'top')

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props} className={form}>
      <div
        className={scrollArea}
        onScroll={(event) => {
          dispatch({ type: 'scroll', payload: event.currentTarget })
        }}
      >
        <Stack size="5">
          {heading}
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
                disabled={kind === 'update'}
              />
              <Select
                className={spanHalf}
                label="Payment Terms"
                errorMessage={errors.paymentTermId?.message}
                isLoading={paymentTermsQuery.isLoading}
                options={
                  paymentTermsQuery.isSuccess
                    ? paymentTermsQuery.data.map((pt) => ({
                        value: pt.id.toString(),
                        label: pt.name,
                      }))
                    : undefined
                }
                {...register('paymentTermId', { valueAsNumber: true })}
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
              <div className={tableWrapper}>
                <table className={table} aria-labelledby={itemListHeadingId}>
                  <thead>
                    <tr>
                      <th className={th} scope="col">
                        Item Name
                      </th>
                      {/* TODO Don't like this hardcoding of widths */}
                      <th className={th} scope="col" style={{ width: '15%' }}>
                        Qty.
                      </th>
                      <th className={th} scope="col" style={{ width: '20%' }}>
                        Price
                      </th>
                      <th className={th} scope="col" style={{ width: '10%' }}>
                        Total
                      </th>
                      <th className={th} scope="col" style={{ width: '10%' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {itemsFieldArray.fields.map((item, index) => {
                      const watchedItem = watchedItems[index]
                      const total = watchedItem.quantity * watchedItem.price
                      return (
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
                          <td className={itemTotal}>
                            <CurrencyValue value={total} />
                          </td>
                          <td>
                            <IconButton
                              label="delete"
                              onClick={() => itemsFieldArray.remove(index)}
                              className={deleteButton}
                            >
                              <Delete className={deleteIcon} />
                            </IconButton>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Button
                type="button"
                prefix="+"
                color="muted"
                onClick={() => itemsFieldArray.append(defaultItemValues)}
                className={spanFull}
              >
                Add New Item
              </Button>
            </div>
          </fieldset>
          <input type="hidden" {...register('status')} />
        </Stack>
      </div>
      <div
        className={topShadowRecipe({
          visibility: scrollState === 'top' ? 'invisible' : 'visible',
        })}
      />
      <div
        className={bottomShadowRecipe({
          visibility: scrollState === 'bottom' ? 'invisible' : 'visible',
        })}
      />
      <div className={buttonGroup}>
        {kind === 'update' ? (
          <>
            <Button type="button" color="muted" onClick={() => onCancel?.()}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              onClick={() => {
                setValue('status', 'pending')
              }}
            >
              Save Changes
            </Button>
          </>
        ) : null}
        {kind === 'create' ? (
          <>
            <Button type="button" color="muted" onClick={() => onCancel?.()}>
              Discard
            </Button>
            <Button
              type="submit"
              color="mono"
              onClick={() => {
                setValue('status', 'draft')
              }}
              className={marginLeftAuto}
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
          </>
        ) : null}
      </div>
    </form>
  )
}

type ScrollPosition = 'top' | 'middle' | 'bottom'

function getScrollPosition(
  {
    scrollHeight,
    scrollTop,
    clientHeight,
  }: { scrollHeight: number; scrollTop: number; clientHeight: number },
  threshold = 0
): ScrollPosition {
  if (scrollTop - threshold < 1) return 'top'
  if (scrollHeight - scrollTop - clientHeight - threshold < 1) return 'bottom'
  return 'middle'
}

type ScrollActionPayload = {
  scrollHeight: number
  scrollTop: number
  clientHeight: number
}

type ScrollAction = {
  type: 'scroll'
  payload: ScrollActionPayload
}

const scrollReducer = (
  state: ScrollPosition,
  action: ScrollAction
): ScrollPosition => {
  return getScrollPosition(action.payload)
}

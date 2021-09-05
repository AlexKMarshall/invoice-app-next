import { COLORS, TYPOGRAPHY } from 'src/client/shared/styles/theme'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from 'src/client/shared/components/button'
import { ComponentPropsWithRef } from 'react'
import { Input as InputBase } from 'src/client/shared/components/input'
import { InvoiceDetail } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { format } from 'date-fns'
import { newInvoiceInputDtoSchema } from 'src/shared/invoice.schema'
import styled from 'styled-components'
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
    <Form
      onSubmit={handleSubmit((data) => {
        createInvoiceMutation.mutate(data)
        onSubmit?.(data)
      })}
      {...delegatedProps}
    >
      <Fieldset aria-labelledby={billFromLegendId}>
        <GridWrapper>
          <FieldsetHeader id={billFromLegendId}>Bill From</FieldsetHeader>
          <Input
            $span="full"
            label="Street Address"
            errorMessage={errors.senderAddress?.street?.message}
            {...register('senderAddress.street')}
          />
          <Input
            $span="third"
            label="City"
            errorMessage={errors.senderAddress?.city?.message}
            {...register('senderAddress.city')}
          />
          <Input
            $span="third"
            label="Post Code"
            errorMessage={errors.senderAddress?.postcode?.message}
            {...register('senderAddress.postcode')}
          />
          <Input
            $span="third"
            label="Country"
            errorMessage={errors.senderAddress?.country?.message}
            {...register('senderAddress.country')}
          />
        </GridWrapper>
      </Fieldset>
      <Fieldset aria-labelledby={billToLegendId}>
        <GridWrapper>
          <FieldsetHeader id={billToLegendId}>Bill To</FieldsetHeader>
          <Input
            $span="full"
            label="Client's Name"
            errorMessage={errors.clientName?.message}
            {...register('clientName')}
          />
          <Input
            $span="full"
            label="Client's Email"
            type="email"
            errorMessage={errors.clientEmail?.message}
            {...register('clientEmail')}
          ></Input>
          <Input
            $span="full"
            label="Street Address"
            errorMessage={errors.clientAddress?.street?.message}
            {...register('clientAddress.street')}
          />
          <Input
            $span="third"
            label="City"
            errorMessage={errors.clientAddress?.city?.message}
            {...register('clientAddress.city')}
          />
          <Input
            $span="third"
            label="Post Code"
            errorMessage={errors.clientAddress?.postcode?.message}
            {...register('clientAddress.postcode')}
          />
          <Input
            $span="third"
            label="Country"
            errorMessage={errors.clientAddress?.country?.message}
            {...register('clientAddress.country')}
          />
        </GridWrapper>
      </Fieldset>
      <Fieldset>
        <GridWrapper>
          <Input
            $span="half"
            label="Issue Date"
            type="date"
            {...register('issuedAt', {
              valueAsDate: true,
            })}
          />
          <Input
            $span="half"
            label="Payment Terms"
            type="number"
            {...register('paymentTerms', { valueAsNumber: true })}
          />
          <Input
            $span="full"
            label="Project Description"
            errorMessage={errors.projectDescription?.message}
            {...register('projectDescription')}
          />
        </GridWrapper>
      </Fieldset>
      <Fieldset>
        <GridWrapper>
          <ItemListHeader id={itemListHeadingId}>Item List</ItemListHeader>
          <Table aria-labelledby={itemListHeadingId}>
            <thead>
              <tr>
                <Th scope="col">Item Name</Th>
                {/* Don't like this hardcoding of widths */}
                <Th scope="col" style={{ width: '20%' }}>
                  Qty.
                </Th>
                <Th scope="col" style={{ width: '30%' }}>
                  Price
                </Th>
              </tr>
            </thead>
            <tbody>
              {itemsFieldArray.fields.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <TableInput
                      type="text"
                      defaultValue={`${item.name}`}
                      aria-label="Item Name"
                      {...register(`itemList.${index}.name`)}
                    />
                  </td>
                  <td>
                    <TableInput
                      type="number"
                      aria-label="Quantity"
                      defaultValue={`${item.quantity}`}
                      {...register(`itemList.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td>
                    <TableInput
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
          </Table>
          <Button
            type="button"
            prefix="+"
            color="muted"
            onClick={() => itemsFieldArray.append(DEFAULT_ITEM_VALUES)}
          >
            Add New Item
          </Button>
        </GridWrapper>
      </Fieldset>
      <input type="hidden" {...register('status')} />
      <ButtonGroup>
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
      </ButtonGroup>
    </Form>
  )
}

const Form = styled.form`
  max-width: 730px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
`
const FieldsetHeader = styled.h3`
  margin: 0;
  padding: 0;
  color: ${COLORS.primaryColor.prop};
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
`

const ItemListHeader = styled.h3`
  font-size: ${17 / 16}rem;
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  letter-spacing: -0.375px;
  color: hsla(225deg, 14%, 53%, 100%);
`

const GridWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: auto;
  & > * {
    grid-column: 1 / -1;
  }
`

type InputProps = ComponentPropsWithRef<typeof InputBase> & {
  $span: 'full' | 'half' | 'third'
}

const spanMap: Record<InputProps['$span'], string> = {
  full: 'span 6',
  half: 'span 3',
  third: 'span 2',
}
const Input = styled(InputBase)<InputProps>`
  grid-column: ${(props) => spanMap[props.$span]};
`

const Table = styled.table`
  --spacing: 1rem;
  table-layout: fixed;
  border-spacing: var(--spacing);
  margin: calc(-1 * var(--spacing));
`

const Th = styled.th`
  text-align: left;
`

const TableInput = styled.input`
  padding: 16px 20px;
  border: 1px solid ${COLORS.fieldBorderColor.prop};
  border-radius: 4px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  width: 100%;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  & > :first-child {
    margin-right: auto;
  }
`

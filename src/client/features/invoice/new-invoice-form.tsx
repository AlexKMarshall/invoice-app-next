import { COLORS, TYPOGRAPHY } from 'src/client/shared/styles/theme'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from 'src/client/shared/components/button'
import { ComponentPropsWithRef } from 'react'
import { Input as InputBase } from 'src/client/shared/components/input'
import { InvoiceDetail } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { format } from 'date-fns'
import styled from 'styled-components'
import { useCreateInvoice } from './invoice.queries'
import { useId } from '@react-aria/utils'

type Props = {
  onCancel?: () => void
  onSubmit?: (data: NewInvoiceInputDTO) => void
  onSubmitSuccess?: (data: InvoiceDetail) => void
  'aria-labelledby': string
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
  itemList: [],
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
  const { register, handleSubmit, control } = useForm<NewInvoiceFormFields>({
    defaultValues: DEFAULT_FORM_VALUES,
  })
  const itemsFieldArray = useFieldArray({
    control,
    name: 'itemList',
  })

  return (
    <Form
      onSubmit={handleSubmit((data) => {
        createInvoiceMutation.mutate({ status: 'draft', ...data })
        onSubmit?.({ status: 'draft', ...data })
      })}
      {...delegatedProps}
    >
      <Fieldset aria-labelledby={billFromLegendId}>
        <GridWrapper>
          <FieldsetHeader id={billFromLegendId}>Bill From</FieldsetHeader>
          <Input
            $span="full"
            label="Street Address"
            {...register('senderAddress.street')}
          />
          <Input
            $span="third"
            label="City"
            {...register('senderAddress.city')}
          />
          <Input
            $span="third"
            label="Post Code"
            {...register('senderAddress.postcode')}
          />
          <Input
            $span="third"
            label="Country"
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
            {...register('clientName')}
          />
          <Input
            $span="full"
            label="Client's Email"
            {...register('clientEmail')}
          ></Input>
          <Input
            $span="full"
            label="Street Address"
            {...register('clientAddress.street')}
          />
          <Input
            $span="third"
            label="City"
            {...register('clientAddress.city')}
          />
          <Input
            $span="third"
            label="Post Code"
            {...register('clientAddress.postcode')}
          />
          <Input
            $span="third"
            label="Country"
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
                <Th scope="col" style={{ width: '50%' }}>
                  Item Name
                </Th>
                <Th scope="col" style={{ width: '10%' }}>
                  Qty.
                </Th>
                <Th scope="col">Price</Th>
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
            variant="muted"
            onClick={() => itemsFieldArray.append(DEFAULT_ITEM_VALUES)}
          >
            Add New Item
          </Button>
        </GridWrapper>
      </Fieldset>
      <ButtonGroup>
        <Button type="button" variant="muted" onClick={() => onCancel?.()}>
          Discard
        </Button>
        <Button type="submit" variant="mono">
          Save as Draft
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
  table-layout: fixed;
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

  & > :first-child {
    margin-right: auto;
  }
`

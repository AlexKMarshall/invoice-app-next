import { currencyFormatterGBP } from 'src/client/shared/currency'

type Props = {
  currency?: 'GBP'
  value: number
}

const currencyFormatters = {
  GBP: currencyFormatterGBP,
}

export function CurrencyValue({ currency = 'GBP', value }: Props): JSX.Element {
  const [currencySymbol, ...rest] = currencyFormatters[currency]
    .format(value)
    .split('')
  const formattedValue = rest.join('')

  return (
    <>
      {currencySymbol}&nbsp;{formattedValue}
    </>
  )
}

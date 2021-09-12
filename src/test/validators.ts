import { BoundFunctions, queries, screen } from '@testing-library/react'

import { currencyFormatterGBP } from 'src/client/shared/currency'

export function validateTextIfNonEmpty(
  text: string,
  withinElement: BoundFunctions<typeof queries> = screen
): void {
  if (text) {
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(withinElement.getByText(text)).toBeInTheDocument()
  }
}

export function validateGBPValue(
  value: number,
  withinElement: BoundFunctions<typeof queries> = screen
): void {
  const numericPart = currencyFormatterGBP.format(value).slice(1)
  expect(
    // eslint-disable-next-line testing-library/prefer-screen-queries
    withinElement.getByText(numericPart, {
      exact: false,
    })
  ).toBeInTheDocument()
}

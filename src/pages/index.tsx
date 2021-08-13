import Head from 'next/head'
import { InvoiceSummaryScreen } from 'src/client/features/invoice/invoice-summary.screen'

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Invoice App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <InvoiceSummaryScreen />
    </>
  )
}

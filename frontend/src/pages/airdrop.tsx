import { Card } from 'flowbite-react'
import { NextPageWithLayout } from './_app'
import Layout from '@components/Layout'
import { ReactElement } from 'react'
import AirdropForm from '@components/forms/AirdropForm'

// Airdrop - Airdrop tokens
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="mx-auto w-3/5">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Airdrop
          </h5>
          <AirdropForm />
        </Card>
      </div>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page

import { ethers } from 'ethers'
import { Table } from 'flowbite-react'
import React from 'react'

type Props = {
  data: string[]
}

type RowProps = {
  address: string
  amount: number
}

const Row: React.FC<RowProps> = ({ address, amount }) => {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {ethers.utils.getAddress(address)}
      </Table.Cell>
      <Table.Cell>{amount}</Table.Cell>
    </Table.Row>
  )
}
const AirdropTable: React.FC<Props> = ({ data }) => {
  return (
    <>
      <Table>
        <Table.Head>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((recipient, key) => {
            return (
              <Row key={key} address={recipient[0]} amount={recipient[1]} />
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}

export default AirdropTable

import { Alert, Button, FileInput, Label } from 'flowbite-react'
import React, { useEffect } from 'react'
import AirdropTable from '@components/Table'
import useAirdropTokens from '@hooks/useAirdropTokens'
import { useForm } from 'react-hook-form'
import { Link } from '@components/Link'

const AirdropForm = (): React.ReactElement<any, any> => {
  const onSubmit = (data) => console.log(data)

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<AirdropForm>({
    defaultValues: {
      token: '0x',
    },
  })

  const [token] = watch([`token`])

  useEffect(() => {
    console.log('token', token)
  }, [token])

  const {
    data: {
      tokens: { tokensDeployed, isTokensLoading },
      parsedData,
      isApprovalRequired,
      isApprovalComplete,
      totalRequiredAllowance,
      approvalLoading,
      isAirdropComplete,
      airdropTokensData,
      airdropTokensWrite,
      isAirdropResultLoading,
      isAirdropSuccess,
    },
    actions: { handleSelectToken, fileHandler, approvalWrite },
  } = useAirdropTokens({ token })

  type AirdropForm = {
    token: `0x${string}`
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-4">
          <div className="mb-2 block min-w-fit">
            <Label value="Select Token" />
          </div>
          <select
            {...register('token', { required: true })}
            className="form-input block w-full py-2 px-3 pr-8 leading-tight rounded-md bg-white border-gray-300 focus:outline-none focus:shadow-outline-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            {!isTokensLoading &&
              tokensDeployed?.map((option, i) => {
                return (
                  <option className="text-gray-700" value={option} key={i}>
                    {option}
                  </option>
                )
              })}
          </select>
        </div>
        <div className="flex flex-row gap-4">
          <div className="mb-2 block min-w-fit">
            <Label htmlFor="file" value="Upload file" />
          </div>
          <div
            id="fileUpload"
            className="block w-full py-2 px-3 pr-8 leading-tight rounded-md bg-white border-gray-300 focus:outline-none focus:shadow-outline-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            <FileInput
              id="file"
              helperText="CSV file with the format: address, amount"
              accept=".csv"
              onChange={fileHandler}
            />
          </div>
        </div>
        {parsedData.length !== 0 && <AirdropTable data={parsedData} />}

        <div className="grid gap-4">
          <Button
            disabled={!isApprovalRequired}
            onClick={(e) => {
              e.preventDefault()
              console.log('calling approve')
              approvalWrite?.()
            }}
          >
            {!isApprovalRequired || isApprovalComplete
              ? `Approval Complete ✅`
              : approvalLoading
              ? 'Approving...'
              : `Please Approve ${
                  totalRequiredAllowance.gt(0) &&
                  totalRequiredAllowance.toString()
                }`}
          </Button>
          <Button
            disabled={isAirdropComplete || isAirdropResultLoading}
            onClick={(e) => {
              console.log(`hello`)
              e.preventDefault()
              airdropTokensWrite?.()
            }}
            type="submit"
          >
            {isAirdropResultLoading
              ? `Airdropping...`
              : isAirdropSuccess || isAirdropComplete
              ? `Airdropped ✅`
              : `Airdrop`}
          </Button>
        </div>

        {isAirdropSuccess && (
          <Alert color="success" className="my-3">
            <span>
              <span className="font-medium">
                Airdropped! (Click below for explorer)
                <Link txHash={String(airdropTokensData?.hash)} />
              </span>
            </span>
          </Alert>
        )}
      </form>
    </div>
  )
}

export default AirdropForm

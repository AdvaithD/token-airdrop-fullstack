import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useDeployErc20 from '@hooks/useDeployErc20'

type FormData = {
  tokenName: string
  tokenSymbol: string
  tokenSupply: number
}

const DeployTokenForm = (): React.ReactElement<any, any> => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      tokenName: ``,
      tokenSymbol: ``,
      tokenSupply: 0,
    },
  })
  const [submitting, setSubmitting] = useState(false)

  const [tokenName, tokenSymbol, tokenSupply] = watch([
    `tokenName`,
    `tokenSymbol`,
    `tokenSupply`,
  ])
  const { writeDeploy, dataDeploy, statusDeploy } = useDeployErc20(
    tokenName,
    tokenSymbol,
    String(tokenSupply),
  )

  const onSubmit = async () => {
    setSubmitting(true)
    console.log(
      `tokenName, tokenSymbol, tokenSupply`,
      typeof tokenName,
      typeof tokenSymbol,
      typeof tokenSupply,
    )
    try {
      writeDeploy && writeDeploy()
    } catch (error) {
      console.log(`ERRR on deploy submit`, error)
    }
    setSubmitting(false)
  }

  const isTokenDeployed = statusDeploy === `success`
  React.useEffect(() => {
    console.log(`dataDeploy, statusDeploy`, dataDeploy, statusDeploy)
  }, [dataDeploy, statusDeploy])

  return (
    <>
      <div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="tokenName" value="Token Name" />
            </div>
            <TextInput
              id="tokenName"
              type="string"
              placeholder="FTX Token"
              required={true}
              {...register(`tokenName`, { required: true })}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="tokenSymbol" value="Token symbol" />
            </div>
            <TextInput
              id="tokenSymbol"
              placeholder="FTT"
              type="string"
              required={true}
              {...register(`tokenSymbol`, { required: true })}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="tokenSupply" value="Token Supply" />
            </div>
            <TextInput
              id="tokenSupply"
              type="number"
              required={true}
              {...register(`tokenSupply`, { required: true })}
            />
          </div>
          <Button type="submit">
            {statusDeploy === `loading` ? (
              <>
                <Spinner aria-label="Spinner button example" />
                <span className="pl-3">Deploying...</span>
              </>
            ) : isTokenDeployed ? (
              `Deployed!`
            ) : (
              `Deploy`
            )}
          </Button>
        </form>
      </div>
    </>
  )
}

export default DeployTokenForm

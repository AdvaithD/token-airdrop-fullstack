export function Link({ txHash }: { txHash: string }) {
  const url = `https://mumbai.polygonscan.com/tx/${txHash}`
  return (
    <p className="">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {txHash}
      </a>
    </p>
  )
}

import { Navbar } from 'flowbite-react'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'

const LayoutNavbar: React.FC = () => {
  const router = useRouter()

  return (
    <div className="mb-8">
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="https://flowbite.com/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            MagnaDrop
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <ConnectButton />
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link onClick={() => router.push(`/`)}>Home</Navbar.Link>
          <Navbar.Link onClick={() => router.push(`/deploy`)}>
            Deploy Token
          </Navbar.Link>
          <Navbar.Link onClick={() => router.push(`/tokens`)}>
            My Tokens
          </Navbar.Link>
          <Navbar.Link onClick={() => router.push(`/airdrop`)}>
            Airdrop
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default LayoutNavbar

import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import FooterComponent from './Footer'
import Navbar from './Navbar'

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
      <Toaster position="top-right" />
      <FooterComponent />
    </>
  )
}

export default Layout

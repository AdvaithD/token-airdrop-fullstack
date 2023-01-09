import React from 'react'
import { Footer } from 'flowbite-react'

const FooterComponent = (): React.ReactElement => {
  return (
    <>
      <div className="fixed inet-x-0 bottom-0">
        <Footer container={true}>
          <Footer.Copyright href="#" by="MagnaDrop™" year={2023} />
        </Footer>
      </div>
    </>
  )
}

export default FooterComponent

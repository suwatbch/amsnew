'use client'

import { Button } from 'react-bootstrap'

const InvoicePrintButton = () => {
  return (
    <Button variant="info" className = "mt-3" onClick={() => window.print()}>
      Print
    </Button>
  )
}

export default InvoicePrintButton

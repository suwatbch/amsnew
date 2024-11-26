import type { Metadata } from 'next'
import AllFormValidations from './components/AllFormValidations'

export const metadata: Metadata = { title: 'Validation' }

const Validation = () => {
  return (
    <>
      <AllFormValidations />
    </>
  )
}

export default Validation

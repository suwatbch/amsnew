import type { Metadata } from 'next'
import AllToasts from './components/AllToasts'

export const metadata: Metadata = { title: 'Toasts' }

const Toasts = () => {
  return <AllToasts />
}

export default Toasts

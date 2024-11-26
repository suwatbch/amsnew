import type { Metadata } from 'next'
import AllPaginations from './components/AllPaginations'

export const metadata: Metadata = { title: 'Paginations' }

const Paginations = () => {
  return <AllPaginations />
}

export default Paginations

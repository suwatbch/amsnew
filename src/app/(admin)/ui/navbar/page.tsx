import type { Metadata } from 'next'
import AllNavBars from './components/AllNavBars'

export const metadata: Metadata = { title: 'Navbars' }

const Navbar = () => {
  return <AllNavBars />
}

export default Navbar

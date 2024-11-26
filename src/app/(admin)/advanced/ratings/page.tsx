import type { Metadata } from 'next'
import AllRatings from './components/AllRatings'

export const metadata: Metadata = { title: 'Ratings' }

const Ratings = () => {
  return <AllRatings />
}

export default Ratings

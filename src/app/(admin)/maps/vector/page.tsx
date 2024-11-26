import type { Metadata } from 'next'
import AllVectorMaps from './components/AllVectorMaps'

export const metadata: Metadata = { title: 'Vector Maps' }

const VectorMaps = () => {
  return <AllVectorMaps />
}

export default VectorMaps

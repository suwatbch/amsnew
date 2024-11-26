import type { Metadata } from 'next'
import AllLeafletMaps from './components/AllLeafletMaps'

export const metadata: Metadata = { title: 'Leaflet Maps' }

const LeafletMaps = () => {
  return <AllLeafletMaps />
}

export default LeafletMaps

import type { Metadata } from 'next'
import AllJustGageCharts from './components/AllJustGageCharts'

export const metadata: Metadata = { title: 'JustGage charts' }

const JustGage = () => {
  return <AllJustGageCharts />
}

export default JustGage

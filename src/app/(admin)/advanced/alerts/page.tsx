import type { Metadata } from 'next'
import AllSweetAlerts from './components/AllSweetAlerts'

export const metadata: Metadata = { title: 'Sweet Alerts' }

const Alerts = () => {
  return <AllSweetAlerts />
}

export default Alerts

import type { Metadata } from 'next'
import AllToastCharts from './components/AllToastCharts'

export const metadata: Metadata = { title: 'Toast Charts' }

const ToastChart = () => {
  return <AllToastCharts />
}

export default ToastChart

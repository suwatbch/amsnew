import type { Metadata } from 'next'
import AllChartJsCharts from './components/AllChartJsCharts'

export const metadata: Metadata = { title: 'ChartJs Charts' }

const ChartJs = () => {
  return <AllChartJsCharts />
}

export default ChartJs

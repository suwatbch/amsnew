import type { Metadata } from 'next'
import AllRangeSliders from './components/AllRangeSliders'

export const metadata: Metadata = { title: 'Range Slider' }

const RangeSlider = () => {
  return <AllRangeSliders />
}

export default RangeSlider

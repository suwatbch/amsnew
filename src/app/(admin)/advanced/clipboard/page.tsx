import type { Metadata } from 'next'
import AllClipboards from './components/AllClipboards'

export const metadata: Metadata = { title: 'Clipboard' }

const Clipboard = () => {
  return <AllClipboards />
}

export default Clipboard

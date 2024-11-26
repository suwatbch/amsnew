import type { Metadata } from 'next'
import AllTreeView from './components/AllTreeView'

export const metadata: Metadata = { title: 'Treeview' }

const TreeView = () => {
  return <AllTreeView />
}

export default TreeView

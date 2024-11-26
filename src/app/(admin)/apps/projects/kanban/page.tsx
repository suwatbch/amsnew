import type { Metadata } from 'next'

import { KanbanProvider } from '@/context/useKanbanContext'
import Board from './components/Board'
import KanbanHeader from './components/KanbanHeader'
import Modals from './components/Modals'

export const metadata: Metadata = { title: 'Kanban Board' }

const Kanban = () => {
  return (
    <KanbanProvider>
      <KanbanHeader />
      <Board />
      <Modals />
    </KanbanProvider>
  )
}

export default Kanban

import type { Metadata } from 'next'
import ProjectList from './components/ProjectList'

export const metadata: Metadata = { title: 'Dragula' }

const Dragula = () => {
  return <ProjectList />
}

export default Dragula

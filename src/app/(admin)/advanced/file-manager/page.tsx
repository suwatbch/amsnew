import type { Metadata } from 'next'
import FoldersList from './components/FoldersList'
import AllFiles from './components/AllFiles'
import { Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'File Manager' }

const FileManager = () => {
  return (
    <>
      <FoldersList />
      <Row className="justify-content-center">
        <Col xs={12}>
          <AllFiles />
        </Col>
      </Row>
    </>
  )
}

export default FileManager

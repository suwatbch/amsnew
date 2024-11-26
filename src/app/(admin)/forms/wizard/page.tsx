import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import BasicWizard from './components/BasicWizard'

export const metadata: Metadata = { title: 'Wizard' }

const Wizard = () => {
  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <BasicWizard />
      </Col>
    </Row>
  )
}

export default Wizard

import type { Metadata } from 'next'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import AllAnimations from './components/AllAnimations'

export const metadata: Metadata = { title: 'Animation' }

const Animation = () => {
  return (
    <Row className="justify-content-center">
      <Col>
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <Col>
                <CardTitle as="h4">Magic Animation</CardTitle>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="pt-0">
            <AllAnimations />
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default Animation

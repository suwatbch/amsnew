import type { Metadata } from 'next'

import CalendarWidget from './components/CalendarWidget'
import { CardBody, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Calendar' }

const Calendar = () => {
  return (
    <Row>
      <Col xs={12}>
        <div className="mb-3">
          <CardBody>
            <CalendarWidget />
          </CardBody>
        </div>
      </Col>
    </Row>
  )
}

export default Calendar

import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import RefundRequest from './components/RefundRequest'
import OrderSummary from './components/OrderSummary'
import RefundForm from './components/RefundForm'

export const metadata: Metadata = { title: 'Refunds' }

const Refunds = () => {
  return (
    <Row>
      <Col lg={8}>
        <RefundRequest />
      </Col>
      <Col lg={4}>
        <OrderSummary />
        <RefundForm />
      </Col>
    </Row>
  )
}

export default Refunds

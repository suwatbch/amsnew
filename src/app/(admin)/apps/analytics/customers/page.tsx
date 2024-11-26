import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import CustomersData from './components/CustomersData'
import GrowthChart from './components/GrowthChart'
import SocialStats from './components/SocialStats'
import CustomerDetails from './components/CustomerDetails'

export const metadata: Metadata = { title: 'Customers' }

const Customers = () => {
  return (
    <>
      <Row>
        <Col md={12} lg={5}>
          <CustomersData />
        </Col>
        <Col md={12} lg={7}>
          <GrowthChart />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <SocialStats />
      </Row>
      <Row>
        <Col xs={12}>
          <CustomerDetails />
        </Col>
      </Row>
    </>
  )
}

export default Customers

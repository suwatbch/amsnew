import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import TopCountry from './components/TopCountry'
import MetricsChart from './components/MetricsChart'
import VisitsDetails from './components/VisitsDetails'
import SocialMedia from './components/SocialMedia'

export const metadata: Metadata = { title: 'Reports' }

const Reports = () => {
  return (
    <>
      <Row>
        <Col md={12} lg={3}>
          <TopCountry />
        </Col>
        <Col md={12} lg={9}>
          <MetricsChart />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <VisitsDetails />
        </Col>
        <Col lg={6}>
          <SocialMedia />
        </Col>
      </Row>
    </>
  )
}

export default Reports

import { Card, CardBody, Col, Row } from 'react-bootstrap'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { getAllClients } from '@/helpers/data'
import type { ClientType } from '@/types/data'

export const metadata: Metadata = { title: 'Clients' }

const ClientCard = ({ user, description, flag, project }: ClientType) => {
  return (
    <Card>
      <CardBody className="p-4 color-bg rounded text-center">
        <h4 className="text-white opacity-75 fs-16 mb-0">Mannat Themes</h4>
      </CardBody>
      <div className="position-relative d-none d-xxl-block">
        <div className="shape overflow-hidden text-card-bg">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <CardBody className="mt-n5">
        <div className="position-relative">
          {user?.avatar && <Image src={user?.avatar} alt="avatar" className="rounded-circle thumb-xxl" />}
          <div className="position-absolute top-0">
            <Image src={flag} alt="flag" className="rounded-circle thumb-sm border border-3 border-dark" />
          </div>
        </div>
        <Row className="mt-3 align-items-center">
          <Col xs="auto" md={6}>
            <div>
              <h5 className="m-0 fw-bold">{user?.name}</h5>
              <p className="text-muted mb-0">{user?.handle}</p>
            </div>
          </Col>
          <Col md={6} className="text-end">
            <div className="text-muted mb-2 d-flex align-items-center">
              <span className="text-body fw-semibold">Pre.Project :</span> {project}
            </div>
          </Col>
        </Row>
        <p className="text-muted fs-14 my-3">{description}</p>
        <div className="text-muted mb-2 d-flex align-items-center">
          <IconifyIcon icon="iconoir:mail-out" className="fs-20 me-1" />
          <span className="text-body fw-semibold">Email :</span>
          <a href="#" className="text-primary text-decoration-underline">
            {user?.email}
          </a>
        </div>
        <div className="text-body  d-flex align-items-center">
          <IconifyIcon icon="iconoir:phone" className="fs-20 me-1 text-muted" />
          <span className="text-body fw-semibold">Phone :</span> {user?.phoneNo}
        </div>
        <div className="mt-3">
          <Link href="/pages/profile" className="btn btn-sm btn-primary px-2 d-inline-flex align-items-center me-1">
            <IconifyIcon icon="iconoir:user" className="fs-14 me-1" />
            View Profile
          </Link>
          <Link href="/apps/chat" className="btn btn-sm btn-outline-primary px-2 d-inline-flex align-items-center">
            <IconifyIcon icon="iconoir:chat-bubble" className="fs-14 me-1" />
            Message
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

const Clients = async () => {
  const clients = await getAllClients()
  return (
    <Row>
      {clients.map((client, idx) => (
        <Col md={6} lg={4} key={idx}>
          <ClientCard {...client} />
        </Col>
      ))}
    </Row>
  )
}

export default Clients

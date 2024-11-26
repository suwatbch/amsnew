import FallbackLoading from '@/components/FallbackLoading'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { getAllUsers } from '@/helpers/data'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
const UserDetailsTable = dynamic(() => import('./components/UserDetailsTable'))

export const metadata: Metadata = { title: 'Users' }

const Users = async () => {
  const users = await getAllUsers()
  return (
    <Row>
      <Col xs={12}>
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <Col>
                <CardTitle as={'h4'}>Users Details</CardTitle>
              </Col>
              <Col xs="auto">
                <button className="btn bg-primary-subtle text-primary me-1">
                  <IconifyIcon icon="fa6-solid:plus" className="me-1" /> Add User
                </button>
                <button className="btn btn-primary">
                  <IconifyIcon icon="fa6-solid:plus" className="me-1" /> Invite User
                </button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="pt-0">
            <Suspense fallback={<FallbackLoading />}>
              <UserDetailsTable users={users} />
            </Suspense>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default Users

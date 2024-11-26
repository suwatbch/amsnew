import Image from 'next/image'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'

import errorImg from '@/assets/images/extra/error.svg'
import logoSmImg from '@/assets/images/logo-login.png'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const NotFound = () => {
  return (
    <div className="container-xxl">
      <Row className="vh-100 d-flex justify-content-center">
        <Col xs={12} className="align-self-center">
          <CardBody>
            <Row>
              <Col lg={4} className="mx-auto">
                <Card>
                  <CardBody className="p-0 bg-light auth-header-box rounded-top">
                    <div className="text-center p-3">
                      <Link href="/auth/login" className="logo logo-admin">
                        <Image src={logoSmImg} height={120} alt="logo" className="auth-logo" />
                      </Link>
                    </div>
                  </CardBody>

                  <CardBody className="pt-0">
                    <div className="ex-page-content text-center">
                      <Image src={errorImg} alt={'error-img'} height={170} />
                      <h1 className="my-2">404!</h1>
                      <h5 className="fs-16 text-muted mb-3">ไม่พบหน้านี้</h5>
                    </div>
                    <Link href="/" className="btn btn-primary w-100">
                      กลับไปหน้าแรก <IconifyIcon icon="fa-solid:redo" className="ms-1" />
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Col>
      </Row>
    </div>
  )
}

export default NotFound

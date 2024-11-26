import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import LoginForm from './components/LoginForm'

import logoSmImg from '@/assets/images/logo-login.png'
import { Card, CardBody, Col } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Login' }

const Login = () => {
  return (
    <Col lg={4} className="mx-auto">
      <Card>
        <CardBody className="p-0 bg-light auth-header-box rounded-top">
          <div className="text-center p-3">
            <Link href="/auth/login" className="logo logo-admin">
              <Image src={logoSmImg} height={150} alt="logo" className="auth-logo" />
            </Link>
          </div>
        </CardBody>
        <CardBody className="pt-0">
          <LoginForm />

          {/* <div className="text-center  mb-2">
            <p className="text-muted">
              Don&apos;t have an account ?&nbsp;
              <Link href="/auth/register" className="text-primary ms-2">
                Free Resister
              </Link>
            </p>
            <h6 className="px-3 d-inline-block">Or Login With</h6>
          </div>
          <div className="d-flex justify-content-center">
            <span role="button" className="d-flex justify-content-center align-items-center thumb-md bg-blue-subtle text-blue rounded-circle me-2">
              <IconifyIcon icon="fa6-brands:facebook" className="align-self-center" />
            </span>
            <span role="button" className="d-flex justify-content-center align-items-center thumb-md bg-info-subtle text-info rounded-circle me-2">
              <IconifyIcon icon="fa6-brands:twitter" className="align-self-center" />
            </span>
            <span role="button" className="d-flex justify-content-center align-items-center thumb-md bg-danger-subtle text-danger rounded-circle">
              <IconifyIcon icon="fa6-brands:google" className="align-self-center" />
            </span>
          </div> */}
        </CardBody>
      </Card>
    </Col>
  )
}

export default Login

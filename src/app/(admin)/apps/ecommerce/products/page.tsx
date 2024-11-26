import IconifyIcon from '@/components/wrappers/IconifyIcon'
import clsx from 'clsx'
import type { Metadata } from 'next'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Row } from 'react-bootstrap'
import ProductTable from './components/ProductTable'
import { getAllProducts } from '@/helpers/data'

export const metadata: Metadata = { title: 'Products' }

const Products = async () => {
  const filters = ['All', 'Fashion', 'Plants', 'Toys', 'Gadgets', 'Food', 'Drinks']
  const products = await getAllProducts()
  return (
    <Row>
      <Col xs={12}>
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <Col>
                <CardTitle as="h4">Products</CardTitle>
              </Col>
              <Col xs="auto">
                <form className="row g-2">
                  <Col xs="auto">
                    <Dropdown>
                      <DropdownToggle
                        variant="link"
                        className="btn bg-primary-subtle text-primary d-flex align-items-center arrow-none"
                        role="button">
                        <IconifyIcon icon="iconoir:filter-alt" className="me-1" /> Filter
                      </DropdownToggle>
                      <DropdownMenu align="start">
                        <div className="p-2">
                          {filters.map((filter, idx) => (
                            <FormCheck
                              label={filter}
                              className={clsx({ 'mb-2': filters.length - 1 != idx })}
                              id={`filter-${idx}`}
                              key={idx}
                              defaultChecked
                            />
                          ))}
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                  <Col xs="auto">
                    <button type="button" className="btn btn-primary">
                      <IconifyIcon icon="fa6-solid:plus" className="me-1" /> Add Product
                    </button>
                  </Col>
                </form>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="pt-0">
            <ProductTable products={products} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default Products

'use client'
import ReactTable from '@/components/Table'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import type { ProductType } from '@/types/data'
import { getProductStatusIcon, getProductStatusVariant } from '@/utils/variants-icons'
import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'
import { FormCheck } from 'react-bootstrap'

const columns: ColumnDef<ProductType>[] = [
  {
    id: 'select',
    header: () => <FormCheck id="checkbox" />,
    cell: ({
      row: {
        original: { id },
      },
    }) => (
      <div style={{ width: 16 }}>
        <FormCheck id={`checkbox-${id}`} />
      </div>
    ),
  },
  {
    header: 'Product Name',
    cell: ({
      row: {
        original: { image, name, description },
      },
    }) => (
      <div className="ps-0">
        <Image src={image} alt="product" height={40} />
        <p className="d-inline-block align-middle mb-0">
          <Link href="/ecommerce/orders/" className="d-inline-block align-middle mb-0 product-name">
            {name}
          </Link>
          <br />
          <span className="text-muted font-13">{description}</span>
        </p>
      </div>
    ),
  },
  {
    header: 'Category',
    accessorKey: 'category',
  },
  {
    header: 'Pics',
    accessorKey: 'pics',
  },
  {
    header: 'Price',
    cell: ({
      row: {
        original: { sellPrice },
      },
    }) => (
      <>
        {currency}
        {sellPrice}
      </>
    ),
  },
  {
    header: 'Status',
    cell: ({
      row: {
        original: { status },
      },
    }) => (
      <span className={`badge bg-${getProductStatusVariant(status)}-subtle text-${getProductStatusVariant(status)}`}>
        <IconifyIcon icon={getProductStatusIcon(status)} className="me-1" /> {status}
      </span>
    ),
  },
  {
    header: 'Created At',
    cell: ({
      row: {
        original: { createdAt },
      },
    }) => (
      <span>
        {createdAt.toDateString()},{createdAt.toLocaleTimeString()}
      </span>
    ),
  },
  {
    header: 'Action',
    cell: () => (
      <div className="text-end">
        <span role="button">
          <IconifyIcon icon="la:pen" className="text-secondary fs-18" />
        </span>
        <span role="button">
          <IconifyIcon icon="la:trash-alt" className="text-secondary fs-18" />
        </span>
      </div>
    ),
  },
]
const ProductTable = ({ products }: { products: ProductType[] }) => {
  const pageSizeList = [2, 5, 10, 20, 50]

  return (
    <ReactTable<ProductType>
      columns={columns}
      data={products}
      rowsPerPageList={pageSizeList}
      pageSize={10}
      tableClass="mb-0 checkbox-all text-nowrap"
      theadClass="table-light"
      showPagination
    />
  )
}

export default ProductTable
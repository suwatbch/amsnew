'use client'

import { useEffect, useState } from 'react'
import { Table, Button, Spinner, Form, InputGroup, Pagination } from 'react-bootstrap'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Swal from 'sweetalert2'

interface BillData {
  ID: number
  Roomid: number
  BilledToName: string
  BilledToContact: string
  BilledToAddress: string
  BilledToCity: string
  BilledToPhone: string
  ShippedToAddress: string
  ShippedToCity: string
  ShippedToPhone: string
  IsDelete: boolean
  createDate: string
  updateDate: string
}

const BillsTable = () => {
  const router = useRouter()
  const [bills, setBills] = useState<BillData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/handler/bills/lists')
      setBills(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching bills:', err)
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBills()
  }, [])

  // Search function
  const filteredBills = bills.filter((bill) =>
    bill.BilledToName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.BilledToContact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.Roomid.toString().includes(searchTerm) ||
    bill.ID.toString().includes(searchTerm)
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBills.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleEdit = (id: number) => {
    router.push(`/apps/invoice/preview?id=${id}`)
  }

  const handleView = (id: number) => {
    router.push(`/apps/invoice/preview?id=${id}`)
  }

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        background: '#fff'
      })

      if (result.isConfirmed) {
        await axios.post(`/api/handler/bills/delete`, { ID: id })

        await Swal.fire({
          title: 'ลบสำเร็จ!',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 1500,
          timerProgressBar: true,
        })

        fetchBills()
      }
    } catch (err) {
      console.error('Error deleting bill:', err)

      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#d33',
      })
    }
  }

  const handleCreateNew = () => {
    router.push('/apps/invoice/preview?id=' + 0)
  }

  const renderPagination = () => {
    const pages = []
    
    // Previous button
    pages.push(
      <Pagination.Item 
        key="prev" 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &laquo;
      </Pagination.Item>
    )

    // Page numbers
    for (let number = 1; number <= totalPages; number++) {
      pages.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      )
    }

    // Next button
    pages.push(
      <Pagination.Item
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &raquo;
      </Pagination.Item>
    )

    return pages
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status"></Spinner>
        <span>กำลังโหลด...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-danger">{error}</div>
  }

  return (
    <ComponentContainerCard title="รายการบิลทั้งหมด">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={handleCreateNew}>
          <IconifyIcon icon="la:plus" className="me-1" />
          สร้างบิลใหม่
        </Button>

        <InputGroup style={{ width: '300px' }}>
          <InputGroup.Text>
            <IconifyIcon icon="la:search" />
          </InputGroup.Text>
          <Form.Control
            placeholder="ค้นหาด้วยชื่อ, เลขห้อง, เลขบิล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table striped responsive className="table mb-3">
        <thead className="table-light">
          <tr>
            <th>เลขที่บิล</th>
            <th>เลขห้อง</th>
            <th>ชื่อผู้รับบิล</th>
            <th>ติดต่อ</th>
            <th>วันที่สร้าง</th>
            <th>วันที่อัปเดต</th>
            <th className="text-end"></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((bill) => (
            <tr key={bill.ID}>
              <td>
                <span role="button" className="text-primary" onClick={() => handleView(bill.ID)}>
                  #{bill.ID}
                </span>
              </td>
              <td>{bill.Roomid}</td>
              <td>{bill.BilledToName}</td>
              <td>{bill.BilledToContact}</td>
              <td>{formatThaiDate(bill.createDate)}</td>
              <td>{formatThaiDate(bill.updateDate)}</td>
              <td className="text-end">
                <span role="button" className="me-2" onClick={() => handleEdit(bill.ID)}>
                  <IconifyIcon icon="la:pen" className="text-secondary font-16" />
                </span>
                <span role="button" onClick={() => handleDelete(bill.ID)}>
                  <IconifyIcon icon="la:trash-alt" className="text-secondary font-16" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {filteredBills.length > itemsPerPage && (
        <div className="d-flex justify-content-center">
          <Pagination>{renderPagination()}</Pagination>
        </div>
      )}

      {filteredBills.length === 0 && (
        <div className="text-center text-muted py-4">
          ไม่พบข้อมูลที่ค้นหา
        </div>
      )}
    </ComponentContainerCard>
  )
}

export default BillsTable
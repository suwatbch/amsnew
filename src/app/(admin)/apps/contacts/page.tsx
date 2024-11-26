// src/components/Contacts.tsx

'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import clsx from 'clsx'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  FormCheck,
  Row,
  Spinner,
  Alert,
  Table,
  Image,
  Button,
  Modal,
} from 'react-bootstrap'
import { deletetenant } from '@/api/axios/tenant'
import BookingOrContractForm from '../createnant/page'
 
// กำหนด TypeScript interface สำหรับ User
interface User {
  ID: number
  Firstname: string
  lastname: string
  IDcard: string
  Phone: number
  Address: string
  Status: boolean
  Building: string
  ContactAbout: string
  IsDelete: boolean
  Images: string
  createDate: string
  updateDate: string
}

// ฟังก์ชันในการดึงข้อมูล tenants (ผู้ติดต่อ) โดยใช้ axios
const gettenant = async (): Promise<User[]> => {
  const url = 'http://localhost:3000/api/handler/tenant/lists' // ปรับ URL ตามความเหมาะสม
  try {
    const response = await axios.get<User[]>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching tenants:', error)
    throw error
  }
}

const Contacts: React.FC = () => {
  const filters: string[] = ['All', 'New', 'Active', 'InActive']

  // State สำหรับ contacts
  const [contacts, setContacts] = useState<User[]>([])
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false)
  const [errorContacts, setErrorContacts] = useState<string | null>(null)

  // State สำหรับการแก้ไข
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [selectedContact, setSelectedContact] = useState<User | null>(null)

  // State สำหรับการลบ
  const [deleting, setDeleting] = useState<boolean>(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)

  // ฟังก์ชันในการดึงข้อมูล contacts
  const fetchContacts = async (): Promise<void> => {
    setLoadingContacts(true)
    setErrorContacts(null)
    try {
      const users: User[] = await gettenant()
      setContacts(users)
    } catch (error) {
      setErrorContacts('Failed to load contacts.')
    } finally {
      setLoadingContacts(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  // ตั้งค่าชื่อเรื่องของหน้า
  useEffect(() => {
    document.title = 'Contacts'
  }, [])

  // ฟังก์ชันเพื่อกำหนดแหล่งที่มาของภาพ
  const getImageSrc = (image: string): string => {
    if (!image) return ''

    if (image.startsWith('data:image/')) {
      return image
    }

    // สมมติว่าเป็น JPEG หากไม่ใช่ให้ปรับตามชนิดภาพที่ใช้
    return `data:image/jpeg;base64,${image}`
  }

  // ฟังก์ชันสำหรับเปิดแบบฟอร์มแก้ไข
  const handleEdit = (contact: User) => {
    setSelectedContact(contact)
    setShowEditForm(true)
  }

  // ฟังก์ชันสำหรับเปิดแบบฟอร์มสร้างใหม่
  const handleAdd = () => {
    setSelectedContact(null)
    setShowEditForm(true)
  }

  // ฟังก์ชันสำหรับปิดแบบฟอร์มแก้ไข/สร้างใหม่
  const handleCloseForm = () => {
    setSelectedContact(null)
    setShowEditForm(false)
  }

  // ฟังก์ชันหลังจากบันทึกข้อมูลสำเร็จ
  const handleSuccess = () => {
    fetchContacts()
  }

  // ฟังก์ชันสำหรับลบ contact
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ที่ต้องการลบข้อมูลนี้?')
    if (!confirmDelete) return

    setDeleting(true)
    setDeleteError(null)
    setDeleteSuccess(null)

    try {
      await deletetenant(id)
      setDeleteSuccess('ลบข้อมูลสำเร็จ')
      fetchContacts()
    } catch (error) {
      console.error('Error deleting tenant:', error)
      setDeleteError('เกิดข้อผิดพลาดในการลบข้อมูล')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Row>
      <Col xs={12}>
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <Col>
                <CardTitle as="h4">Contacts</CardTitle>
              </Col>
              <Col xs="auto">
                <form className="row g-2">
                  <Col xs="auto">
                    <Dropdown>
                      <DropdownToggle
                        variant="link"
                        className="btn bg-primary-subtle text-primary d-flex align-items-center arrow-none"
                        role="button"
                      >
                        <IconifyIcon icon="iconoir:filter-alt" className="me-1" /> Filter
                      </DropdownToggle>
                      <DropdownMenu align="start">
                        <div className="p-2">
                          {filters.map((filter, idx) => (
                            <FormCheck
                              key={idx}
                              id={`filter-${idx}`}
                              label={filter}
                              className={clsx({ 'mb-2': filters.length - 1 !== idx })}
                              defaultChecked
                              type="checkbox"
                            />
                          ))}
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                  <Col xs="auto">
                    {/* ปุ่ม Add Contact เปิดแบบฟอร์มในโหมดสร้างใหม่ */}
                    <Button variant="primary" onClick={handleAdd}>
                      <IconifyIcon icon="fa6-solid:plus" className="me-1" /> Add Contact
                    </Button>
                  </Col>
                </form>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="pt-0">
            {/* แสดงข้อความลบสำเร็จหรือผิดพลาด */}
            {deleteSuccess && (
              <Alert variant="success" onClose={() => setDeleteSuccess(null)} dismissible>
                {deleteSuccess}
              </Alert>
            )}
            {deleteError && (
              <Alert variant="danger" onClose={() => setDeleteError(null)} dismissible>
                {deleteError}
              </Alert>
            )}

            {loadingContacts ? (
              <div className="d-flex justify-content-center my-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading contacts...</span>
                </Spinner>
              </div>
            ) : errorContacts ? (
              <Alert variant="danger">{errorContacts}</Alert>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>รูปภาพ</th>
                    <th>ชื่อ</th>
                    <th>IDcard</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Building</th>
                    <th>Contact About</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.ID}>
                      <td>
                        {contact.Images ? (
                          <Image
                            src={getImageSrc(contact.Images)}
                            alt={`${contact.Firstname} ${contact.lastname}`}
                            roundedCircle
                            width={50}
                            height={50}
                          />
                        ) : (
                          <span>ไม่มีรูป</span>  
                        )}
                      </td>
                      <td>{`${contact.Firstname} ${contact.lastname}`}</td>
                      <td>{contact.IDcard}</td>
                      <td>{contact.Phone}</td>
                      <td>{contact.Address}</td>
                      <td>{contact.Status ? 'Active' : 'Inactive'}</td>
                      <td>{contact.Building}</td>
                      <td>{contact.ContactAbout}</td>
                      <td>
                        {/* ปุ่มสำหรับการกระทำ เช่น แก้ไขหรือลบ */}
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(contact)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(contact.ID)}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{' '}
                              ลบ...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Col>

      {/* Modal สำหรับเพิ่มหรือแก้ไข Contact */}
      {showEditForm && (
        <BookingOrContractForm
          initialData={selectedContact || undefined}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </Row>
  )
}

export default Contacts

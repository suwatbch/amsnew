// components/Invoice.tsx
'use client'
import * as Yup from 'yup';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
// Auth & Hooks
import { useSession } from 'next-auth/react'

// Bootstrap & CSS
import { Button, Card, CardBody, Col, Row, Spinner, Form, Table } from 'react-bootstrap'
import Image from 'next/image'

// Components
import InvoicePrintButton from './components/InvoicePrintButton'
import { currency } from '@/context/constants'
import { getBillById } from '@/api/axios/bills'

// Types
import { BillData, BillItem } from '@/api/types/data'

// Image Assets
import logoSmLight from '@/assets/images/logo-sm-light.png'
import signature from '@/assets/images/extra/signature.png'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import Swal from 'sweetalert2'


const BillItemSchema = Yup.object().shape({
  BillName: Yup.string()
    .required('กรุณาระบุชื่อรายการ')
    .min(2, 'ชื่อรายการต้องมีความยาวอย่างน้อย 2 ตัวอักษร'),
  Price: Yup.number()
    .required('กรุณาระบุราคา')
    .min(0, 'ราคาต้องไม่ติดลบ'),
  Quantity: Yup.number()
    .required('กรุณาระบุจำนวน')
    .min(1, 'จำนวนต้องมากกว่า 0'),
  Description: Yup.string().nullable()
});


const BillSchema = Yup.object().shape({
  ID: Yup.number(),
  Roomid: Yup.number()
    .required('กรุณาระบุหมายเลขห้อง')
    .min(0, 'หมายเลขห้องต้องไม่ติดลบ'),
  date: Yup.date().nullable(),
  BilledToName: Yup.string().nullable(),
  BilledToContact: Yup.string().nullable(),
  BilledToAddress: Yup.string().nullable(),
  BilledToCity: Yup.string().nullable(),
  BilledToPhone: Yup.string().nullable(),
  ShippedToAddress: Yup.string().nullable(),
  ShippedToCity: Yup.string().nullable(),
  ShippedToPhone: Yup.string().nullable(),
  billnameData: Yup.array()
    .of(BillItemSchema)
    .min(1, 'ต้องมีรายการอย่างน้อย 1 รายการ')
    .required('กรุณาเพิ่มรายการ')
});


const Invoice = () => {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || '0'
  const router = useRouter()

  const [billData, setBillData] = useState<BillData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedBillData, setEditedBillData] = useState<BillData | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isNewBill, setIsNewBill] = useState<boolean>(false)

  const initializeNewBill = () => {
    const newBill: BillData = {
      ID: 0,
      Roomid: 0,
      date: new Date().toISOString().split('T')[0],
      BilledToName: '',
      BilledToContact: '',
      BilledToAddress: '',
      BilledToCity: '',
      BilledToPhone: '',
      ShippedToAddress: '',
      ShippedToCity: '',
      ShippedToPhone: '',
      billnameData: [],
    }
    setBillData(newBill)
    setEditedBillData(newBill)
    setIsEditing(true)
    setLoading(false)
  }
  const fetchBillById = async (billId: string) => {
    const numericId = parseInt(billId)

    // Initialize new bill if ID is 0
    if (numericId === 0) {
      setIsNewBill(true)
      initializeNewBill()
      return
    }

    try {
      const data = await getBillById(numericId)
      setBillData(data)
      setEditedBillData(data)
      setIsNewBill(false)
      setLoading(false)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.message)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลบิลจากเซิร์ฟเวอร์')
      } else {
        console.error('Unexpected error:', err)
        setError('เกิดข้อผิดพลาดที่ไม่คาดคิด')
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBillById(id)
  }, [id])

  // คำนวณยอดรวม
  const calculateSubtotal = (): number => {
    if (!billData || !billData.billnameData) return 0
    return billData.billnameData.reduce((acc: number, item: BillItem) => {
      const price = parseFloat(item.Price) || 0
      const quantity = item.Quantity || 1
      return acc + price * quantity
    }, 0)
  }

  // คำนวณยอดรวมทั้งหมด
  const subtotal = calculateSubtotal()
  const taxRate = 0.07 // อัตราภาษี 7%
  const tax = subtotal * taxRate
  const total = subtotal + tax

  // Currency Formatter
  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const validateForm = async (): Promise<boolean> => {
    try {
      await BillSchema.validate(editedBillData, {
        abortEarly: false // เพื่อให้เช็ค error ทั้งหมด ไม่ใช่แค่ตัวแรกที่เจอ
      });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = err.inner.reduce((acc: string[], error) => {
          if (error.message) {
            acc.push(error.message);
          }
          return acc;
        }, []);

        await Swal.fire({
          title: 'ข้อมูลไม่ถูกต้อง',
          html: errors.map(msg => `- ${msg}`).join('<br>'),
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        });
      }
      return false;
    }
  };


  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (isNewBill) {
      initializeNewBill()
    } else {
      setIsEditing(false)
      setEditedBillData(billData)
    }
    setSaveError(null)
  }

  // Handle Input Change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedBillData) return
    const { name, value } = e.target
    setEditedBillData({
      ...editedBillData,
      [name]: value,
    })
  }

  // Handle Item Change
  const handleItemChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedBillData) return
    const { name, value } = e.target
    const updatedItems = [...editedBillData.billnameData]
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    }
    setEditedBillData({
      ...editedBillData,
      billnameData: updatedItems,
    })
  }

  // Handle Add Item
  const handleAddItem = () => {
    if (!editedBillData) return
    const newItem: BillItem = {
      BillName: '',
      Price: '0',
      Quantity: 1,
      Description: '',
    }
    setEditedBillData({
      ...editedBillData,
      billnameData: [...editedBillData.billnameData, newItem],
    })
  }

  // Handle Remove Item
  const handleRemoveItem = (index: number) => {
    if (!editedBillData) return
    const updatedItems = editedBillData.billnameData.filter((_: any, i: any) => i !== index)
    setEditedBillData({
      ...editedBillData,
      billnameData: updatedItems,
    })
  }
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editedBillData) return;

    const isValid = await validateForm();
    if (!isValid) return;

    setSaving(true);
    setSaveError(null);

    try {
      const requestBody = {
        ID: editedBillData.ID,
        Roomid: editedBillData.Roomid,
        date: editedBillData.date,
        BilledToName: editedBillData.BilledToName,
        BilledToContact: editedBillData.BilledToContact,
        BilledToAddress: editedBillData.BilledToAddress,
        BilledToCity: editedBillData.BilledToCity,
        BilledToPhone: editedBillData.BilledToPhone,
        ShippedToAddress: editedBillData.ShippedToAddress,
        ShippedToCity: editedBillData.ShippedToCity,
        ShippedToPhone: editedBillData.ShippedToPhone,
        billnameData: editedBillData.billnameData.map(item => ({
          BillName: item.BillName,
          Price: Number(item.Price) || 0,
          Quantity: Number(item.Quantity) || 1,
          Description: item.Description
        }))
      };

      await axios.post('/api/handler/bills/create', requestBody);

      await Swal.fire({
        title: 'บันทึกสำเร็จ',
        text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect กลับไปหน้า lists
      router.push('/apps/invoice/lists');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.message);
        setSaveError('เกิดข้อผิดพลาดในการบันทึกข้อมูลบิล');
      } else {
        console.error('Unexpected error:', err);
        setSaveError('เกิดข้อผิดพลาดที่ไม่คาดคิด');
      }
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status"></Spinner>
        <span>กำลังโหลด...</span>
      </div>
    )
  }

  if (error) {
    return <p className="text-danger">{error}</p>
  }

  return (
    <Row>
      <Col xs={12}>
        <Card>
          {/* ส่วนหัวบิล */}
          <CardBody className="bg-black text-white">
            <Row>
              <Col xs={4} className="align-self-center">
                <Image src={logoSmLight} alt="โลโก้" className="logo-sm me-1" height={70} />
              </Col>
              <Col xs={8} className="text-end align-self-center">
                {isEditing || isNewBill ? (
                  <Form onSubmit={handleSave}>
                    <Form.Group as={Row} className="mb-2" controlId="invoiceId">
                      <Form.Label column xs={4} className="text-muted">
                        เลขที่บิล:
                      </Form.Label>
                      <Col xs={8}>
                        <Form.Control type="text" name="ID" value={editedBillData?.ID} disabled />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2" controlId="issueDate">
                      <Form.Label column xs={4} className="text-muted">
                        วันที่ออกบิล:
                      </Form.Label>
                      <Col xs={8}>
                        <Form.Control
                          type="date"
                          name="date"
                          value={editedBillData?.date ? editedBillData.date.split('T')[0] : ''}
                          onChange={handleInputChange}
                          required
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2" controlId="Roomid">
                      <Form.Label column xs={4} className="text-muted">
                        หมายเลขห้อง:
                      </Form.Label>
                      <Col xs={8}>
                        <Form.Control type="text" name="Roomid" value={editedBillData?.Roomid || ''} onChange={handleInputChange} required />
                      </Col>
                    </Form.Group>
                  </Form>
                ) : (
                  <>
                    <h5 className="mb-1 fw-semibold text-white">
                      <span className="text-muted">เลขที่บิล:</span> #{billData?.ID}
                    </h5>
                    <h5 className="mb-0 fw-semibold text-white">
                      <span className="text-muted">วันที่ออกบิล:</span>{' '}
                      {billData?.date
                        ? new Date(billData.date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'ไม่ระบุ'}
                    </h5>
                    <h5 className="mb-0 fw-semibold text-white">
                      <span className="text-muted">หมายเลขห้อง:</span> {billData?.Roomid}
                    </h5>
                  </>
                )}
              </Col>
            </Row>
          </CardBody>

          {/* ส่วนข้อมูลผู้รับบิล */}
          <CardBody>
            <Form onSubmit={handleSave}>
              <Row className="row-cols-3 d-flex justify-content-md-between">
                {/* ข้อมูลผู้รับบิล */}
                <Col md={3} className="d-print-flex align-self-center">
                  <div>
                    <span className="badge rounded text-dark bg-light">ข้อมูลผู้รับบิล</span>
                    {isEditing ? (
                      <>
                        <Form.Group className="mb-2" controlId="billedToName">
                          <Form.Label>ชื่อผู้รับ</Form.Label>
                          <Form.Control
                            type="text"
                            name="BilledToName"
                            value={editedBillData?.BilledToName || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="billedToContact">
                          <Form.Label>ช่องทางการติดต่อ</Form.Label>
                          <Form.Control
                            type="text"
                            name="BilledToContact"
                            value={editedBillData?.BilledToContact || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <h5 className="my-1 fw-semibold fs-18">{billData?.BilledToName || ''}</h5>
                        <p className="text-muted">{billData?.BilledToContact || ''}</p>
                      </>
                    )}
                  </div>
                </Col>

                {/* ที่อยู่สำหรับออกบิล */}
                <Col md={3} className="d-print-flex align-self-center">
                  <div>
                    <address className="fs-13">
                      <strong className="fs-14">ที่อยู่สำหรับออกบิล:</strong>
                      {isEditing ? (
                        <>
                          <Form.Group className="mb-2" controlId="billedToAddress">
                            <Form.Label>ที่อยู่</Form.Label>
                            <Form.Control
                              type="text"
                              name="BilledToAddress"
                              value={editedBillData?.BilledToAddress || ''}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2" controlId="billedToCity">
                            <Form.Label>เขต/อำเภอ</Form.Label>
                            <Form.Control
                              type="text"
                              name="BilledToCity"
                              value={editedBillData?.BilledToCity || ''}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2" controlId="billedToPhone">
                            <Form.Label>เบอร์โทรศัพท์</Form.Label>
                            <Form.Control type="text" name="BilledToPhone" value={editedBillData?.BilledToPhone || ''} onChange={handleInputChange} />
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <br />
                          {billData?.BilledToAddress} <br />
                          {billData?.BilledToCity}
                          <br />
                          <abbr title="Phone">โทร:</abbr> {billData?.BilledToPhone}
                        </>
                      )}
                    </address>
                  </div>
                </Col>

                {/* ที่อยู่สำหรับจัดส่ง */}
                <Col md={3} className="d-print-flex align-self-center">
                  <div>
                    <address className="fs-13">
                      <strong className="fs-14">ที่อยู่สำหรับจัดส่ง:</strong>
                      {isEditing ? (
                        <>
                          <Form.Group className="mb-2" controlId="shippedToAddress">
                            <Form.Label>ที่อยู่จัดส่ง</Form.Label>
                            <Form.Control
                              type="text"
                              name="ShippedToAddress"
                              value={editedBillData?.ShippedToAddress || ''}
                              onChange={handleInputChange}
                              
                            />
                          </Form.Group>
                          <Form.Group className="mb-2" controlId="shippedToCity">
                            <Form.Label>เขต/อำเภอ</Form.Label>
                            <Form.Control
                              type="text"
                              name="ShippedToCity"
                              value={editedBillData?.ShippedToCity || ''}
                              onChange={handleInputChange}
                              
                            />
                          </Form.Group>
                          <Form.Group className="mb-2" controlId="shippedToPhone">
                            <Form.Label>เบอร์โทรศัพท์</Form.Label>
                            <Form.Control
                              type="text"
                              name="ShippedToPhone"
                              value={editedBillData?.ShippedToPhone || ''}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <br />
                          {billData?.ShippedToAddress}
                          <br />
                          {billData?.ShippedToCity}
                          <br />
                          <abbr title="Phone">โทร:</abbr> {billData?.ShippedToPhone}
                        </>
                      )}
                    </address>
                  </div>
                </Col>
              </Row>

              {/* ตารางรายการสินค้า */}
              <Row>
                <Col lg={12}>
                  <div className="table-responsive project-invoice">
                    <Table bordered className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>รายการ</th>
                          <th>จำนวน</th>
                          <th>ราคาต่อหน่วย</th>
                          <th>รวมเงิน</th>
                          {isEditing && <th>จัดการ</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {editedBillData?.billnameData && editedBillData.billnameData.length > 0 ? (
                          editedBillData.billnameData.map((item, index) => (
                            <tr key={index}>
                              <td>
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      type="text"
                                      name="BillName"
                                      value={item.BillName}
                                      onChange={(e) => handleItemChange(index, e)}
                                      required
                                      placeholder="ชื่อรายการ"
                                    />
                                    <Form.Control
                                      as="textarea"
                                      rows={1}
                                      name="Description"
                                      value={item.Description || ''}
                                      onChange={(e) => handleItemChange(index, e)}
                                      placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                                      className="mt-1"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <h5 className="mt-0 mb-1 fs-14">{item.BillName}</h5>
                                    <p className="mb-0 text-muted">{item.Description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                                  </>
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <Form.Control
                                    type="number"
                                    name="Quantity"
                                    value={item.Quantity || 1}
                                    onChange={(e) => handleItemChange(index, e)}
                                    min={1}
                                    required
                                  />
                                ) : (
                                  item.Quantity || 1
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <Form.Control
                                    type="number"
                                    name="Price"
                                    value={item.Price}
                                    onChange={(e) => handleItemChange(index, e)}
                                    min={0}
                                    step="0.01"
                                    required
                                  />
                                ) : (
                                  formatter.format(parseFloat(item.Price) || 0)
                                )}
                              </td>
                              <td>{formatter.format((parseFloat(item.Price) || 0) * (item.Quantity || 1))}</td>
                              {isEditing && (
                                <td>
                                  <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)}>
                                    ลบ
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isEditing ? 5 : 4} className="text-center">
                              {isEditing ? 'ไม่มีรายการ คลิกปุ่ม "เพิ่มรายการ" เพื่อเพิ่มรายการใหม่' : 'ไม่พบรายการ'}
                            </td>
                          </tr>
                        )}

                        {/* ยอดรวม */}
                        <tr>
                          <td colSpan={isEditing ? 3 : 2} className="border-0" />
                          <td className="border-0 fs-14 text-dark">
                            <b>ยอดรวม</b>
                          </td>
                          <td className="border-0 fs-14 text-dark">
                            <b>{formatter.format(subtotal)}</b>
                          </td>
                        </tr>

                        {/* ภาษีมูลค่าเพิ่ม */}
                        <tr>
                          <td colSpan={isEditing ? 3 : 2} className="border-0" />
                          <td className="border-0 fs-14 text-dark">
                            <b>ภาษีมูลค่าเพิ่ม (7%)</b>
                          </td>
                          <td className="border-0 fs-14 text-dark">
                            <b>{formatter.format(tax)}</b>
                          </td>
                        </tr>

                        {/* ยอดรวมทั้งสิ้น */}
                        <tr>
                          <td colSpan={isEditing ? 3 : 2} className="border-0" />
                          <td className="border-0 fs-14">
                            <b>ยอดรวมทั้งสิ้น</b>
                          </td>
                          <td className="border-0 fs-14">
                            <b>{formatter.format(total)}</b>
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                    {/* ปุ่มเพิ่มรายการ */}
                    {isEditing && (
                      <Button variant="success" className="mt-2" onClick={handleAddItem}>
                        เพิ่มรายการ
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>

              {/* ส่วนปุ่มบันทึก/ยกเลิกเมื่อกำลังแก้ไข */}
              {isEditing && (
                <>
                  {saveError && <p className="text-danger">{saveError}</p>}
                  <Row className="mt-3">
                    <Col lg={6}></Col>
                    <Col lg={6} className="align-self-center">
                      <div className="float-end d-flex gap-2">
                        <Button variant="success" type="submit" disabled={saving}>
                          {saving ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                              กำลังบันทึก...
                            </>
                          ) : (
                            'บันทึก'
                          )}
                        </Button>
                        <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                          ยกเลิก
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Form>
          </CardBody>

          {/* ส่วนท้ายบิล - แสดงเมื่อไม่ได้อยู่ในโหมดแก้ไข */}
          {!isEditing && (
            <CardBody>
              <Row>
                <Col lg={6}>
                  <h5 className="mt-4">เงื่อนไขและข้อตกลง:</h5>
                  <ul className="ps-3">
                    <li>
                      <small className="fs-12">กรุณาชำระเงินภายใน 7 วันนับจากวันที่ได้รับบิล</small>
                    </li>
                    <li>
                      <small className="fs-12">สามารถชำระด้วยเงินสด บัตรเครดิต หรือโอนเงินผ่านธนาคาร</small>
                    </li>
                    <li>
                      <small className="fs-12">หากไม่ชำระภายในกำหนด อาจมีค่าปรับเพิ่มเติมตามที่ระบุไว้ข้างต้น</small>
                    </li>
                  </ul>
                </Col>
                <Col lg={6} className="align-self-center">
                  <div className="float-none float-md-end" style={{ width: '30%' }}>
                    <small>ผู้จัดการบัญชี</small>
                    <Image src={signature} alt="ลายเซ็น" className="mt-2 mb-1" height={24} />
                    <p className="border-top">ลายเซ็น</p>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row className="d-flex justify-content-center">
                <Col lg={12} xl={4} className="ms-auto align-self-center">
                  <div className="text-center">
                    <small className="fs-12">ขอขอบคุณที่ใช้บริการ</small>
                  </div>
                </Col>
                <Col lg={12} xl={4}>
                  <div className="float-end d-flex d-print-none mt-2 mt-md-0 gap-1">
                    <InvoicePrintButton/>
                    {!isEditing && (
                      <Button variant="primary" className="mt-3" onClick={handleEdit}>
                        แก้ไข
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default Invoice

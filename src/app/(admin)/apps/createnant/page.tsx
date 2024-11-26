'use client';
import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
  Tabs,
  Tab,
  Alert,
  Modal,
} from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { getThaiApi } from '@/api/axios/thaiApi';
import axios from 'axios';
import Select from 'react-select';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Webcam from 'react-webcam';
import './BookingOrContractForm.css';
import { createtenant, updatetenant } from '@/api/axios/tenant';
import { useRouter } from 'next/navigation';

// ประเภทข้อมูลสำหรับตำบล
type Tambon = {
  id: number;
  zip_code: string;
  name_th: string;
  name_en: string;
  amphure_id: number;
};

// ประเภทข้อมูลสำหรับอำเภอ
type Amphure = {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  tambon: Tambon[];
};

// ประเภทข้อมูลสำหรับจังหวัด
type Province = {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  amphure: Amphure[];
};

// โครงสร้างสำหรับ react-select options
type OptionType = {
  value: string;
  label: string;
};

// ประเภทข้อมูลสำหรับ props
interface BookingOrContractFormProps {
  initialData?: User; // ข้อมูลเริ่มต้นสำหรับการแก้ไข (optional)
  onClose?: () => void; // ฟังก์ชันปิดแบบฟอร์ม (optional)
  onSuccess?: () => void; // ฟังก์ชันหลังจากบันทึกสำเร็จ (optional)
}

// ประเภทข้อมูลสำหรับ User (ควรใช้ TypeScript interface เดียวกันกับ Contacts)
interface User {
  ID: number;
  Firstname: string;
  lastname: string;
  IDcard: string;
  Phone: number;
  Address: string;
  Status: boolean;
  Building: string;
  ContactAbout: string;
  IsDelete: boolean;
  Images: string;
  createDate: string;
  updateDate: string;
}

const BookingOrContractForm: React.FC<BookingOrContractFormProps> = ({ initialData, onClose, onSuccess }) => {
  const router = useRouter();
  const [mode, setMode] = useState<'booking' | 'contract'>('booking');

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<Amphure[]>([]);
  const [subDistricts, setSubDistricts] = useState<Tambon[]>([]);
  const [addressData, setAddressData] = useState<{
    houseNumber: string;
    province: OptionType | null;
    district: OptionType | null;
    subDistrict: OptionType | null;
    postalCode: string;
  }>({
    houseNumber: initialData?.Address.split(' ')[0] || '',
    province: initialData ? { value: '', label: '' } : null,
    district: initialData ? { value: '', label: '' } : null,
    subDistrict: initialData ? { value: '', label: '' } : null,
    postalCode: '',
  });

  const [formData, setFormData] = useState<{
    Firstname: string;
    Lastname: string;
    IDcard: string;
    Phone: number | '';
    Address: string;
    IsDelete: boolean;
    Prefix: string;
    note: string;
    ContractFile?: string;
  }>({
    Firstname: initialData?.Firstname || '',
    Lastname: initialData?.lastname || '',
    IDcard: initialData?.IDcard || '',
    Phone: initialData?.Phone || '',
    Address: initialData?.Address || '',
    IsDelete: initialData?.IsDelete || false,
    Prefix: '', // คุณอาจต้องปรับให้รับ Prefix จาก initialData ถ้ามี
    note: '', // คุณอาจต้องปรับให้รับ note จาก initialData ถ้ามี
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(initialData?.Images || null);
  const [error, setError] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(initialData?.Images || null);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);

  // ฟังก์ชันสำหรับดึงข้อมูลโค้ดไปรษณีย์
  const getzipcode = () => {
    const apithai = getThaiApi();
    console.log(apithai);
  };

  useEffect(() => {
    getzipcode();
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูลจังหวัด เขต อำเภอ และตำบล
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Province[]>(
          'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json'
        );
        setProvinces(response.data);
        // ถ้าเป็นโหมดแก้ไข ให้ตั้งค่าเลือกจังหวัด เขต อำเภอ และตำบล
        if (initialData) {
          // สมมติว่ามีวิธีแยกข้อมูล Address ออกเป็นส่วนๆ
          // คุณอาจต้องปรับวิธีนี้ตามโครงสร้างของ Address
          const addressParts = initialData.Address.split(' ');
          const houseNumber = addressParts[0];
          const subDistrictName = addressParts[1];
          const districtName = addressParts[2];
          const provinceName = addressParts[3];
          const postalCode = addressParts[4];

          const selectedProvince = response.data.find(p => p.name_th === provinceName);
          if (selectedProvince) {
            setAddressData(prev => ({
              ...prev,
              province: { value: selectedProvince.name_th, label: selectedProvince.name_th },
            }));
            setDistricts(selectedProvince.amphure);
            const selectedDistrict = selectedProvince.amphure.find(a => a.name_th === districtName);
            if (selectedDistrict) {
              setAddressData(prev => ({
                ...prev,
                district: { value: selectedDistrict.name_th, label: selectedDistrict.name_th },
              }));
              setSubDistricts(selectedDistrict.tambon);
              const selectedSubDistrict = selectedDistrict.tambon.find(t => t.name_th === subDistrictName);
              if (selectedSubDistrict) {
                setAddressData(prev => ({
                  ...prev,
                  subDistrict: { value: selectedSubDistrict.name_th, label: selectedSubDistrict.name_th },
                  postalCode: selectedSubDistrict.zip_code,
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [initialData]);

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงจังหวัด
  const handleProvinceChange = (selectedOption: OptionType | null) => {
    setAddressData({
      ...addressData,
      province: selectedOption,
      district: null,
      subDistrict: null,
      postalCode: ''
    });
    const selectedProvince = provinces.find(item => item.name_th === selectedOption?.value);
    setDistricts(selectedProvince ? selectedProvince.amphure : []);
    setSubDistricts([]); // ล้างตำบลเมื่อจังหวัดเปลี่ยน
  };

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงเขต/อำเภอ
  const handleDistrictChange = (selectedOption: OptionType | null) => {
    setAddressData({
      ...addressData,
      district: selectedOption,
      subDistrict: null,
      postalCode: ''
    });
    const selectedDistrict = districts.find(item => item.name_th === selectedOption?.value);
    setSubDistricts(selectedDistrict ? selectedDistrict.tambon : []);
  };

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงแขวง/ตำบล
  const handleSubDistrictChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      const selectedSubDistrict = subDistricts.find(item => item.name_th === selectedOption.value);
      setAddressData(prevState => ({
        ...prevState,
        subDistrict: selectedOption,
        postalCode: selectedSubDistrict ? selectedSubDistrict.zip_code : ''
      }));
      // สร้าง Address จากข้อมูลที่อยู่
      const fullAddress = `${addressData.houseNumber} ${selectedOption.label || ''} ${addressData.district?.label || ''} ${addressData.province?.label || ''} ${selectedSubDistrict ? selectedSubDistrict.zip_code : ''}`;
      setFormData(prevFormData => ({
        ...prevFormData,
        Address: fullAddress
      }));
    } else {
      setAddressData(prevState => ({
        ...prevState,
        subDistrict: null,
        postalCode: ''
      }));
      setFormData(prevFormData => ({
        ...prevFormData,
        Address: addressData.houseNumber
      }));
    }
  };

  // ฟังก์ชันสำหรับแปลงข้อมูลเป็นรูปแบบที่ react-select ต้องการ
  const getOptions = (items: any[], labelKey: string = 'name_th'): OptionType[] => {
    return items.map(item => ({
      value: item[labelKey],
      label: item[labelKey]
    }));
  };

  // ฟังก์ชันเมื่อส่งฟอร์ม
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // รีเซ็ตข้อความแสดงข้อผิดพลาดก่อนหน้านี้
    setError(null);

    // ตรวจสอบว่าในโหมด "ทำสัญญา" ต้องอัปโหลดไฟล์
    if (mode === 'contract' && !uploadedFile) {
      setError('กรุณาอัปโหลดไฟล์สัญญา (.doc หรือ .docx) ก่อนทำการบันทึกข้อมูล');
      return;
    }

    // ตรวจสอบการอัปโหลดรูปภาพ
    if (!base64Image) {
      setError('กรุณาถ่ายรูปภาพ');
      return;
    }

    // เตรียมข้อมูลที่อยู่
    const fullAddress = `${addressData.houseNumber} ${addressData.subDistrict?.label || ''} ${addressData.district?.label || ''} ${addressData.province?.label || ''} ${addressData.postalCode || ''}`;

    // สร้างอ็อบเจ็กต์ datatenant และรวมสตริง Base64 ของรูปภาพ
    const datatenant: any = {
      ...formData,
      Firstname: `${formData.Prefix} ${formData.Firstname}`,
      Address: fullAddress,
      Images: base64Image, // ส่งเป็นสตริง Base64 เดียว
    };

    // ถ้ามีไฟล์สัญญา ให้แปลงเป็น Base64 และเพิ่มเข้าไปใน datatenant
    if (mode === 'contract' && uploadedFile) {
      try {
        const contractFileBase64 = await fileToBase64(uploadedFile);
        datatenant.ContractFile = contractFileBase64;
      } catch (err) {
        console.error('Error converting contract file to base64:', err);
        setError('เกิดข้อผิดพลาดในการแปลงไฟล์สัญญา');
        return;
      }
    }

    try {
      let response;
      if (initialData) {
        // โหมดแก้ไข
        response = await updatetenant(initialData.ID, datatenant);
      } else {
        // โหมดสร้างใหม่
        response = await createtenant(datatenant);
      }
      console.log('Success:', response.data);
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      } else {
        router.push('/apps/contacts'); // ปรับเส้นทางตามที่คุณต้องการ
      }
    } catch (error) {
      console.error('Error:', error);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // ฟังก์ชันสำหรับแปลงไฟล์เป็น Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ฟังก์ชันสำหรับถ่ายภาพจากกล้อง
  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // แปลง base64 เป็น File object
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `captured_${Date.now()}.png`, { type: 'image/png' });

          // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
          if (file.size > 5 * 1024 * 1024) {
            setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
            return;
          }

          setCapturedImage(imageSrc);
          setShowWebcam(false);

          // แปลงไฟล์เป็น Base64
          const reader = new FileReader();
          reader.onloadend = () => {
            setBase64Image(reader.result as string);
          };
          reader.readAsDataURL(file);
        })
        .catch(err => {
          console.error('Error capturing image:', err);
          setError('เกิดข้อผิดพลาดในการถ่ายภาพ');
        });
    }
  };

  // ฟังก์ชันสำหรับปิดกล้องโดยไม่ถ่ายภาพ
  const cancelCapture = () => {
    setShowWebcam(false);
  };

  const formContent = (
    <>
      {/* ปุ่มสลับระหว่าง จอง และ ทำสัญญา เป็นแท็บ */}
      <Tabs
        id="booking-contract-tabs"
        activeKey={mode}
        onSelect={(k) => k && setMode(k as 'booking' | 'contract')}
        className="mb-3 justify-content-center"
        justify
      >
        <Tab eventKey="booking" title="จอง">
          <SwitchTransition>
            <CSSTransition
              key={mode}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div>
                {/* เนื้อหาสำหรับโหมดจอง */}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Tab>
        <Tab eventKey="contract" title="ทำสัญญา">
          <SwitchTransition>
            <CSSTransition
              key={mode}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div>
                {/* เนื้อหาสำหรับโหมดทำสัญญา */}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Tab>
      </Tabs>

      {/* แสดงข้อความข้อผิดพลาดถ้ามี */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Form onSubmit={handleSubmit}>
        {/* ฟิลด์คำนำหน้า, ชื่อ, สกุล */}
        <Row className="mb-3">
          <FormLabel column sm={2}>
            คำนำหน้า
          </FormLabel>
          <Col sm={4}>
            <Form.Select
              value={formData.Prefix}
              onChange={(e) => setFormData({ ...formData, Prefix: e.target.value })}
              required
            >
              <option value="">เลือกคำนำหน้า</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
            </Form.Select>
          </Col>
          <FormLabel column sm={2}>
            ชื่อ *
          </FormLabel>
          <Col sm={4}>
            <FormControl
              type="text"
              placeholder="ชื่อ"
              required
              value={formData.Firstname}
              onChange={(e) => setFormData({ ...formData, Firstname: e.target.value })}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={2}>
            สกุล *
          </FormLabel>
          <Col sm={4}>
            <FormControl
              type="text"
              placeholder="สกุล"
              required
              value={formData.Lastname}
              onChange={(e) => setFormData({ ...formData, Lastname: e.target.value })}
            />
          </Col>
          <FormLabel column sm={2}>
            รหัสบัตรประชาชน *
          </FormLabel>
          <Col sm={4}>
            <FormControl
              type="text"
              placeholder="รหัสบัตรประชาชน"
              required
              value={formData.IDcard}
              onChange={(e) => setFormData({ ...formData, IDcard: e.target.value })}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={2}>
            เบอร์โทรศัพท์ *
          </FormLabel>
          <Col sm={4}>
            <FormControl
              type="tel"
              placeholder="เบอร์โทรศัพท์"
              required
              value={formData.Phone}
              onChange={(e) => setFormData({ ...formData, Phone: e.target.value ? parseInt(e.target.value) : '' })}
            />
          </Col>
        </Row>

        {/* ข้อมูลที่อยู่ตามบัตรประชาชน */}
        <h5 className="mt-4">ข้อมูลที่อยู่ตามบัตรประชาชน</h5>

        <Row className="mb-3">
          <FormLabel column sm={2}>
            บ้านเลขที่
          </FormLabel>
          <Col sm={4}>
            <FormControl
              type="text"
              placeholder="บ้านเลขที่"
              value={addressData.houseNumber}
              onChange={(e) => {
                setAddressData({ ...addressData, houseNumber: e.target.value });
              }}
              required
            />
          </Col>
          <FormLabel column sm={2}>
            จังหวัด
          </FormLabel>
          <Col sm={4}>
            <Select
              value={addressData.province}
              onChange={handleProvinceChange}
              options={getOptions(provinces)}
              placeholder="เลือกจังหวัด"
              isClearable
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={2}>
            เขต/อำเภอ
          </FormLabel>
          <Col sm={4}>
            <Select
              value={addressData.district}
              onChange={handleDistrictChange}
              options={getOptions(districts)}
              placeholder="เลือกเขต/อำเภอ"
              isClearable
              isDisabled={!addressData.province}
            />
          </Col>
          <FormLabel column sm={2}>
            แขวง/ตำบล
          </FormLabel>
          <Col sm={4}>
            <Select
              value={addressData.subDistrict}
              onChange={handleSubDistrictChange}
              options={getOptions(subDistricts)}
              placeholder="เลือกแขวง/ตำบล"
              isClearable
              isDisabled={!addressData.district}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={2}>
            รหัสไปรษณีย์
          </FormLabel>
          <Col sm={4}>
            <FormControl
              type="text"
              placeholder="รหัสไปรษณีย์"
              value={addressData.postalCode}
              readOnly
            />
          </Col>
        </Row>

        {/* ฟิลด์เพิ่มสำหรับรูปภาพ */}
        <h5 className="mt-4">อัปโหลดรูปภาพ</h5>
        <Row className="mb-3">
          <FormLabel column sm={2}>
            รูปภาพ *
          </FormLabel>
          <Col sm={10}>
            {/* ปุ่มถ่ายภาพ */}
            <Button variant="secondary" className="mt-3" onClick={() => setShowWebcam(true)}>
              ถ่ายภาพ
            </Button>
            {/* แสดง Webcam เมื่อเปิด */}
            {showWebcam && (
              <div className="webcam-container mt-3">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  width={320}
                  height={240}
                  videoConstraints={{
                    facingMode: "environment"
                  }}
                />
                <div className="mt-2">
                  <Button variant="primary" onClick={capture} className="me-2">
                    ถ่ายภาพ
                  </Button>
                  <Button variant="secondary" onClick={cancelCapture}>
                    ยกเลิก
                  </Button>
                </div>
              </div>
            )}
            {/* แสดงตัวอย่างรูปภาพที่ถ่าย */}
            {capturedImage && (
              <div className="mt-3 position-relative image-preview">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="preview-img"
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="remove-image-btn"
                  onClick={() => {
                    setCapturedImage(null);
                    setBase64Image(null);
                  }}
                >
                  &times;
                </Button>
              </div>
            )}
          </Col>
        </Row>

        {/* ฟิลด์ Note */}
        <h5 className="mt-4">โน้ต</h5>
        <Row className="mb-3">
          <FormLabel column sm={2}>
            โน้ต
          </FormLabel>
          <Col sm={10}>
            <FormControl
              as="textarea"
              rows={3}
              placeholder="กรุณาใส่โน้ตเพิ่มเติม"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </Col>
        </Row>

        {/* ส่วนแสดงเฉพาะในโหมดทำสัญญา */}
        {mode === 'contract' && (
          <Row className="mb-3">
            <FormLabel column sm={2}>
              แนบไฟล์สัญญา <span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <Col sm={10}>
              <FormControl
                type="file"
                accept=".doc,.docx"
                aria-label="แนบไฟล์สัญญา"
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] || null;

                  if (file) {
                    setError(null);
                    setUploadedFile(file);
                  }
                }}
                required={mode === 'contract'}
              />
              {uploadedFile && (
                <div style={{ marginTop: '8px' }}>
                  <strong>ไฟล์ที่เลือก:</strong> {uploadedFile.name}
                </div>
              )}
            </Col>
          </Row>
        )}

        {/* ปุ่มบันทึกและยกเลิก */}
        <Row className="mt-4">
          <Col className="text-end">
            <Button type="submit" variant="success" className="me-2">
              {initialData ? 'อัพเดต' : 'บันทึกข้อมูล'}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  router.back();
                }
              }}
            >
              ยกเลิก
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );

  return initialData ? (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{'แก้ไขลูกค้า'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ComponentContainerCard title={'แก้ไขลูกค้า'}>
          {formContent}
        </ComponentContainerCard>
      </Modal.Body>
    </Modal>
  ) : (
    <ComponentContainerCard title={'เพิ่มลูกค้าใหม่'}>
      {formContent}
    </ComponentContainerCard>
  );
};

export default BookingOrContractForm;

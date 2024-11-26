import React from 'react';
import { Button, Card, CardBody, Row, Col } from 'react-bootstrap';
import clsx from 'clsx';

// กำหนด Interface สำหรับข้อมูลตึก
interface BuildingData {
  BuildType: string;
  Unit: number;
  reserve: number;
  ID: number;
}

// กำหนด Interface สำหรับ props ของ Cardbuttom
interface CardbuttomProps {
  buildingData: BuildingData;
  onNavigate: (ID: number) => void;
}

// ฟังก์ชันสำหรับสุ่มสีจาก BuildType
const getColorFromBuildType = (buildType: string) => {
  const colors = ['#007bff', '#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6610f2'];
  const index = buildType.charCodeAt(0) % colors.length; // ใช้ตัวอักษรตัวแรกในการเลือกสี
  return colors[index];
};

// Component Cardbuttom
const Cardbuttom = ({ buildingData, onNavigate }: CardbuttomProps) => {
  const { BuildType, Unit, reserve, ID } = buildingData;
  const availableRooms = Unit - reserve;
  const color = getColorFromBuildType(BuildType); // ดึงสีที่สัมพันธ์กับ BuildType

  return (
    <div style={{ margin: '20px', display: 'inline-block', width: '300px' }}>
      <Card className="shadow-sm rounded-3" style={{ overflow: 'hidden', position: 'relative' }}>
        <CardBody>
          <div
            className={clsx(
              'd-flex justify-content-center align-items-center text-white'
            )}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '50px',
              height: '25px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: color,
              borderRadius: '12.5px', // ให้เป็นแคปซูล
              textAlign: 'center',
            }}
          >
            {BuildType}
          </div>

          <Row className="d-flex justify-content-center border-dashed-bottom pb-3">
            <Col xs={9}>
              <p className="text-dark mb-0 fw-semibold fs-14">ตึก: {BuildType}</p>
              <h3 className="mt-2 mb-0 fw-bold">
                {availableRooms} <span className="fs-13 text-muted">ห้องว่าง</span>
              </h3>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center mt-3 text-center">
            <Col xs={6}>
              <h5 className="mb-2 fs-18 mb-0 fw-bold">{Unit}</h5>
              <p className="text-muted mb-0 fw-semibold fs-14">จำนวนห้องทั้งหมด</p>
            </Col>
            <Col xs={6}>
              <h5 className="mb-2 fs-18 mb-0 fw-bold">{reserve}</h5>
              <p className="text-muted mb-0 fw-semibold fs-14">ไม่ว่าง</p>
            </Col>
          </Row>

          <div className="text-center mt-3">
            <Button
              variant="outline-primary"
              type="button"
              className="px-3"
              onClick={() => onNavigate(ID)}
            >
              ดูเพิ่ม
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Cardbuttom;

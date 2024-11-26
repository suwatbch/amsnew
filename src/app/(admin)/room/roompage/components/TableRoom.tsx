import IconifyIcon from '@/components/wrappers/IconifyIcon';
import React, { useState } from 'react';
import { Button, Pagination, Table } from 'react-bootstrap';

interface RoomData {
  RoomNumber: string;
  TypeRoom: string;
  BuildingNumber: string;
  Floor: string;
  Status: string;
  DateCheckout: string;
  DateSigin: string;
  Overdue: string;
  Note: string;
}

interface TableRoomProps {
  borderTableData: RoomData[];
}

const ITEMS_PER_PAGE = 50;

export default function TableRoom({ borderTableData }: TableRoomProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(borderTableData.length / ITEMS_PER_PAGE);

  // ดึงข้อมูลเฉพาะหน้า
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = borderTableData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="table-responsive">
      <Table bordered className="mb-0 table-centered">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Type Room</th>
            <th>Building Number</th>
            <th>Floor</th>
            <th>Status</th>
            <th>Date Sign-in</th>
            <th>Date Checkout</th>
            <th>Overdue</th>
            <th>Note</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item: RoomData, idx: number) => (
            <tr key={idx}>
              <td>{item.RoomNumber || 'N/A'}</td>
              <td>{item.TypeRoom || 'N/A'}</td>
              <td>{item.BuildingNumber || 'N/A'}</td>
              <td>{item.Floor || 'N/A'}</td>
              <td>
                <span className={`badge bg-${item.Status === 'Rejected' ? 'danger' : 'success'}`}>
                  {item.Status || 'N/A'}
                </span>
              </td>
              <td>{item.DateSigin || 'N/A'}</td>
              <td>{item.DateCheckout || 'N/A'}</td>
              <td>{item.Overdue || 'N/A'}</td>
              <td>{item.Note || 'N/A'}</td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="warning" size="sm">
                    <IconifyIcon icon="mdi:pencil" className="me-1" /> Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    <IconifyIcon icon="mdi:trash-can-outline" className="me-1" /> Delete
                  </Button>
                  <Button variant="info" size="sm">
                    <IconifyIcon icon="mdi:information-outline" className="me-1" /> Details
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-3">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}

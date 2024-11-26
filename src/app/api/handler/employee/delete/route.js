import { NextResponse } from 'next/server';
import EmployeeService from '../../../services/EmployeeService';

const employeeService = new EmployeeService();

// POST /api/handler/employee/delete
export async function POST(request) {
  try {
    const data = await request.json();
    const res = await employeeService.deleteEmployee(data.ID);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

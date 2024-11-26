import { NextResponse } from 'next/server';
import EmployeeService from '../../services/EmployeeService';

const employeeService = new EmployeeService();

// GET /api/handler/employee
export async function GET() {
  try {
    const users = await employeeService.getAllEmployees();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// POST /api/handler/employee
export async function POST(request) {
  try {
    const data = await request.json();
    const newUser = await employeeService.createEmployee(data);
    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

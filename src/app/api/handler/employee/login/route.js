import { NextResponse } from 'next/server';
import EmployeeService from '../../../services/EmployeeService';

const employeeService = new EmployeeService();

// POST /api/employee/handler/login
export async function POST(request) {
  try {
    const { Userlogin, Password } = await request.json();
    const result = await employeeService.login(Userlogin, Password);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

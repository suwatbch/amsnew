import { NextResponse } from 'next/server';
import BuildService from '../../services/BuildService';
const employeeService = new BuildService();

// GET /api/handler/building
export async function GET() {
  try {
    const building = await employeeService.getAllBuild();
    return NextResponse.json(building);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
 
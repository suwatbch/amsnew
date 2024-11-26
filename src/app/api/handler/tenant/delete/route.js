import { NextResponse } from 'next/server';
import TenantService from '../../../services/TenantService';

const tenantService = new TenantService();

export async function POST(req, res) {
    const body = await req.json();
    console.log('body55555555555555555555555555555555555555555555555555555555555555555555555555555', body);
    
  try {
    const result = await tenantService.deleteTenant(Number(body.ID));
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

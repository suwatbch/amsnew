import { NextResponse } from 'next/server';
import TenantService from '../../../services/TenantService';

const tenantService = new TenantService();

export async function GET(req, res) {
  try {
    const tenants = await tenantService.getAllTenants();
    return NextResponse.json(tenants, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

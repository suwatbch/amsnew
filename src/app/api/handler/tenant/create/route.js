import { NextResponse } from 'next/server';
import TenantService from '../../../services/TenantService';

const tenantService = new TenantService();

export async function POST(req, res) {
  try {
    const body = await req.json();
    const tenant = await tenantService.createTenants(body);
    return NextResponse.json(tenant, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

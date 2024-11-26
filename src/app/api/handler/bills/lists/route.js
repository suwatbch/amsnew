import { NextResponse } from 'next/server';
import BillService from '../../../services/BillService';

const billService = new BillService();

export async function GET(req, res) {
  try {
    const bill = await billService.getBillAll();
    return NextResponse.json(bill, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

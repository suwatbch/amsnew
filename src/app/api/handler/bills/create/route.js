import { NextResponse } from 'next/server';
import BillService from '../../../services/BillService';

const billService = new BillService();

export async function POST(req, res) {
  try {
    const data = await req.json();
    const bill = await billService.createBill(data);
    return NextResponse.json(bill, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

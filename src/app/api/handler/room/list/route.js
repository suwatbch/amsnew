import { NextResponse } from 'next/server';
import RoomService from '../../../services/RoomService';

const roomService = new RoomService();

export async function POST(req, res) {
  try {
    console.log(req);
    
    const body = await req.json();
    const buildingID = await roomService.getRoomByBuildingNumber(body);
    return NextResponse.json(buildingID, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

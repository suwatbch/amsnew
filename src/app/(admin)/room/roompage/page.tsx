'use client';

import getRoomByBuildingNumber from '@/api/axios/room';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import TableRoom from './components/TableRoom';
import LinearProgress from '@mui/material/LinearProgress';
const RoomPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // ดึงค่า id จาก query string

  const [room, setRoom] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getRoom = async (id: string) => {
    try {
      const roomData = await getRoomByBuildingNumber(id);
      console.log('Room data:', roomData);
      setRoom(roomData);
    } catch (error) {
      console.error('Error fetching room data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      router.push('/'); // ถ้าไม่มี id ให้กลับไปหน้าอื่น
    } else {
      console.log('ID ที่ได้จาก URL:', id);
      getRoom(id);
    }
  }, [id, router]);

  return (
    <>
      {loading ? (
          <LinearProgress /> 
      ) : room.length > 0 ? (
        <div>
          <TableRoom borderTableData={room} />
        </div>
      ) : (
        <div>ไม่มีข้อมูลห้อง</div>
      )}
    </>
  );
};

export default RoomPage;

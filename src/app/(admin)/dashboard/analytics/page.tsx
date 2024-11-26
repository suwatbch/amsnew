'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cardbuttom from './components/Cardbuttom'
import getAllBuilding from '@/api/axios/building'
import LinearProgress from '@mui/material/LinearProgress';
const RoomPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [buildingData, setBuildingData] = useState<any[]>([]) 

  const handleNavigate = (ID: number) => {
    router.push(`/room/roompage?id=${ID}`) 
  }

  const allBuilding = async () => {
    try {
      const resBuilding = await getAllBuilding() 
      setBuildingData(resBuilding) 
    } catch (error) {
      console.error('Error fetching building data:', error)
    }
  }

  useEffect(() => {
    allBuilding() 
  }, [])

  return (
    <div>
      {buildingData.length > 0 ? ( 
        buildingData.map((building: any) => (
          <Cardbuttom
            key={building.ID}
            buildingData={building}
            onNavigate={handleNavigate}
          />
        ))
      ) : (
        <LinearProgress /> 
      )}
    </div>
  )
}

export default RoomPage

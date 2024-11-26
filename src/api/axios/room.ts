import axios from 'axios'

const url = 'http://localhost:3000'

const getRoomByBuildingNumber = async (ID: any) => {
    console.log(ID);
    
  const response = await axios.post(`${url}/api/handler/room/list`, ID )
  return response.data
}

export default getRoomByBuildingNumber

import axios from "axios"

const url = 'http://localhost:3000'

const getAllBuilding = async () => {
  const response = await axios.get(`${url}/api/handler/building`)
  return response.data
}

export default getAllBuilding
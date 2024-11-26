import axios from 'axios'

const url = 'http://localhost:3000'

const createtenant = async (datatenant: any) => {
  console.log(datatenant)
  const data = { ...datatenant }
  const response = await axios.post(`${url}/api/handler/tenant/create`, data)
  return response.data
}
const updatetenant = async (id: any, datatenant: any) => {
  console.log(datatenant)
  const data = { id: id, ...datatenant }
  const response = await axios.post(`${url}/api/handler/tenant/create`, data)
  return response.data
}
const deletetenant = async (id: any) => {
 
  const data = { ID: id }
  const response = await axios.post(`${url}/api/handler/tenant/delete`, data)
  return response.data
}

const gettenant = async () => {
  const response = await axios.get(`${url}/api/handler/tenant/lists`)
  return response.data
}

export { createtenant, gettenant, updatetenant ,deletetenant}

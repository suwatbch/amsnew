import axios from "axios"
import { BillData } from "../types/data";

export const getAllBills = async (): Promise<BillData> => {
  const response = await axios.get(`/api/handler/bills/lists`)
  return response.data
}

export const getBillById = async (id: number | string): Promise<BillData> => {
    const response = await axios.post<BillData>(`/api/handler/bills/search`,{ID :id});
    return response.data
  };

// export const createBill = async (data:any) => {
//     const response = await axios.get(`/api/handler/bills/create` {
//         ...data
//     })
//     return response
// }
  
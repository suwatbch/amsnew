import axios from 'axios';

export const getThaiApi = async () => {
  const response = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
  console.log(response.data);
  return response.data;
}

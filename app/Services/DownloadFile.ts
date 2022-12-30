import axios from 'axios'

export default async function DownloadFile(url: string): Promise<any> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
    headers: { 'User-Agent': 'Axios 1.2.1' },
  })

  return response.data
}

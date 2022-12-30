import axios from 'axios'

export default async function DownloadFile(url: string): Promise<any> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  })

  return response.data
}

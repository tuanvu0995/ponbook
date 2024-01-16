export async function customFetch(url, options = {}) {
  const { headers } = options || {}

  const customHeaders = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  }

  const customOptions = {
    ...options,
    headers: customHeaders,
  }

  const response = await fetch(url, customOptions).catch((err) => {
    console.error(err)
    throw new Error('There was an error during the request. Please try again.')
  })

  if (!customHeaders['Content-Type'].includes('application/json')) {
    return response.text()
  }

  const rspData = await response.json()

  if (!response.ok) {
    throw new Error(
      (Array.isArray(rspData.errors) && rspData.errors[0].message) ||
        'Something went wrong. Please try again.'
    )
  }

  return rspData
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface IRetryOptions {
  retriesCount: number
  delay: number
}

export default async function retry(
  asyncFunc: () => Promise<any>,
  { retriesCount = 3, delay = 1000 }: IRetryOptions
): Promise<any> {
  try {
    return await asyncFunc()
  } catch (error) {
    if (retriesCount <= 0) {
      throw error
    }
    await new Promise((resolve) => setTimeout(resolve, delay))
    return retry(asyncFunc, { retriesCount: retriesCount - 1, delay })
  }
}

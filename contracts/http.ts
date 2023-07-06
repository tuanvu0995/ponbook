declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    pagination?: {
      page: number
      limit: number
    }
  }
}

class Api {
  API_BASE_HOST: string = import.meta.env.VITE_API_BASE_URL
  API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL + '/api'

  async getPublic<T>(url: string): Promise<T> {
    if (!url.startsWith('/')) throw new Error('Url must start with /')

    const res = await fetch(this.API_BASE_URL + url)
    const data = await res.json()
    return data
  }

  async publicFetch<T>(url: string, method = 'GET', body: Record<string, any>): Promise<T> {
    if (!url.startsWith('/')) throw new Error('Url must start with /')

    const res = await fetch(this.API_BASE_URL + url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    })
    const data = await res.json()
    return data
  }

  async authenticatedFetch<T>(url: string, method = 'GET', body: Record<string, any>): Promise<T> {
    if (!url.startsWith('/')) throw new Error('Url must start with /')

    const access_token = localStorage.getItem('access_token')
    if (!access_token) throw new Error('User not authenticated')

    const headers: Record<string, string> = {
      Authorization: `Bearer ${access_token}`
    };
    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(this.API_BASE_URL + url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })
    const data = await res.json()
    return data
  }
}

export default new Api
import { useNavigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import type { ApiResponseLogin, HttpMethod } from "./declarations"
import { UnauthorizedError } from "./errors/unauthorized.error"
import { UnexistingError } from "./errors/unexisting.error"

class Api {
  API_BASE_HOST: string = import.meta.env.VITE_API_BASE_URL
  API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL + '/api'

  async login(email: string, password: string): Promise<ApiResponseLogin> {
    const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/auth/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    const data: ApiResponseLogin = await res.json()
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    return data
  }

  async refreshAccessToken(): Promise<ApiResponseLogin> {
    const refresh_token = localStorage.getItem('refresh_token')

    if(!refresh_token) throw new UnexistingError

    const res = await fetch(this.API_BASE_URL + '/auth/refresh', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refresh_token}`
      },
    })
    const data: ApiResponseLogin = await res.json()
    console.log(data)
    // localStorage.setItem('access_token', data.access_token)

    return data
  }

  async getPublic<T>(url: string): Promise<T> {
    if (!url.startsWith('/')) throw new Error('Url must start with /')

    const res = await fetch(this.API_BASE_URL + url)
    const data = await res.json()
    return data
  }

  async publicFetch<T>(url: string, method: HttpMethod = 'GET', body: Record<string, any>): Promise<T> {
    if (!url.startsWith('/')) throw new Error('Url must start with /')

    const res = await fetch(this.API_BASE_URL + url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    })
    const data = await res.json()
    return data
  }

  async authenticatedFetch<T>(url: string, method: HttpMethod = 'GET', body?: Record<string, any>): Promise<T> {
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
    if(res.status === 401) throw new UnauthorizedError()
    const data = await res.json()
    return data
  }

  async authenticatedForm<T>(url: string, method: HttpMethod = 'GET', formData: FormData): Promise<T> {
    if (!url.startsWith('/')) throw new Error('Url must start with /')

    const access_token = localStorage.getItem('access_token')
    if (!access_token) throw new Error('User not authenticated')

    const headers: Record<string, string> = {
      Authorization: `Bearer ${access_token}`
    };

    const res = await fetch(this.API_BASE_URL + url, {
      method,
      headers,
      body: formData
    })
    const data = await res.json()
    return data
  }
}

export default new Api
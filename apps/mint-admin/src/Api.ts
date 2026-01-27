import config from "./config"
import type { ApiProfile, ApiRace, ApiResponseLogin, ApiResponseRegister, CreateRaceDTO, HttpMethod, Organization, UserRole } from "./declarations"
import { UnauthorizedError } from "./errors/unauthorized.error"
import { UnexistingError } from "./errors/unexisting.error"

class Api {
  API_BASE_HOST: string = config.API_BASE_URL
  API_BASE_URL: string = config.API_BASE_URL
  WS_BASE_URL: string = config.WS_URL

  async login(email: string, password: string): Promise<ApiResponseLogin> {
    const res = await fetch(config.API_BASE_URL + '/auth/login', {
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

    return data
  }

  async register(email: string, password: string, firstname: string, lastname: string, role: UserRole): Promise<ApiResponseRegister> {
    const res = await fetch(config.API_BASE_URL + '/auth/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        firstname,
        lastname,
        role
      })
    })
    const data: ApiResponseRegister = await res.json()

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

  async authenticatedFetchToWs<T>(url: string, method: HttpMethod = 'GET', body?: Record<string, any>): Promise<T> {
    if (!url.startsWith('/')) throw new Error('Url must start with /')

    const access_token = localStorage.getItem('access_token')
    if (!access_token) throw new Error('User not authenticated')

    const headers: Record<string, string> = {
      Authorization: `Bearer signature-s3cr3t`
    };
    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(this.WS_BASE_URL + url, {
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

  async getRaces(): Promise<ApiRace[]> {
    const races = await this.authenticatedFetch<ApiRace[]>(`/race`)
    return races
  }

  async getMe(): Promise<ApiProfile> {
    const profile = await this.authenticatedFetch<ApiProfile>(`/users/profile`)
    return profile
  }

  async createOrganization(name: string) {
    const createdOrganization: Organization = await this.authenticatedFetch(`/organizations`, "POST", { name })
    return createdOrganization
  }

  async getOrganizations() {
    const organizations = await this.authenticatedFetch<Organization[]>(`/organizations`)
    return organizations
  }

  async createRace(createRaceDTO: CreateRaceDTO) {
    const race = await this.authenticatedFetch<ApiRace>(`/race`, "POST", createRaceDTO)
    const wsRace = await this.authenticatedFetchToWs(`/races`, "POST", {
      id: race._id,
      startDate: createRaceDTO.startDate,
      endDate: createRaceDTO.endDate,
      runnerIds: createRaceDTO.runners,
      gpx: createRaceDTO.gpxFile
    })

    return [race, wsRace]
  }
}

export default new Api
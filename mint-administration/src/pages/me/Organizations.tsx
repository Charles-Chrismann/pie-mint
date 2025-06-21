import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { Organization } from "@/declarations"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function OrganizationsPage() {
  const [myOrgs, setMyOrgs] = useState<Organization[]>([])

  useEffect(() => {
    async function fetchMyOrgs() {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/me/organizations', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token') as string
        }
      })
      const data: Organization[] = await res.json()
      setMyOrgs(data)
    }

    fetchMyOrgs()
  }, [])

  return (
    <div>
      <div>
        <h1>Mes Organisations</h1>
        <div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-8">
            {
              myOrgs.map(o =>
                <li key={o.id}>
                  <Link to={`./${o.id}`}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{o.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              )
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
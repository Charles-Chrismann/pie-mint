import Api from "@/Api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApiResponseCreateOrganization, Organization } from "@/declarations"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function OrganizationsPage() {
  const [myOrgs, setMyOrgs] = useState<Organization[]>([])

  // forms
  const [orgName, setOrgname] = useState("")
  const [orgLogo, setOrgLogo] = useState<File>()
  const [orgBanner, setOrgBanner] = useState<File>()

  function handleLogoUpload(e: React.FormEvent<HTMLInputElement>) {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (file) setOrgLogo(file);
  }

  function handleBannerUpload(e: React.FormEvent<HTMLInputElement>) {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (file) setOrgBanner(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form);
    const createdOrg = await Api.authenticatedForm<ApiResponseCreateOrganization>('/organizations', "POST", formData)
    setMyOrgs([...myOrgs, createdOrg])
  }

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

      <div>
        <Card className="w-100">
          <CardHeader>
            <CardTitle>Créer une organization</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="createOrgForm"
              onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={orgName}
                    onInput={(e) => setOrgname((e.target as HTMLInputElement).value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    onInput={handleLogoUpload}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="banner">Banner</Label>
                  <Input
                    id="banner"
                    name="banner"
                    type="file"
                    accept="image/*"
                    onInput={handleBannerUpload}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              form="createOrgForm"
            >
              Créer une organization
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
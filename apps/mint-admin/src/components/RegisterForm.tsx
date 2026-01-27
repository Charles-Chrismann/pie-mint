import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { UserRole } from "@/declarations"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [firstname, setFirstname] = useState<string>()
  const [lastname, setLastname] = useState<string>()
  const [role, setRole] = useState<UserRole>("coureur")
  const { register } = useAuth();

  async function handleEmailPasswordLogin() {
    await register({
      email: email!,
      password: password!,
      firstname: firstname!,
      lastname: lastname!,
      role
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required onInput={(e) => setPassword((e.target as HTMLInputElement).value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder="John"
                  required
                  onInput={(e) => setFirstname((e.target as HTMLInputElement).value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Doe"
                  required
                  onInput={(e) => setLastname((e.target as HTMLInputElement).value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Lastname</Label>
                <Select
                  value={role}
                  onValueChange={(e: UserRole) => setRole(e)}
                >
                  <SelectTrigger className="w-full" id="role">
                    <SelectValue placeholder="Choisir un role" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      ['coureur', 'organisateur'].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  disabled={!(email && password && firstname && lastname)}
                  onClick={handleEmailPasswordLogin}
                  type="button"
                  className="w-full"
                >
                  Créer le compte
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account ?{" "}
              <Link
                to={"../login"}
                className="underline underline-offset-4"
              >Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const navigate = useNavigate()

  async function loginAsTestUser() {
    const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/auth/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "user@example.com",
        password: "password"
      })
    })
    const data: { access_token: string } = await res.json()
    localStorage.setItem('access_token', data.access_token)
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {
        import.meta.env.MODE === "development" &&
        <div className="absolute top-20">
          <p>test user:</p>
          <p>email: <span className="font-bold">user@example.com</span></p>
          <p>password: <span className="font-bold">password</span></p>
          <Button onClick={loginAsTestUser}>Se connecter</Button>
        </div>
      }
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
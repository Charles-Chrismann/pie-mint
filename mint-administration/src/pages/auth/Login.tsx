import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const navigate = useNavigate()
  const { login } = useAuth()

  async function loginAsTestUser() {
    await login("user@example.com", "password")
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
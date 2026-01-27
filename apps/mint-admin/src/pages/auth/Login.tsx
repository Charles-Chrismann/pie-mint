import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth()

  async function l(email: string, password: string) {
    login(email, password)
  }

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 gap-8">
      {
        import.meta.env.MODE === "development" &&
        <div className="flex gap-4">
          <div className="top-20">
            <p>Organisateur:</p>
            <p>email: <span className="font-bold">orga@example.com</span></p>
            <p>password: <span className="font-bold">1234567890</span></p>
            <Button
              onClick={() => l("orga@example.com", "1234567890")}
            >Se connecter</Button>
          </div>
          <div className="top-20">
            <p>Runner:</p>
            <p>email: <span className="font-bold">runner@example.com</span></p>
            <p>password: <span className="font-bold">1234567890</span></p>
            <Button
              onClick={() => l("runner@example.com", "1234567890")}
            >Se connecter</Button>
          </div>
        </div>
      }
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
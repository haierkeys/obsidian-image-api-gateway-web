import { useState } from "react"
import { useAuth } from "./components/context/auth-context"
import { LoginForm } from "@/components/user/login-form"
import { RegisterForm } from "@/components/user/register-form"
import { StorageList } from "@/components/storage/storage-list"

function App() {
  const { isLoggedIn, login } = useAuth()

  const [isRegistering, setIsRegistering] = useState(false)

  const handleLoginSuccess = () => {
    login()
  }

  const handleRegisterSuccess = () => {
    login()
    setIsRegistering(false)
  }

  return (
    <div className="flex justify-center">
      <div className="rounded-lg border text-card-foreground shadow-sm w-[800px] m-10 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">{isLoggedIn ? <StorageList /> : isRegistering ? <RegisterForm onSuccess={handleRegisterSuccess} onBackToLogin={() => setIsRegistering(false)} /> : <LoginForm onSuccess={handleLoginSuccess} onRegister={() => setIsRegistering(true)} />}</div>
    </div>
  )
}

export default App

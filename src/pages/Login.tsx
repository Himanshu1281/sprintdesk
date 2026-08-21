import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { loginApi } from '../api/auth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/useToast'

export function Login() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { toast } = useToast()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async () => {
    if (!username || !password) return
    setIsLoading(true)
    try {
      const data = await loginApi(username.trim(), password.trim())
      setAuth(data, data.accessToken, data.refreshToken, rememberMe)
      navigate(from, { replace: true })
    } catch (error: any) {
      console.error("Login API Error:", error?.response?.data || error)
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "Please check your username and password.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 border rounded-xl p-8 bg-card shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign in to SprintDesk</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Use DummyJSON credentials (e.g., emilys / emilyspass)
          </p>
        </div>
        <div 
          className="mt-8 space-y-6" 
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none mb-2 block" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none mb-2 block" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              {password && (
                <div className="mt-2 flex gap-1 h-1 w-full">
                  {[1, 2, 3, 4].map((level) => {
                    let score = 0;
                    if (password.length > 5) score++;
                    if (password.length > 8) score++;
                    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
                    if (/[^A-Za-z0-9]/.test(password)) score++;
                    
                    let bg = "bg-muted";
                    if (score >= level) {
                      if (score <= 1) bg = "bg-destructive";
                      else if (score === 2) bg = "bg-orange-500";
                      else if (score === 3) bg = "bg-yellow-500";
                      else bg = "bg-primary";
                    }
                    return <div key={level} className={`flex-1 rounded-full ${bg} transition-colors`} />
                  })}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me (30 days)
              </label>
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  )
}
